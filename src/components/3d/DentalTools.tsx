import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

const DentalTools = () => {
  const toolsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (toolsRef.current) {
      toolsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      toolsRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <group ref={toolsRef}>
      {/* Toothbrush */}
      <group position={[-1.5, 0, 0]} rotation={[0, 0, 0.2]}>
        {/* Handle */}
        <Cylinder position={[0, -1, 0]} args={[0.08, 0.08, 2, 8]}>
          <meshStandardMaterial color="#3B82F6" />
        </Cylinder>
        
        {/* Brush head */}
        <Box position={[0, 0.2, 0]} args={[0.3, 0.4, 0.1]}>
          <meshStandardMaterial color="#1F2937" />
        </Box>
        
        {/* Bristles */}
        {Array.from({ length: 20 }, (_, i) => (
          <Cylinder
            key={i}
            position={[
              (i % 5 - 2) * 0.08,
              0.3 + Math.random() * 0.1,
              (Math.floor(i / 5) - 1.5) * 0.03
            ]}
            args={[0.005, 0.005, 0.15, 4]}
          >
            <meshStandardMaterial color="#FFFFFF" />
          </Cylinder>
        ))}
      </group>

      {/* Dental Mirror */}
      <group position={[1.5, 0, 0]} rotation={[0, 0, -0.2]}>
        {/* Handle */}
        <Cylinder position={[0, -1, 0]} args={[0.05, 0.05, 2, 8]}>
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </Cylinder>
        
        {/* Mirror */}
        <Sphere position={[0, 0.3, 0]} args={[0.25, 16, 16]}>
          <meshStandardMaterial 
            color="#E2E8F0" 
            metalness={0.9} 
            roughness={0.05}
            transparent={true}
            opacity={0.9}
          />
        </Sphere>
      </group>

      {/* Dental Floss */}
      <group position={[0, 1.5, 0]}>
        <Cylinder args={[0.3, 0.3, 0.1, 16]}>
          <meshStandardMaterial color="#10B981" />
        </Cylinder>
        
        {/* Floss string */}
        <Cylinder 
          position={[0.4, 0, 0]} 
          args={[0.01, 0.01, 0.8, 4]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <meshStandardMaterial color="#FFFFFF" />
        </Cylinder>
      </group>
    </group>
  );
};

export default DentalTools;