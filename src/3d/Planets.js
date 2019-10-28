import * as THREE from 'three'
import { useLoader } from 'react-three-fiber'
import React, { useRef } from 'react'
import earthImg from '../images/earth.jpg'
import moonImg from '../images/moon.png'

export default function Planets() {
  const ref = useRef()
  const [texture, moon] = useLoader(THREE.TextureLoader, [earthImg, moonImg])
  return (
    <group position={[-500, -500, 1000]} ref={ref} scale={[100, 100, 100]}>
      <mesh>
        <sphereBufferGeometry args={[5, 32, 32]} attach="geometry" />
        <meshStandardMaterial attach="material" fog={false} map={texture} roughness={1} />
      </mesh>
      <mesh position={[5, -5, -5]}>
        <sphereBufferGeometry args={[0.75, 32, 32]} attach="geometry" />
        <meshStandardMaterial attach="material" fog={false} map={moon} roughness={1} />
      </mesh>
      <pointLight distance={1000} intensity={6} position={[-5, -5, -5]} />
      <mesh position={[-30, -10, -60]}>
        <sphereBufferGeometry args={[4, 32, 32]} attach="geometry" />
        <meshBasicMaterial attach="material" color="#FFFF99" fog={false} />
        <pointLight color="white" distance={6100} intensity={50} />
      </mesh>
    </group>
  )
}
