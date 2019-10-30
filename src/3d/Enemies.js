import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFrame, useLoader } from 'react-three-fiber'
import React, { useEffect, useRef } from 'react'
import useStore from '../store'

const geometry = new THREE.BoxBufferGeometry(1, 1, 40)
const lightgreen = new THREE.Color('lightgreen')
const laserMaterial = new THREE.MeshBasicMaterial({ color: lightgreen })

export default function Enemies() {
  const enemies = useStore(state => state.enemies)
  return enemies.map((data, i) => <Drone {...data} key={i} />)
}

function Drone(data) {
  const { clock } = useStore(state => state.mutation)
  const lasers = useStore(state => state.lasers).filter(l => l.socketId === data.socketId)
  const laserGroup = useRef()
  const gltf = useLoader(GLTFLoader, '/ship.gltf')
  const exhaust = useRef()
  const laserLight = useRef()
  const main = useRef()
  const group = useRef()

  useEffect(() => {
    if (data.position) {
      group.current.position.copy(data.position)
      group.current.rotation.copy(data.rotation)
      main.current.position.copy(data.shipPosition)
      main.current.rotation.copy(data.shipRotation)
    }
  }, [data])

  useFrame(() => {
    //group.current.translateZ(-1.0)
    for (let i = 0; i < lasers.length; i++) {
      const group = laserGroup.current.children[i]
      group.position.z -= 20
    }
    exhaust.current.scale.x = 1 + Math.sin(clock.getElapsedTime() * 200)
    exhaust.current.scale.y = 1 + Math.sin(clock.getElapsedTime() * 200)
  })

  return (
    <group ref={group} visible={data.isAlive}>
      <pointLight color="indianred" distance={400} intensity={5} position={[0, 100, -420]} />
      <group position={[0, 0, -50]}>
        <group ref={main}>
          <group scale={[3.5, 3.5, 3.5]}>
            <pointLight color="lightgreen" distance={100} intensity={0} position={[0, 0, -20]} ref={laserLight} />
            <group ref={laserGroup}>
              {lasers.map((t, i) => (
                <group key={i}>
                  <mesh geometry={geometry} material={laserMaterial} position={[-2.8, 0, -0.8]} />
                  <mesh geometry={geometry} material={laserMaterial} position={[2.8, 0, -0.8]} />
                </group>
              ))}
            </group>
            <group rotation={[Math.PI / 2, Math.PI, 0]}>
              <mesh name="Renault_(S,_T1)_0">
                <bufferGeometry attach="geometry" {...gltf.__$[5].geometry} />
                <meshStandardMaterial attach="material" color="#070707" />
              </mesh>
              <mesh name="Renault_(S,_T1)_1">
                <bufferGeometry attach="geometry" {...gltf.__$[6].geometry} />
                <meshStandardMaterial attach="material" color="black" />
              </mesh>
              <mesh name="Renault_(S,_T1)_2">
                <bufferGeometry attach="geometry" {...gltf.__$[7].geometry} />
                <meshStandardMaterial attach="material" color="#070707" />
              </mesh>
              <mesh name="Renault_(S,_T1)_3">
                <bufferGeometry attach="geometry" {...gltf.__$[8].geometry} />
                <meshBasicMaterial attach="material" color="lightblue" />
              </mesh>
              <mesh name="Renault_(S,_T1)_4">
                <bufferGeometry attach="geometry" {...gltf.__$[9].geometry} />
                <meshBasicMaterial attach="material" color="white" />
              </mesh>
              <mesh name="Renault_(S,_T1)_5">
                <bufferGeometry attach="geometry" {...gltf.__$[10].geometry} />
                <meshBasicMaterial attach="material" color="teal" />
              </mesh>
            </group>
          </group>
          <mesh position={[0, 1, 30]} ref={exhaust} scale={[1, 1, 30]}>
            <dodecahedronBufferGeometry args={[1.5, 0]} attach="geometry" />
            <meshBasicMaterial attach="material" color="lightblue" />
          </mesh>
        </group>
      </group>
    </group>
  )
}
