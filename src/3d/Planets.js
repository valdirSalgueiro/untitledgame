import * as THREE from 'three'
import { useLoader } from 'react-three-fiber'
import React, { useRef } from 'react'
import earthImg from '../images/earth.jpg'
import moonImg from '../images/moon.png'

export default function Planets() {
  const ref = useRef()
  const [texture] = useLoader(THREE.TextureLoader, [earthImg, moonImg])
  return (
    <group position={[0, 0, 0]} ref={ref} scale={[100, 100, 100]}>
      <mesh>
        <sphereBufferGeometry args={[5, 32, 32]} attach="geometry" />
        <meshStandardMaterial attach="material" fog={false} map={texture} roughness={1} />
      </mesh>
    </group>
  )
}
