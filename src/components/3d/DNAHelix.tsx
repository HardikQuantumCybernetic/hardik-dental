import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const helixPoints = [];
  const helixCount = 40;
  
  for (let i = 0; i < helixCount; i++) {
    const t = (i / helixCount) * Math.PI * 4;
    const y = (i / helixCount) * 6 - 3;
    const radius = 1.5;
    
    // First helix strand
    helixPoints.push({
      x: Math.cos(t) * radius,
      y: y,
      z: Math.sin(t) * radius,
      strand: 1
    });
    
    // Second helix strand (opposite)
    helixPoints.push({
      x: Math.cos(t + Math.PI) * radius,
      y: y,
      z: Math.sin(t + Math.PI) * radius,
      strand: 2
    });
  }

  return (
    <group ref={groupRef}>
      {/* DNA spheres */}
      {helixPoints.map((point, index) => (
        <Sphere
          key={index}
          position={[point.x, point.y, point.z]}
          args={[0.08, 8, 8]}
        >
          <meshStandardMaterial 
            color={point.strand === 1 ? "#4F46E5" : "#06B6D4"} 
            transparent={true}
            opacity={0.8}
          />
        </Sphere>
      ))}
      
      {/* Connection lines between base pairs */}
      {Array.from({ length: helixCount }, (_, i) => {
        const t = (i / helixCount) * Math.PI * 4;
        const y = (i / helixCount) * 6 - 3;
        const radius = 1.5;
        
        const pos1 = [Math.cos(t) * radius, y, Math.sin(t) * radius];
        const pos2 = [Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius];
        
        return (
          <Cylinder
            key={`connection-${i}`}
            position={[(pos1[0] + pos2[0]) / 2, y, (pos1[2] + pos2[2]) / 2]}
            args={[0.02, 0.02, Math.sqrt(Math.pow(pos2[0] - pos1[0], 2) + Math.pow(pos2[2] - pos1[2], 2)), 8]}
            rotation={[0, 0, Math.atan2(pos2[2] - pos1[2], pos2[0] - pos1[0])]}
          >
            <meshStandardMaterial color="#10B981" transparent={true} opacity={0.6} />
          </Cylinder>
        );
      })}
    </group>
  );
};

export default DNAHelix;