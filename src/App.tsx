import { Canvas } from '@react-three/fiber'
import { PointerLockControls, Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Player, type PlayerRef } from './components/Player'
import { Ground } from './components/Ground'
import { Cubes } from './components/Cubes'
import { Apple } from './components/Apple'
import { VirtualJoystick } from './components/VirtualJoystick'
import { ThrowButton } from './components/ThrowButton'
import { useRef, useState, useCallback } from 'react'
import './App.css'

interface AppleData {
  id: number
  position: [number, number, number]
  velocity: [number, number, number]
}

function App() {
  const playerRef = useRef<PlayerRef>(null)
  const [apples, setApples] = useState<AppleData[]>([])
  const [virtualJoystickInput, setVirtualJoystickInput] = useState({ x: 0, y: 0 })
  const [isMobile] = useState(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768
  })

  const handleThrowApple = useCallback((position: [number, number, number], velocity: [number, number, number]) => {
    const newApple: AppleData = {
      id: Date.now() + Math.random(),
      position,
      velocity
    }
    setApples(prev => [...prev, newApple])
    
    // Remove apple after 10 seconds to prevent memory buildup
    setTimeout(() => {
      setApples(prev => prev.filter(apple => apple.id !== newApple.id))
    }, 10000)
  }, [])

  const handleJoystickMove = useCallback((x: number, y: number) => {
    setVirtualJoystickInput({ x, y })
  }, [])

  const handleThrowButtonPress = useCallback(() => {
    playerRef.current?.throwApple()
  }, [])
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ fov: 75 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} />
        <Physics gravity={[0, -30, 0]}>
          <Player 
            ref={playerRef}
            onThrowApple={handleThrowApple}
            virtualJoystickInput={virtualJoystickInput}
          />
          <Ground />
          <Cubes />
          {apples.map(apple => (
            <Apple
              key={apple.id}
              position={apple.position}
              velocity={apple.velocity}
            />
          ))}
        </Physics>
        <PointerLockControls />
      </Canvas>
      
      {/* Crosshair */}
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
          {isMobile 
            ? 'Use joystick to move • Tap apple button to throw'
            : 'Click to lock pointer • WASD to move • Mouse to look'
          }
        </div>
      </div>

      {/* Mobile Controls */}
      {isMobile && (
        <>
          <VirtualJoystick onMove={handleJoystickMove} />
          <ThrowButton onThrow={handleThrowButtonPress} />
        </>
      )}
    </div>
  )
}

export default App
