import { useEffect } from 'react'
import { useBox } from '@react-three/cannon'

interface AppleProps {
  position: [number, number, number]
  velocity: [number, number, number]
  onCollide?: () => void
}

export const Apple = ({ position, velocity, onCollide }: AppleProps) => {
  const [ref, api] = useBox(() => ({
    mass: 0.5,
    position,
    args: [0.3, 0.3, 0.3], // Smaller than cubes
    material: {
      friction: 0.1,
      restitution: 0.8, // Bouncy
    },
  }))

  // Set initial velocity
  useEffect(() => {
    api.velocity.set(velocity[0], velocity[1], velocity[2])
  }, [api, velocity])

  // Handle collision detection
  useEffect(() => {
    if (onCollide) {
      const unsubscribe = api.collisionResponse.subscribe((value) => {
        if (value) {
          onCollide()
        }
      })
      return unsubscribe
    }
  }, [api, onCollide])

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshLambertMaterial color="red" />
    </mesh>
  )
}