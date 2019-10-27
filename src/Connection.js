import React, { useRef, useEffect } from 'react'
import useStore from './store'

export default function Connection () {
  const socket = useStore(state => state.socket)
  let connected = false

  socket.on('connect', () => {
    connected = true
    console.log('> Connected to server')
  })
  socket.on('disconnect', () => {
    console.log('> Disconnected')
    connected = false
  })

  useEffect(() => {
    const i = setInterval(() => {}, 50)
    return () => clearInterval(i)
  }, [])

  return (<></>)
}
