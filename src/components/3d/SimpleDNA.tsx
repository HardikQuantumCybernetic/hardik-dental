import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SimpleDNA = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  // Create helix points
  const helixPoints = [];
  const helixCount = 20; // Reduced for better performance
  
  for (let i = 0; i < helixCount; i++) {
    const t = (i / helixCount) * Math.PI * 2;
    const y = (i / helixCount) * 4 - 2;
    const radius = 1;
    
    // First strand
    helixPoints.push({
      x: Math.cos(t) * radius,
      y: y,
      z: Math.sin(t) * radius,
      color: "#4F46E5"
    });
    
    // Second strand
    helixPoints.push({
      x: Math.cos(t + Math.PI) * radius,
      y: y,
      z: Math.sin(t + Math.PI) * radius,
      color: "#06B6D4"
    });
  }

  return (
    <group ref={groupRef}>
      {helixPoints.map((point, index) => (
        <mesh key={index} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={point.color} />
        </mesh>
      ))}
    </group>
  );
};

export default SimpleDNA;