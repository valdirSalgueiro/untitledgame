import * as THREE from 'three'
import { useLoader } from 'react-three-fiber'
import React, { useRef } from 'react'
import earthImg from '../images/earth.jpg'

export default function Planets() {
  const ref = useRef()
  const [texture] = useLoader(THREE.TextureLoader, [earthImg])
  return (
    <group position={[0, 0, 0]} ref={ref} scale={[100, 100, 100]}>
      <mesh>
        <sphereBufferGeometry args={[5, 32, 32]} attach="geometry" />
        <meshStandardMaterial attach="material" fog={false} map={texture} roughness={1} />
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
