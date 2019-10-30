import * as THREE from 'three'
import React, { useEffect } from 'react'
import useStore from './store'

export default function Connection() {
  const socket = useStore(state => state.socket)
  const mutation = useStore(state => state.mutation)
  const actions = useStore(state => state.actions)

  console.log('connection')

  socket.on('connect', () => {
    console.log('> Connected to server')
    actions.connect(true)
  })

  socket.on('disconnect', () => {
    console.log('> Disconnected')
    actions.connect(false)
  })

  socket.on('bootstrap', data => {
    actions.connect(true)
    console.log('> bootstrap')
    console.log(data.players)
    //actions.setSocketId(data.socketId)
    mutation.socketId = data.socketId
    for (const key of Object.keys(data.players)) {
      actions.addPlayer(key)
    }
  })

  socket.on('player-add', data => {
    console.log('player-add')
    console.log(data)
    actions.addPlayer(data)
  })

  socket.on('player-hit', data => {
    console.log('player-hit')
    console.log(data)
    actions.hitPlayer(data)
  })

  socket.on('player-spawn', data => {
    console.log('player-spawn')
    console.log(data)
    actions.spawnPlayer(data)
  })

  socket.on('player-remove', data => {
    actions.removePlayer(data)
  })

  socket.on('player-update', data => {
    actions.updatePlayer(data)
  })

  socket.on('player-shoot', data => {
    actions.shoot(data)
  })

  function update() {
    socket.emit('player-update', {
      position: mutation.player.position,
      rotation: mutation.player.rotation,
      shipRotation: mutation.shipRotation,
      shipPosition: mutation.shipPosition,
      worldPosition: mutation.worldPosition
    })
  }

  useEffect(() => {
    const i = setInterval(update, 50)
    return () => clearInterval(i)
  })

  return <></>
}
