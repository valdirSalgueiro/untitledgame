import React, { useRef } from 'react'
import Ship from './Ship'
import useStore from '../store'

export default function Enemies() {
  const enemies = useStore(state => state.enemies)
  return enemies.map((data, i) => <Ship data={data} key={i} />)
}
