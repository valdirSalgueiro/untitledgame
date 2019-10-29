import * as THREE from 'three'
import * as audio from './audio'
import create from 'zustand'
import io from 'socket.io-client'

const [useStore, api] = create((set, get) => {
  let cancelLaserTO
  const socket = io('http://localhost:5000')

  return {
    sound: false,
    camera: undefined,
    points: 0,
    health: 100,
    lasers: [],
    explosions: [],
    socket,

    enemies: [],

    mutation: {
      t: 0,
      player: new THREE.Object3D(),
      shipRotation: new THREE.Euler(0, 0, 0, 'YXZ'),
      shipPosition: new THREE.Vector3(),
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
      },
      shoot(socketId) {
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
          enemies: [...state.enemies, { socketId: id, hit: new THREE.Vector3() }]
        }))
      },
      removePlayer(id) {
        console.log('removing player')
        console.log(id)
        set(state => ({
          enemies: state.enemies.filter(e => e.socketId !== id)
        }))
      },
      updatePlayer(data) {
        set(state => ({ enemies: updateEnemies(state.enemies, data) }))
      },
      toggleSound(sound = !get().sound) {
        set({ sound })
        playAudio(audio.engine, 1, true)
        playAudio(audio.engine2, 0.3, true)
        playAudio(audio.bg, 1, true)
      },
      updateMouse({ clientX: x, clientY: y }) {
        get().mutation.mouse.set(x - window.innerWidth / 2, y - window.innerHeight / 2)
        get().mutation.mouseRelative.set(-0.5 + x / window.innerWidth, -0.5 + y / window.innerHeight)
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
