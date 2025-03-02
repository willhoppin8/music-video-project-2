import { Canvas } from "@react-three/fiber";
import Globe from "./Globe";
import { COLORS } from "../constants/colors";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

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
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 5, 5]} intensity={3.5} />
        <Globe selectedCountry={selectedCountry} />
        <EffectComposer>
          <Bloom 
            intensity={1.0}
            luminanceThreshold={5.0}
            luminanceSmoothing={10.0}
            mipmapBlur={false}
          />
        </EffectComposer>
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
