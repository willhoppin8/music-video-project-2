import { Canvas } from "@react-three/fiber";
import Globe from "./Globe";
import { COLORS } from "../constants/colors";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

// Default bloom values (when no country is selected)
const DEFAULT_BLOOM = {
  intensity: 0.1,
  luminanceThreshold: 0.3,
  luminanceSmoothing: 1.5,
  mipmapBlur: true,
  levels: 10
};

// Selected state bloom values (when a country is selected)
const SELECTED_BLOOM = {
  intensity: 0.5,
  luminanceThreshold: 0.3,
  luminanceSmoothing: 1.5,
  mipmapBlur: true,
  levels: 4.3
};

// Component to handle bloom effect interpolation
function BloomEffect({ selectedCountry }) {
  const [bloomValues, setBloomValues] = useState({
    intensity: DEFAULT_BLOOM.intensity,
    luminanceThreshold: DEFAULT_BLOOM.luminanceThreshold,
    luminanceSmoothing: DEFAULT_BLOOM.luminanceSmoothing,
    levels: DEFAULT_BLOOM.levels
  });

  // Track previous selected state to handle transitions
  const prevSelectedRef = useRef(null);

  useEffect(() => {
    prevSelectedRef.current = selectedCountry;
  }, [selectedCountry]);

  useFrame(() => {
    const transitionSpeed = 0.1;
    const target = selectedCountry ? SELECTED_BLOOM : DEFAULT_BLOOM;

    // Update values with state setter to ensure consistency
    setBloomValues(current => ({
      intensity: current.intensity + (target.intensity - current.intensity) * transitionSpeed,
      luminanceThreshold: current.luminanceThreshold + (target.luminanceThreshold - current.luminanceThreshold) * transitionSpeed,
      luminanceSmoothing: current.luminanceSmoothing + (target.luminanceSmoothing - current.luminanceSmoothing) * transitionSpeed,
      levels: current.levels + (target.levels - current.levels) * transitionSpeed
    }));
  });

  return (
    <EffectComposer>
      <Bloom 
        intensity={bloomValues.intensity}
        luminanceThreshold={bloomValues.luminanceThreshold}
        luminanceSmoothing={bloomValues.luminanceSmoothing}
        mipmapBlur={true}
        levels={bloomValues.levels}
      />
    </EffectComposer>
  );
}

/**
 * GlobeScene component that renders the 3D globe within a Canvas
 */
export default function GlobeScene({ selectedCountry }) {
  return (
    <div className="relative w-full h-full" style={{ backgroundColor: COLORS.DARK_STATE }}>
      <Canvas 
        camera={{ position: [250, 0, 270], fov: 50 }} 
        className="w-full h-full"
        style={{ background: COLORS.DARK_STATE }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[50, 5, -35]} intensity={3.2} />
        <Globe selectedCountry={selectedCountry} />
        <BloomEffect selectedCountry={selectedCountry} />
      </Canvas>
      
      {/* Fade overlays */}
      <div 
        className="absolute top-0 left-0 w-full h-[250px] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${COLORS.DARK_STATE} 0%, ${COLORS.DARK_STATE}D9 15%, ${COLORS.DARK_STATE}99 30%, ${COLORS.DARK_STATE}66 50%, ${COLORS.DARK_STATE}33 70%, ${COLORS.DARK_STATE}1A 85%, transparent 100%)`
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-full h-[250px] pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${COLORS.DARK_STATE} 0%, ${COLORS.DARK_STATE}D9 15%, ${COLORS.DARK_STATE}99 30%, ${COLORS.DARK_STATE}66 50%, ${COLORS.DARK_STATE}33 70%, ${COLORS.DARK_STATE}1A 85%, transparent 100%)`
        }}
      />
    </div>
  );
}
