import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFrame, useLoader, useThree } from 'react-three-fiber'
import React, { useRef } from 'react'
import useStore from '../store'

const geometry = new THREE.BoxBufferGeometry(1, 1, 40)
const lightgreen = new THREE.Color('lightgreen')
const hotpink = new THREE.Color('hotpink')
const laserMaterial = new THREE.MeshBasicMaterial({ color: lightgreen })
const crossMaterial = new THREE.MeshBasicMaterial({ color: hotpink, fog: false })
const position = new THREE.Vector3()
const direction = new THREE.Vector3()

export default function Ship() {
  const { camera } = useThree()
  const gltf = useLoader(GLTFLoader, '/ship.gltf')
  const mutation = useStore(state => state.mutation)
  const actions = useStore(state => state.actions)
  const { clock, mouse, ray } = mutation
  const lasers = useStore(state => state.lasers)
  const enemies = useStore(state => state.enemies)
  const main = useRef()
  const laserGroup = useRef()
  const laserLight = useRef()
  const exhaust = useRef()
  const cross = useRef()
  const target = useRef()
  const mesh = useRef()
  const group = useRef()

  useFrame(() => {
    main.current.rotation.z += (-mouse.x / 500 - main.current.rotation.z) * 0.1
    main.current.rotation.x += (-mouse.y / 1200 - main.current.rotation.x) * 0.1
    main.current.rotation.y += (-mouse.x / 1200 - main.current.rotation.y) * 0.1
    main.current.position.x += (mouse.x / 10 - main.current.position.x) * 0.1
    main.current.position.y += (25 + -mouse.y / 10 - main.current.position.y) * 0.1
    exhaust.current.scale.x = 1 + Math.sin(clock.getElapsedTime() * 200)
    exhaust.current.scale.y = 1 + Math.sin(clock.getElapsedTime() * 200)

    for (let i = 0; i < lasers.length; i++) {
      const group = laserGroup.current.children[i]
      group.position.z -= 10
    }
    laserLight.current.intensity += ((lasers.length && Date.now() - lasers[lasers.length - 1] < 100 ? 20 : 0) - laserLight.current.intensity) * 0.3

    // Get ships orientation and save it to the stores ray
    main.current.getWorldPosition(position)
    main.current.getWorldDirection(direction)
    ray.origin.copy(position)
    ray.direction.copy(direction.negate())

    group.current.position.copy(mutation.player.position)
    group.current.quaternion.copy(mutation.player.quaternion)

    camera.position.copy(mutation.player.position)
    camera.rotation.copy(mutation.player.rotation)
    mutation.shipPosition.copy(main.current.position)
    mutation.shipRotation.copy(main.current.rotation)

    // ...
    crossMaterial.color = mutation.hits ? lightgreen : hotpink
    cross.current.visible = !mutation.hits
    target.current.visible = !!mutation.hits
  })

  return (
    <group ref={group}>
      <pointLight color="indianred" distance={400} intensity={5} position={[0, 100, -420]} />
      <group position={[0, 0, -50]}>
        <group ref={main}>
          <group scale={[3.5, 3.5, 3.5]}>
            <group name="cross" position={[0, 0, -300]} ref={cross}>
              <mesh material={crossMaterial} renderOrder={1000}>
                <boxBufferGeometry args={[20, 2, 2]} attach="geometry" />
              </mesh>
              <mesh material={crossMaterial} renderOrder={1000}>
                <boxBufferGeometry args={[2, 20, 2]} attach="geometry" />
              </mesh>
            </group>
            <group name="target" position={[0, 0, -300]} ref={target}>
              <mesh material={crossMaterial} position={[0, 20, 0]} renderOrder={1000}>
                <boxBufferGeometry args={[40, 2, 2]} attach="geometry" />
              </mesh>
              <mesh material={crossMaterial} position={[0, -20, 0]} renderOrder={1000}>
                <boxBufferGeometry args={[40, 2, 2]} attach="geometry" />
              </mesh>
              <mesh material={crossMaterial} position={[20, 0, 0]} renderOrder={1000}>
                <boxBufferGeometry args={[2, 40, 2]} attach="geometry" />
              </mesh>
              <mesh material={crossMaterial} position={[-20, 0, 0]} renderOrder={1000}>
                <boxBufferGeometry args={[2, 40, 2]} attach="geometry" />
              </mesh>
            </group>
            <pointLight color="lightgreen" distance={100} intensity={0} position={[0, 0, -20]} ref={laserLight} />
            <group ref={laserGroup}>
              {lasers.map((t, i) => (
                <group key={i}>
                  <mesh geometry={geometry} material={laserMaterial} position={[-2.8, 0, -0.8]} />
                  <mesh geometry={geometry} material={laserMaterial} position={[2.8, 0, -0.8]} />
                </group>
              ))}
            </group>
            <group ref={mesh} rotation={[Math.PI / 2, Math.PI, 0]}>
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
