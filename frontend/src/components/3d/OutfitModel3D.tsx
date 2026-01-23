import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Center } from '@react-three/drei';
import { Box } from '@mui/material';

// Color mapping for outfit categories
const OUTFIT_COLORS: Record<string, string> = {
  'top': '#FF6B6B',
  'bottom': '#4ECDC4',
  'dress': '#95E1D3',
  'outerwear': '#F38181',
  'full_body': '#AA96DA',
};

const DEFAULT_OUTFIT_COLOR = '#FDCB6E';

function OutfitDisplay({ category }: { category: string }) {
  // Choose shape and color based on category
  const getCategoryColor = (cat: string) => {
    return OUTFIT_COLORS[cat.toLowerCase()] || DEFAULT_OUTFIT_COLOR;
  };

  const color = getCategoryColor(category);

  return (
    <Center>
      <group>
        {/* Main outfit representation - a mannequin-like form */}
        {category === 'top' && (
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.2, 1.5, 0.6]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )}

        {category === 'bottom' && (
          <>
            <mesh position={[-0.3, -0.5, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 1.5, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.3, -0.5, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 1.5, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        )}

        {category === 'dress' && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.5, 2.5, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )}

        {(category === 'outerwear' || category === 'full_body' || !['top', 'bottom', 'dress'].includes(category)) && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.4, 2.5, 0.8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )}

        {/* Add a simple 3D text label */}
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    </Center>
  );
}

const OutfitModel3D = ({ category }: { category: string }) => {
  return (
    <Box sx={{ width: '100%', height: '400px', borderRadius: 2, overflow: 'hidden' }}>
      <Canvas style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, #667eea 0%, #764ba2 100%)' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 2, 2]} intensity={0.8} />

        {/* 3D Outfit Display */}
        <OutfitDisplay category={category} />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
    </Box>
  );
};

export default OutfitModel3D;
