import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { extend, useFrame, useThree } from 'react-three-fiber'
import React, { useEffect, useRef } from 'react'

extend({ EffectComposer, ShaderPass, RenderPass, UnrealBloomPass, FilmPass })

export default function Effects() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 2)
  return (
    <effectComposer args={[gl]} ref={composer}>
      <renderPass attachArray="passes" camera={camera} scene={scene} />
      <unrealBloomPass args={[undefined, 1.6, 1, 0]} attachArray="passes" />
      <filmPass args={[0.05, 0.5, 1500, false]} attachArray="passes" />
    </effectComposer>
  )
}
