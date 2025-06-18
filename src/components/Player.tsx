import { useRef, useEffect } from 'react'
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

export const Player = () => {
  const { camera } = useThree()
  const [ref, api] = useBox(() => ({
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const field = moveFieldByKey(e.code)
      if (field) {
        movement.current[field as keyof typeof movement.current] = true
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
  }, [])

  useFrame(() => {
    camera.position.copy(new Vector3(pos.current[0], pos.current[1], pos.current[2]))

    const frontVector = new Vector3(0, 0, -1).applyEuler(camera.rotation)
    const sideVector = new Vector3(-1, 0, 0).applyEuler(camera.rotation)

    const direction = new Vector3()
    const speed = SPEED

    if (movement.current.forward) direction.add(frontVector)
    if (movement.current.backward) direction.sub(frontVector)
    if (movement.current.left) direction.add(sideVector)
    if (movement.current.right) direction.sub(sideVector)

    direction.normalize().multiplyScalar(speed)

    api.velocity.set(direction.x, vel.current[1], direction.z)
  })

  return <mesh ref={ref} visible={false} />
}