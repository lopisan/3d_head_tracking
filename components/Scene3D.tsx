import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, SoftShadows, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { CottageRoom } from './CottageRoom';
import { HeadPosition } from '../types';

interface CameraRigProps {
  headPos: React.MutableRefObject<HeadPosition>;
  enableDepth: boolean;
}

// The Rig component handles the camera movement based on head position
const CameraRig: React.FC<CameraRigProps> = ({ headPos, enableDepth }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Smoothly interpolate current values to target values
  const currentPos = useRef(new THREE.Vector3(0, 0, 10));

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    // SENSITIVITY CONFIG
    const rangeX = 8; 
    const rangeY = 4;
    
    // Target position based on head tracker
    const targetX = headPos.current.x * rangeX;
    const targetY = (headPos.current.y * rangeY) + 2; // Offset up slightly
    
    // Z-AXIS LOGIC
    let targetZ = 12; // Default distance (further back for voxel scene)

    if (enableDepth) {
        // Map 0..2 to closer range
        targetZ = 8 + (headPos.current.z * 4);
    }
    
    // Clamp limits
    targetZ = Math.max(5, Math.min(18, targetZ));

    const targetVec = new THREE.Vector3(targetX, targetY, targetZ);

    // Lerp camera position for smoothness
    currentPos.current.lerp(targetVec, 4 * delta);

    cameraRef.current.position.copy(currentPos.current);
    
    // Focus Point - look at the center of the room
    cameraRef.current.lookAt(0, 0, 0); 
    
    // Idle animation when not tracking
    if (headPos.current.x === 0 && headPos.current.y === 0 && !enableDepth) {
       const time = state.clock.getElapsedTime();
       cameraRef.current.position.x += Math.sin(time * 0.3) * 0.5;
       cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={35} position={[0, 0, 12]} />;
};

interface Scene3DProps {
  headPosRef: React.MutableRefObject<HeadPosition>;
  enableDepth: boolean;
}

export const Scene3D: React.FC<Scene3DProps> = ({ headPosRef, enableDepth }) => {
  // Pastel Sky Color
  const skyColor = '#bde0fe';

  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
        <CameraRig headPos={headPosRef} enableDepth={enableDepth} />
        
        <color attach="background" args={[skyColor]} />
        <fog attach="fog" args={[skyColor, 10, 40]} />
        
        {/* Soft Shadows - lighter for pastel look */}
        <SoftShadows size={25} samples={10} focus={0.5} />
        
        <Suspense fallback={null}>
          <CottageRoom />
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ background: skyColor }}
        dataStyles={{ fontSize: '1rem', color: '#555' }} 
        barStyles={{ height: '4px', background: '#ffafcc' }}
      />
    </div>
  );
};