import * as THREE from 'three'
import * as audio from './audio'
import { addEffect } from 'react-three-fiber'
import create from 'zustand'
import io from 'socket.io-client'

let guid = 1

const [useStore, api] = create((set, get) => {
  let cancelLaserTO
  let cancelExplosionTO = undefined
  const box = new THREE.Box3()
  const socket = io(':5000')

  return {
    sound: false,
    camera: undefined,
    connected: false,
    playerName: 'Type your name',
    points: 0,
    distance: 0,
    health: 100,
    lasers: [],
    explosions: [],
    socket,
    isAlive: false,
    spawned: false,

    enemies: [],

    mutation: {
      t: 0,
      player: new THREE.Object3D(),
      shipRotation: new THREE.Euler(0, 0, 0, 'YXZ'),
      shipPosition: new THREE.Vector3(),
      worldPosition: new THREE.Vector3(),
      startTime: Date.now(),
      socketId: 'offline',

      scale: 1,
      fov: 70,
      hits: false,
      looptime: 40 * 1000,
      binormal: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      clock: new THREE.Clock(false),
      mouse: new THREE.Vector2(-250, 50),
      mouseRelative: new THREE.Vector2(0, 0),

      // Re-usable objects
      dummy: new THREE.Object3D(),
      ray: new THREE.Ray(),
      box: new THREE.Box3()
    },

    actions: {
      init(camera) {
        const { mutation, actions } = get()

        set({ camera })
        mutation.clock.start()
        actions.toggleSound(get().sound)

        addEffect(() => {
          const { enemies, mutation } = get()

          const a = new THREE.Vector3(0, 0, 0)
          const distance = Math.round(a.distanceTo(mutation.player.position))
          if (distance < 530) {
            actions.killPlayer()
          }

          set({ distance })

          const time = Date.now()

          // test for hits
          const e = enemies.filter(actions.test)
          mutation.hits = e.length
          const lasers = get().lasers.filter(l => l.socketId === mutation.socketId)
          //if (lasers.length > 0) console.log(e)
          if (mutation.hits && lasers.length && time - lasers[lasers.length - 1].time < 100) {
            actions.hitPlayer(e[0].socketId)
            socket.emit('player-hit', e[0].socketId)

            const update = { ...e[0], time: Date.now(), guid: guid++, scale: 1 + Math.random() * 2.5, position: e[0].worldPosition }
            set(state => ({ explosions: [...state.explosions, update] }))
            clearTimeout(cancelExplosionTO)
            cancelExplosionTO = setTimeout(
              () =>
                set(state => ({
                  explosions: state.explosions.filter(({ time }) => Date.now() - time <= 1000)
                })),
              1000
            )
            set(state => ({
              points: state.points + 1
            }))
          }
        })
      },
      shoot(socketId) {
        if (!get().spawned) return

        if (!get().isAlive) {
          get().actions.spawn(true)
          return
        }
        set(state => ({ lasers: [...state.lasers, { time: Date.now(), socketId }] }))
        clearTimeout(cancelLaserTO)
        cancelLaserTO = setTimeout(
          () =>
            set(state => ({
              lasers: state.lasers.filter(t => Date.now() - t <= 1000)
            })),
          1000
        )
        playAudio(audio.zap, 0.5)
      },
      addPlayer(id) {
        console.log('adding player')
        console.log(id)
        set(state => ({
          enemies: [...state.enemies, { socketId: id, hit: new THREE.Vector3(), size: 10, scale: 1, isAlive: false }]
        }))
        console.log(get().enemies)
      },
      killPlayer() {
        set({ isAlive: false })
      },
      hitPlayer(id) {
        if (id === socket.id) {
          get().actions.killPlayer()
          return
        }
        set(state => ({
          enemies: state.enemies.map(item => {
            if (item.socketId !== id) {
              return item
            }

            return {
              ...item,
              ...{ isAlive: false }
            }
          })
        }))
      },
      spawnPlayer(id) {
        //console.log('spawnPlayer')
        //console.log(id)
        //console.log(get().enemies)
        set(state => ({
          enemies: state.enemies.map(item => {
            if (item.socketId !== id) {
              return item
            }

            return {
              ...item,
              ...{ isAlive: true }
            }
          })
        }))
        //console.log(get().enemies)
      },
      removePlayer(id) {
        //console.log('removing player')
        //console.log(id)
        set(state => ({
          enemies: state.enemies.filter(e => e.socketId !== id)
        }))
        //console.log(get().enemies)
      },
      updatePlayer(data) {
        set(state => ({ enemies: updateEnemies(state.enemies, data) }))
      },
      toggleSound(sound = !get().sound) {
        set({ sound })
        playAudio(audio.engine, 1, true)
        playAudio(audio.engine2, 0.3, true)
      },
      spawn(isAlive) {
        if (get().isAlive) return
        get().mutation.player.position.copy(new THREE.Vector3(0, 0, 1000))
        set({ isAlive })
        set({ spawned: true })
        socket.emit('player-spawn')
      },
      updateName(playerName) {
        set({ playerName })
      },
      isConnected() {
        return get().connected
      },
      connect(connected) {
        set({ connected })
      },
      updateMouse({ clientX: x, clientY: y }) {
        get().mutation.mouse.set(x - window.innerWidth / 2, y - window.innerHeight / 2)
        get().mutation.mouseRelative.set(-0.5 + x / window.innerWidth, -0.5 + y / window.innerHeight)
      },
      test(data) {
        if (data.isAlive && data.worldPosition) {
          box.min.copy(data.worldPosition)
          box.max.copy(data.worldPosition)
          box.expandByScalar(data.size * data.scale)
          data.hit.set(10000, 10000, 10000)
          const result = get().mutation.ray.intersectBox(box, data.hit)
          data.distance = get().mutation.ray.origin.distanceTo(data.hit)
          return result
        }
        return false
      }
    }
  }
})

function updateEnemies(enemies, data) {
  return enemies.map(item => {
    if (item.socketId !== data.socketId) {
      return item
    }

    return {
      ...item,
      ...data
    }
  })
}

function playAudio(audio, volume = 1, loop = false) {
  if (api.getState().sound) {
    audio.currentTime = 0
    audio.volume = volume
    audio.loop = loop
    audio.play()
  } else audio.pause()
}

export default useStore
export { audio, playAudio }
