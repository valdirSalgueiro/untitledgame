import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFrame, useLoader } from 'react-three-fiber'
import React, { useRef } from 'react'
import useStore from '../store'

export default function Enemies() {
  const enemies = useStore(state => state.enemies)
  return enemies.map((data, i) => <Drone data={data} key={i} />)
}

const box = new THREE.Box3()
box.setFromCenterAndSize(new THREE.Vector3(0, 0, 1), new THREE.Vector3(3, 3, 3))
const glowMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('lightblue') })

const Drone = React.memo(({ data }) => {
  const { clock } = useStore(state => state.mutation)
  const gltf = useLoader(GLTFLoader, '/drone.gltf')
  const ref = useRef()

  useFrame(() => {
    const r = Math.cos((clock.getElapsedTime() / 2) * data.speed) * Math.PI
    ref.current.position.copy(data.offset)
    ref.current.rotation.set(r, r, r)
  })

  return (
    <group ref={ref} scale={[5, 5, 5]}>
      <mesh material={glowMaterial} position={[0, 0, 50]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderBufferGeometry args={[0.25, 0.25, 100, 4]} attach="geometry" />
      </mesh>
      <mesh name="Sphere_DroneGlowmat_0">
        <bufferGeometry attach="geometry" {...gltf.__$[7].geometry} />
        <meshStandardMaterial attach="material" {...gltf.__$[7].material} name="DroneGlowmat" />
      </mesh>
      <mesh material={glowMaterial} name="Sphere_Body_0">
        <bufferGeometry attach="geometry" {...gltf.__$[8].geometry} />
        <meshStandardMaterial attach="material" {...gltf.__$[8].material} name="Body" />
      </mesh>
    </group>
  )
})
