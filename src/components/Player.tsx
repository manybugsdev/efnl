import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { Vector3 } from 'three'

const SPEED = 5
const keys = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
}

const moveFieldByKey = (key: string) => keys[key as keyof typeof keys]

interface PlayerProps {
  onThrowApple?: (position: [number, number, number], velocity: [number, number, number]) => void
  virtualJoystickInput?: { x: number; y: number }
}

export interface PlayerRef {
  throwApple: () => void
}

export const Player = forwardRef<PlayerRef, PlayerProps>(({ onThrowApple, virtualJoystickInput }, ref) => {
  const { camera } = useThree()
  const [meshRef, api] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 10, 0],
  }))

  const vel = useRef([0, 0, 0])
  const pos = useRef([0, 10, 0])

  useEffect(() => {
    api.velocity.subscribe((velocity) => (vel.current = velocity))
    api.position.subscribe((position) => (pos.current = position))
  }, [api])

  const movement = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  // Add throwing functionality
  const throwApple = useCallback(() => {
    if (onThrowApple) {
      const playerPos = pos.current
      const cameraRotation = camera.rotation
      
      // Calculate throw direction based on camera rotation
      const frontVector = new Vector3(0, 0, -1).applyEuler(cameraRotation)
      const throwForce = 15
      
      // Starting position slightly in front of player
      const startPos: [number, number, number] = [
        playerPos[0] + frontVector.x,
        playerPos[1] + 0.5, // Slightly above player center
        playerPos[2] + frontVector.z
      ]
      
      // Velocity for the apple
      const velocity: [number, number, number] = [
        frontVector.x * throwForce,
        5, // Add some upward velocity
        frontVector.z * throwForce
      ]
      
      onThrowApple(startPos, velocity)
    }
  }, [onThrowApple, camera])

  useImperativeHandle(ref, () => ({
    throwApple
  }), [throwApple])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const field = moveFieldByKey(e.code)
      if (field) {
        movement.current[field as keyof typeof movement.current] = true
      }
      
      // Handle apple throwing with Space key
      if (e.code === 'Space') {
        e.preventDefault()
        throwApple()
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const field = moveFieldByKey(e.code)
      if (field) {
        movement.current[field as keyof typeof movement.current] = false
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [throwApple])

  useFrame(() => {
    camera.position.copy(new Vector3(pos.current[0], pos.current[1], pos.current[2]))

    const frontVector = new Vector3(0, 0, -1).applyEuler(camera.rotation)
    const sideVector = new Vector3(-1, 0, 0).applyEuler(camera.rotation)

    const direction = new Vector3()
    const speed = SPEED

    // Keyboard movement
    if (movement.current.forward) direction.add(frontVector)
    if (movement.current.backward) direction.sub(frontVector)
    if (movement.current.left) direction.add(sideVector)
    if (movement.current.right) direction.sub(sideVector)

    // Virtual joystick movement (mobile)
    if (virtualJoystickInput) {
      const joystickFront = frontVector.clone().multiplyScalar(-virtualJoystickInput.y)
      const joystickSide = sideVector.clone().multiplyScalar(-virtualJoystickInput.x)
      direction.add(joystickFront).add(joystickSide)
    }

    direction.normalize().multiplyScalar(speed)

    api.velocity.set(direction.x, vel.current[1], direction.z)
  })

  return <mesh ref={meshRef} visible={false} />
})