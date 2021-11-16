import ReactDOM from 'react-dom'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, OrbitControls } from '@react-three/fiber'
import { Physics, useSphere, useBox } from '@react-three/cannon'

export default function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  // const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // ref.current.rotation.x += 0.01
    // ref.current.rotation.y += 0.01
    // ref.current.rotation.z += 0.01
    // ref.current.position.x += 0.01
    // ref.current.position.z += 0.01
      const time = state.clock.getElapsedTime();
      ref.current.position.y = ref.current.position.y + Math.sin(time*2)/100;
      ref.current.rotation.y = ref.current.rotation.x += 0.01;
  })
  // Return the view, these are regular Threejs elements expressed in JSX

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      // onPointerOver={(event) => hover(true)}
      // onPointerOut={(event) => hover(false)}
      receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
      {/*
        D4
        <tetrahedronGeometry args={[1, 0]} />
      */}
      {/*
        D6 
        <boxGeometry args={[1,1,1]} />
      */}
      {/*
        D8 
        <octahedronGeometry args={[1, 0]} />
      */}
      {/*
        D12 
        <dodecahedronGeometry args={[1, 0]} />
      */}
      {/*
        D20
        <icosahedronGeometry args={[1, 0]} />
      */}
      <meshStandardMaterial metalness={0.2} color={'orange'} />
    </mesh>
  )
}

ReactDOM.render(
  <Canvas
    camera={{ position: [0,0,0], near: 0, far: 0 }}
  >
    <ambientLight intensity={0.5} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
    <pointLight position={[-10, -10, -10]} />
    {/* <Box position={[-1, 0, 0]} /> */}
    <Box position={[0, 0, 0]} />
  </Canvas>,
  document.getElementById('root'),
)