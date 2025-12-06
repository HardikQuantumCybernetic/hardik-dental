import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

const RotatingTooth = () => {
  const toothRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (toothRef.current) {
      toothRef.current.rotation.y = state.clock.elapsedTime * (hovered ? 1 : 0.3);
      toothRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group 
      ref={toothRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      {/* Tooth Crown */}
      <Sphere position={[0, 1, 0]} args={[0.8, 16, 16]}>
        <meshStandardMaterial 
          color="#F8FAFC" 
          roughness={0.1}
          metalness={0.05}
        />
      </Sphere>
      
      {/* Tooth Root */}
      <Cylinder position={[0, -0.5, 0]} args={[0.3, 0.5, 1.5, 8]}>
        <meshStandardMaterial 
          color="#FEF3C7" 
          roughness={0.2}
        />
      </Cylinder>
      
      {/* Enamel highlight */}
      <Sphere position={[0.2, 1.2, 0.2]} args={[0.1, 8, 8]}>
        <meshStandardMaterial 
          color="#FFFFFF" 
          transparent={true}
          opacity={0.8}
          emissive="#E0F2FE"
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      {/* Pulp (when hovered) */}
      {hovered && (
        <Sphere position={[0, 0.8, 0]} args={[0.3, 8, 8]}>
          <meshStandardMaterial 
            color="#EF4444" 
            transparent={true}
            opacity={0.6}
            emissive="#FCA5A5"
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}
    </group>
  );
};

export default RotatingTooth;