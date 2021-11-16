// import React, { useRef, Suspense } from 'react'
// import { Canvas, useLoader, useFrame } from '@react-three/fiber'
// import { TextureLoader } from 'three/src/loaders/TextureLoader'

// function Scene() {
//   // const colorMap = useLoader(TextureLoader, 'https://static.brusheezy.com/system/resources/previews/000/013/939/original/grunge-texture-by-krist-photoshop-textures.jpg')
//   const colorMap = useLoader(TextureLoader, 'https://image.shutterstock.com/z/stock-photo-brick-wall-with-red-brick-red-brick-background-1660485136.jpg')
//   const ref = useRef()

//     useFrame((state, delta) => {
//     // ref.current.rotation.x += 0.01
//     // ref.current.rotation.y += 0.01
//     // ref.current.rotation.z += 0.01
//     // ref.current.position.x += 0.01
//     // ref.current.position.z += 0.01
//       // const time = state.clock.getElapsedTime();
//       // ref.current.position.y = ref.current.position.y + Math.sin(time*2)/100;
//       // ref.current.rotation.y = ref.current.rotation.x += 0.01;
//   })
//   return (
//     <>
//       <ambientLight intensity={0.2} />
//       <directionalLight />
//       <mesh ref={ref}>
//         <boxGeometry args={[1, 1, 1]} />
//         <meshStandardMaterial displacementScale={0.2} map={colorMap}/>
//       </mesh>
//     </>
//   )
// }

// export default function Box() {
//   return (
//     <Canvas>
//       <Suspense fallback={null}>
//         <Scene />
//       </Suspense>
//     </Canvas>
//   )
// }


import React, { Suspense } from 'react'
import { Canvas, extend, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, Effects, Loader, useTexture } from '@react-three/drei'
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass'
import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader'

extend({ LUTPass })

// function Grading() {
//   const { texture3D } = useLoader(LUTCubeLoader, '/cubicle-99.CUBE')
//   return <Effects children={<lUTPass attachArray="passes" lut={texture3D} />} />
// }

function D20(props) {
  const texture = useTexture('https://static.brusheezy.com/system/resources/previews/000/058/030/non_2x/free-mandala-photoshop-brushes-8.jpg')
  return (
    <mesh {...props}>
      <icosahedronGeometry args={[0.75, 0]} />
      <meshPhysicalMaterial envMapIntensity={0.4} map={texture} clearcoat={1} clearcoatRoughness={0} roughness={1} metalness={0} />
    </mesh>
  )
}

function D6(props) {
  const texture = useTexture('https://static.brusheezy.com/system/resources/previews/000/017/500/non_2x/cloudy-texture-photoshop-textures.jpg')
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial envMapIntensity={0.4} map={texture} clearcoat={1} clearcoatRoughness={0} roughness={1} metalness={0} />
    </mesh>
  )
}
function D12(props) {
  const texture = useTexture('https://media.istockphoto.com/vectors/halftone-pattern-abstract-background-for-template-brochure-flyer-vector-id1267407074?s=612x612')
  return (
    <mesh {...props}>
      <dodecahedronGeometry args={[0.75, 0]} />
      <meshPhysicalMaterial envMapIntensity={0.4} map={texture} clearcoat={1} clearcoatRoughness={0} roughness={1} metalness={0} />
    </mesh>
  )
}

export default function Box() {
  return (
    <>
      <Canvas frameloop="demand" dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 120 }}>
        <spotLight intensity={0.5} angle={0.2} penumbra={1} position={[100, 0, 0]} />
        <Suspense fallback={null}>
          <D20 position={[0, 0, 0]}/>
          <D6 position={[-2, 0, 0]}/>
          <D12 position={[2, 0, 0]}/>
          {/* <Grading /> */}
          <Environment preset="warehouse" />
        </Suspense>
        <OrbitControls autoRotate/>
      </Canvas>
      <Loader />
    </>
  )
}
