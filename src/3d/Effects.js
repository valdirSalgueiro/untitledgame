import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { extend, useFrame, useThree } from 'react-three-fiber'
import React, { useEffect, useRef } from 'react'
import useStore from '../store'

extend({ EffectComposer, ShaderPass, RenderPass, UnrealBloomPass, FilmPass, GlitchPass })

export default function Effects() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const isAlive = useStore(state => state.isAlive)
  const spawned = useStore(state => state.spawned)
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 2)
  if (spawned && !isAlive)
    return (
      <effectComposer args={[gl]} ref={composer}>
        <renderPass attachArray="passes" camera={camera} scene={scene} />
        <glitchPass args={[undefined]} attachArray="passes" />
      </effectComposer>
    )
  return (
    <effectComposer args={[gl]} ref={composer}>
      <renderPass attachArray="passes" camera={camera} scene={scene} />
      <unrealBloomPass args={[undefined, 1.6, 1, 0]} attachArray="passes" />
      <filmPass args={[0.05, 0.5, 1500, false]} attachArray="passes" />
    </effectComposer>
  )
}
