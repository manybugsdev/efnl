import { usePlane } from '@react-three/cannon'

export const Ground = () => {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, 0, 0] 
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshLambertMaterial color="green" />
    </mesh>
  )
}