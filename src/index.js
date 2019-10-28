import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { ShipControls } from './ShipControls'
import Connection from './Connection'
import Effects from './3d/Effects'
import Enemies from './3d/Enemies'
import Explosions from './3d/Explosions'
import Hud from './Hud'
import Particles from './3d/Particles'
import Planets from './3d/Planets'
import React, { Suspense, useRef } from 'react'
import ReactDOM from 'react-dom'
import Rocks from './3d/Rocks'
import Ship from './3d/Ship'
import Stars from './3d/Stars'
import useStore from './store'

extend({ ShipControls })

function Controls() {
  const controls = useRef()
  const { player, mouseRelative } = useStore(state => state.mutation)
  useFrame(() => controls.current.update())
  return <shipControls args={[player, mouseRelative]} ref={controls} />
}

function App() {
  const { fov } = useStore(state => state.mutation)
  const actions = useStore(state => state.actions)
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 2000], near: 0.01, far: 10000, fov }}
        onClick={actions.shoot}
        onCreated={({ gl, camera }) => {
          actions.init(camera)
          gl.gammaInput = true
          gl.toneMapping = THREE.Uncharted2ToneMapping
          gl.setClearColor(new THREE.Color('#020207'))
        }}
        onPointerMove={actions.updateMouse}
      >
        <fog args={['black', 100, 700]} attach="fog" />
        <ambientLight intensity={0.25} />
        <Explosions />
        <Particles />
        <Controls />
        <Connection />
        <Suspense fallback={null}>
          <Planets />
          <Enemies />
          <Ship />
        </Suspense>
        <Effects />
      </Canvas>
      <Hud />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
