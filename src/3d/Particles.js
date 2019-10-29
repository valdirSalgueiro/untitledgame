import React, { useEffect, useRef } from 'react'

import useStore from '../store'

export default function Particles({ count = 3000 }) {
  const instancedMesh = useRef()
  const { dummy } = useStore(state => state.mutation)

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const r = 500
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      const x = r * Math.cos(theta) * Math.sin(phi) + (-200 + Math.random() * 400)
      const y = r * Math.sin(theta) * Math.sin(phi) + (-200 + Math.random() * 400)
      const z = r * Math.cos(phi) + 1000
      const scale = 0.5 + Math.random() * 0.5
      dummy.position.copy({ x, y, z })
      dummy.scale.set(scale, scale, scale)
      dummy.rotation.set(Math.sin(Math.random()) * Math.PI, Math.sin(Math.random()) * Math.PI, Math.cos(Math.random()) * Math.PI)
      dummy.updateMatrix()
      instancedMesh.current.setMatrixAt(i, dummy.matrix)
    }
    instancedMesh.current.instanceMatrix.needsUpdate = true
  }, [count, dummy])

  return (
    <instancedMesh args={[null, null, count]} frustumCulled={false} ref={instancedMesh}>
      <coneBufferGeometry args={[2, 2, 3]} attach="geometry" />
      <meshStandardMaterial attach="material" color="#606060" />
    </instancedMesh>
  )
}
