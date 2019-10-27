import React, { useEffect, useRef } from 'react'
import useStore from './store'

export default function Connection() {
  const socket = useStore(state => state.socket)
  const mutation = useStore(state => state.mutation)
  let connected = false

  socket.on('connect', () => {
    connected = true
    console.log('> Connected to server')
  })
  socket.on('disconnect', () => {
    console.log('> Disconnected')
    connected = false
  })

  function update() {
    socket.emit('player-state', {
      position: mutation.position,
      direction: mutation.direction
    })
  }

  useEffect(() => {
    const i = setInterval(update, 50)
    return () => clearInterval(i)
  })

  return <></>
}
