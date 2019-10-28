import * as THREE from 'three'
import { useFrame, useThree } from 'react-three-fiber'
import React, { useRef } from 'react'

export default function Rig({ children }) {
  const group = useRef()
  const rig = useRef()
  const { camera } = useThree()
  camera.position.copy(new THREE.Vector3())

  useFrame(() => {
    group.current.position.copy(camera.position)
    group.current.quaternion.copy(camera.quaternion)
  })

  return (
    <group ref={group}>
      <pointLight color="indianred" distance={400} intensity={5} position={[0, 100, -420]} />
      <group position={[0, 0, -50]} ref={rig}>
        {children}
      </group>
    </group>
  )
}
