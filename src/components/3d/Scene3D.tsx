import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import SimpleDNA from './SimpleDNA';

interface Scene3DProps {
  animation?: 'dna';
  className?: string;
  autoRotate?: boolean;
}

const Scene3D = ({ animation = 'dna', className = "", autoRotate = true }: Scene3DProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {/* Controls */}
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
          />
          
          {/* 3D Content */}
          <SimpleDNA />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;