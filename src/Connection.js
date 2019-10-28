import React, { useEffect, useRef } from 'react'
import useStore from './store'

export default function Connection() {
  const socket = useStore(state => state.socket)
  const mutation = useStore(state => state.mutation)
  const actions = useStore(state => state.actions)

  console.log('connection')

  socket.on('connect', () => {
    console.log('> Connected to server')
  })

  socket.on('bootstrap', players => {
    console.log('> bootstrap')
    console.log(players)
    for (const key of Object.keys(players)) {
      actions.addPlayer(players[key])
    }
  })

  socket.on('player-add', data => {
    actions.addPlayer(data)
  })

  socket.on('player-remove', data => {
    actions.removePlayer(data)
  })

  socket.on('player-update', data => {
    actions.updatePlayer(data)
  })

  socket.on('disconnect', () => {
    console.log('> Disconnected')
  })

  function update() {
    socket.emit('player-update', {
      position: mutation.position,
      quaternion: mutation.quaternion,
      rotation: mutation.rotation
    })
  }

  useEffect(() => {
    const i = setInterval(update, 50)
    return () => clearInterval(i)
  })

  return <></>
}
