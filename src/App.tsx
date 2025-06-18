import { Canvas } from '@react-three/fiber'
import { PointerLockControls, Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Player } from './components/Player'
import { Ground } from './components/Ground'
import { Cubes } from './components/Cubes'
import './App.css'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ fov: 75 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} />
        <Physics gravity={[0, -30, 0]}>
          <Player />
          <Ground />
          <Cubes />
        </Physics>
        <PointerLockControls />
      </Canvas>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div>+</div>
        <div style={{ fontSize: '12px', marginTop: '20px' }}>
          Click to lock pointer • WASD to move • Mouse to look
        </div>
      </div>
    </div>
  )
}

export default App
