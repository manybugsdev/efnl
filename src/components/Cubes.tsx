import { useBox } from '@react-three/cannon'

const Cube = ({ position }: { position: [number, number, number] }) => {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
  }))

  return (
    <mesh castShadow ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color="orange" />
    </mesh>
  )
}

export const Cubes = () => {
  return (
    <>
      <Cube position={[0, 5, -10]} />
      <Cube position={[2, 5, -5]} />
      <Cube position={[-2, 5, -5]} />
      <Cube position={[4, 5, -8]} />
      <Cube position={[-4, 5, -8]} />
      <Cube position={[6, 5, -12]} />
      <Cube position={[-6, 5, -12]} />
      <Cube position={[0, 5, -15]} />
    </>
  )
}