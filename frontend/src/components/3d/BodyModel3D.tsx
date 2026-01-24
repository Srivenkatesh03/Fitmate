import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface BodyModel3DProps {
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  gender?: 'male' | 'female' | 'other';
  skinTone?: string;
}

// Average body measurements for scaling calculations
const AVERAGE_MEASUREMENTS = {
  HEIGHT: 170, // cm
  CHEST: 90,   // cm
  WAIST: 75,   // cm
  HIPS: 95,    // cm
};

// Default waist scale factor
const DEFAULT_WAIST_SCALE = 0.85;

// Skin tone color mapping
const SKIN_TONE_COLORS: Record<string, string> = {
  'fair': '#FFE4C4',
  'light': '#F5D5B8',
  'medium': '#D9A974',
  'tan': '#C68642',
  'brown': '#8D5524',
  'dark': '#5C3317',
};

function BodyMesh({ height = 170, chest = 90, waist = 75, hips = 95, gender = 'other', skinTone = '' }: BodyModel3DProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Normalize measurements to scale factors
  const heightScale = height / AVERAGE_MEASUREMENTS.HEIGHT;
  const chestScale = chest > 0 ? chest / AVERAGE_MEASUREMENTS.CHEST : 1;
  const waistScale = waist > 0 ? waist / AVERAGE_MEASUREMENTS.WAIST : DEFAULT_WAIST_SCALE;
  const hipsScale = hips > 0 ? hips / AVERAGE_MEASUREMENTS.HIPS : 1;

  // Choose color based on skin tone first, then gender as fallback
  let bodyColor = '#A8C4D6'; // Default color
  
  if (skinTone && SKIN_TONE_COLORS[skinTone]) {
    bodyColor = SKIN_TONE_COLORS[skinTone];
  } else if (gender === 'male') {
    bodyColor = '#6B9BD1';
  } else if (gender === 'female') {
    bodyColor = '#E8A0BF';
  }

  return (
    <group ref={meshRef}>
      {/* Head */}
      <mesh position={[0, 2.5 * heightScale, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2.1 * heightScale, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Torso - Upper (Chest) */}
      <mesh position={[0, 1.5 * heightScale, 0]}>
        <cylinderGeometry args={[0.35 * chestScale, 0.4 * chestScale, 0.8, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Torso - Middle (Waist) */}
      <mesh position={[0, 0.8 * heightScale, 0]}>
        <cylinderGeometry args={[0.3 * waistScale, 0.35 * chestScale, 0.6, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Torso - Lower (Hips) */}
      <mesh position={[0, 0.3 * heightScale, 0]}>
        <cylinderGeometry args={[0.35 * hipsScale, 0.3 * waistScale, 0.5, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Left Arm - Upper */}
      <mesh position={[-0.6 * chestScale, 1.5 * heightScale, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.12, 0.8, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Left Arm - Lower */}
      <mesh position={[-0.9 * chestScale, 0.9 * heightScale, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Right Arm - Upper */}
      <mesh position={[0.6 * chestScale, 1.5 * heightScale, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.12, 0.8, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Right Arm - Lower */}
      <mesh position={[0.9 * chestScale, 0.9 * heightScale, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Left Leg - Upper */}
      <mesh position={[-0.18 * hipsScale, -0.5 * heightScale, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 1, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Left Leg - Lower */}
      <mesh position={[-0.18 * hipsScale, -1.3 * heightScale, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 1, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Right Leg - Upper */}
      <mesh position={[0.18 * hipsScale, -0.5 * heightScale, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 1, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Right Leg - Lower */}
      <mesh position={[0.18 * hipsScale, -1.3 * heightScale, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 1, 12]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Left Foot */}
      <mesh position={[-0.18 * hipsScale, -1.9 * heightScale, 0.08]}>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Right Foot */}
      <mesh position={[0.18 * hipsScale, -1.9 * heightScale, 0.08]}>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
    </group>
  );
}

const BodyModel3D = (props: BodyModel3DProps) => {
  return (
    <Canvas style={{ width: '100%', height: '100%', background: '#f5f5f5' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <pointLight position={[0, 2, 2]} intensity={0.5} />

      {/* 3D Body Model */}
      <BodyMesh {...props} />

      {/* Grid Helper */}
      <gridHelper args={[10, 10]} position={[0, -2, 0]} />

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={10}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
};

export default BodyModel3D;
