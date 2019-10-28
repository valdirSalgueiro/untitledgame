import React, { useEffect, useRef } from 'react'
import useStore from '../store'

export default function Particles() {
  const instancedMesh = useRef()
  const { particles, dummy } = useStore(state => state.mutation)

  useEffect(() => {
    particles.forEach((particle, i) => {
      const { offset, scale } = particle
      dummy.position.copy(offset)
      dummy.scale.set(scale, scale, scale)
      dummy.rotation.set(Math.sin(Math.random()) * Math.PI, Math.sin(Math.random()) * Math.PI, Math.cos(Math.random()) * Math.PI)
      dummy.updateMatrix()
      instancedMesh.current.setMatrixAt(i, dummy.matrix)
    })
    instancedMesh.current.instanceMatrix.needsUpdate = true
  }, [dummy, particles])

  return (
    <instancedMesh args={[null, null, particles.length]} frustumCulled={false} ref={instancedMesh}>
      <coneBufferGeometry args={[2, 2, 3]} attach="geometry" />
      <meshStandardMaterial attach="material" color="#606060" />
    </instancedMesh>
  )
}
