import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// --- VOXEL ENGINE ---
// A simple reusable block component
const Voxel: React.FC<{ 
    position: [number, number, number], 
    color: string, 
    size?: [number, number, number] 
}> = ({ position, color, size = [1, 1, 1] }) => {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.8} // Matte look for pastel
        metalness={0.0} 
      />
    </mesh>
  );
};

// --- ASSETS ---

const VoxelDog: React.FC<any> = (props) => {
    const tailRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (tailRef.current) tailRef.current.rotation.z = Math.sin(t * 10) * 0.4;
        if (headRef.current) headRef.current.rotation.y = Math.sin(t * 1) * 0.2;
    });

    const fur = "#d4a373"; // Light brown
    const darkFur = "#a67c52";
    
    return (
        <group {...props}>
            {/* Body */}
            <Voxel position={[0, 0.6, 0]} size={[1.2, 0.8, 1.8]} color={fur} />
            
            {/* Legs */}
            <Voxel position={[-0.4, 0.2, 0.7]} size={[0.3, 0.6, 0.3]} color={darkFur} />
            <Voxel position={[0.4, 0.2, 0.7]} size={[0.3, 0.6, 0.3]} color={darkFur} />
            <Voxel position={[-0.4, 0.2, -0.7]} size={[0.3, 0.6, 0.3]} color={darkFur} />
            <Voxel position={[0.4, 0.2, -0.7]} size={[0.3, 0.6, 0.3]} color={darkFur} />
            
            {/* Head Group */}
            <group ref={headRef} position={[0, 1.1, 0.9]}>
                 <Voxel position={[0, 0, 0]} size={[0.9, 0.8, 0.8]} color={fur} />
                 {/* Ears */}
                 <Voxel position={[-0.5, 0.2, -0.1]} size={[0.2, 0.4, 0.3]} color={darkFur} />
                 <Voxel position={[0.5, 0.2, -0.1]} size={[0.2, 0.4, 0.3]} color={darkFur} />
                 {/* Nose */}
                 <Voxel position={[0, -0.1, 0.5]} size={[0.3, 0.2, 0.3]} color="#222" />
                 {/* Eyes */}
                 <Voxel position={[-0.25, 0.1, 0.41]} size={[0.1, 0.1, 0.05]} color="#000" />
                 <Voxel position={[0.25, 0.1, 0.41]} size={[0.1, 0.1, 0.05]} color="#000" />
            </group>

            {/* Tail */}
            <group ref={tailRef} position={[0, 0.8, -0.9]}>
                <Voxel position={[0, 0.3, -0.2]} size={[0.2, 0.6, 0.2]} color={darkFur} />
            </group>
        </group>
    );
};

const VoxelTable: React.FC<any> = (props) => {
    const wood = "#e6ccb2"; // Pale wood
    return (
        <group {...props}>
             <Voxel position={[0, 1.8, 0]} size={[3.5, 0.2, 2.5]} color={wood} />
             {/* Legs */}
             <Voxel position={[-1.5, 0.9, 1]} size={[0.3, 1.8, 0.3]} color={wood} />
             <Voxel position={[1.5, 0.9, 1]} size={[0.3, 1.8, 0.3]} color={wood} />
             <Voxel position={[-1.5, 0.9, -1]} size={[0.3, 1.8, 0.3]} color={wood} />
             <Voxel position={[1.5, 0.9, -1]} size={[0.3, 1.8, 0.3]} color={wood} />
        </group>
    )
}

const VoxelPlant: React.FC<any> = (props) => {
    return (
        <group {...props}>
            {/* Pot */}
            <Voxel position={[0, 0.3, 0]} size={[0.6, 0.6, 0.6]} color="#ddb892" />
            {/* Stem */}
            <Voxel position={[0, 0.8, 0]} size={[0.1, 0.6, 0.1]} color="#588157" />
            {/* Leaves */}
            <Voxel position={[0, 1.2, 0]} size={[0.4, 0.4, 0.4]} color="#8ab0ab" />
            <Voxel position={[0.3, 1, 0]} size={[0.3, 0.3, 0.3]} color="#8ab0ab" />
            <Voxel position={[-0.3, 1.1, 0]} size={[0.3, 0.3, 0.3]} color="#8ab0ab" />
            <Voxel position={[0, 1.3, 0.3]} size={[0.3, 0.3, 0.3]} color="#8ab0ab" />
        </group>
    )
}

const OutdoorTree: React.FC<any> = (props) => {
    return (
        <group {...props}>
            {/* Trunk */}
            <Voxel position={[0, 2, 0]} size={[1, 4, 1]} color="#6f4e37" />
            {/* Leaves */}
            <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
                <Voxel position={[0, 4.5, 0]} size={[3, 2, 3]} color="#a3b18a" />
                <Voxel position={[0, 6, 0]} size={[2, 2, 2]} color="#a3b18a" />
                <Voxel position={[1, 5, 1]} size={[1.5, 1.5, 1.5]} color="#dad7cd" />
                <Voxel position={[-1.2, 4, 0.5]} size={[1, 1, 1]} color="#588157" />
            </Float>
        </group>
    )
}

export const CottageRoom: React.FC = () => {
    // Pastel Palette
    const wallColor = "#fdfbf7"; // Cream
    const floorColor = "#d6ccc2"; // Greyish beige
    const lightSun = "#fff3b0"; // Warm pale yellow

    return (
        <group position={[0, -2.5, 0]}>
            {/* --- LIGHTING --- */}
            {/* High ambient for pastel look */}
            <ambientLight intensity={0.9} color="#ffffff" />
            
            {/* Sunlight coming through window */}
            <directionalLight 
                position={[10, 15, -10]} 
                intensity={1.5} 
                color={lightSun} 
                castShadow 
                shadow-bias={-0.001}
                shadow-mapSize={[2048, 2048]}
            />
            
            {/* Soft fill light from inside */}
            <pointLight position={[0, 5, 5]} intensity={0.3} color="#ffcdb2" />

            {/* --- ROOM SHELL --- */}
            
            {/* Floor */}
            <group position={[0, -0.5, 0]}>
                {/* 8x8 floor grid */}
                {Array.from({length: 8}).map((_, x) => 
                    Array.from({length: 8}).map((_, z) => {
                         // Checkerboard subtle variation
                         const tint = (x+z)%2 === 0 ? floorColor : "#e3d5ca";
                         return <Voxel key={`${x}-${z}`} position={[(x-4)*2 + 1, 0, (z-4)*2 + 1]} size={[2, 1, 2]} color={tint} />
                    })
                )}
            </group>

            {/* Back Wall with Window */}
            <group position={[0, 0, -7]}>
                {/* Left part */}
                <Voxel position={[-5, 4, 0]} size={[6, 10, 1]} color={wallColor} />
                {/* Right part */}
                <Voxel position={[5, 4, 0]} size={[6, 10, 1]} color={wallColor} />
                {/* Top part */}
                <Voxel position={[0, 7.5, 0]} size={[4, 3, 1]} color={wallColor} />
                {/* Bottom part */}
                <Voxel position={[0, 1, 0]} size={[4, 2, 1]} color={wallColor} />
            </group>

            {/* Side Walls */}
            <Voxel position={[-7.5, 4, 0]} size={[1, 10, 16]} color={wallColor} />
            <Voxel position={[7.5, 4, 0]} size={[1, 10, 16]} color={wallColor} />

            {/* --- INTERIOR OBJECTS --- */}

            <VoxelTable position={[0, 0, -1]} />
            <VoxelPlant position={[0.8, 2, -1.2]} />
            
            {/* The Dog on the floor */}
            <VoxelDog position={[-2.5, 0, 2]} rotation={[0, 0.5, 0]} />

            {/* --- OUTDOORS --- */}
            <group position={[0, -1, -15]}>
                {/* Ground */}
                <Voxel position={[0, -1, 0]} size={[20, 1, 10]} color="#b7b7a4" />
                
                {/* Tree visible through window */}
                <OutdoorTree position={[2, 0, 0]} />
                <OutdoorTree position={[-4, -0.5, 2]} scale={0.7} />
                
                {/* Clouds */}
                <Float speed={0.5} floatIntensity={0.5}>
                    <Voxel position={[-3, 8, -2]} size={[4, 1.5, 2]} color="#ffffff" />
                    <Voxel position={[5, 9, 1]} size={[3, 1, 2]} color="#ffffff" />
                </Float>
            </group>
        </group>
    );
};