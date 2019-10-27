import React, { useRef } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from 'react-three-fiber'
import useStore from '../store'

let offset = 0
export default function Rig({ children }) {
  const group = useRef()
  const rig = useRef()
  const mutation = useStore(state => state.mutation)
  const { fov, scale, binormal, normal, mouse } = mutation
  const { camera } = useThree()
  const pos = new THREE.Vector3()
  camera.position.copy(pos)

  useFrame(() => {
    group.current.position.copy(camera.position)
    //group.current.quaternion.setFromRotationMatrix(camera.matrix)
    group.current.quaternion.copy(camera.quaternion)
  })

  return (
    <group ref={group}>
      <pointLight distance={400} position={[0, 100, -420]} intensity={5} color="indianred" />
      <group ref={rig} position={[0, 0, -50]}>
        {children}
      </group>
    </group>
  )
}
