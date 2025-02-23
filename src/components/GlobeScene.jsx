import { Canvas } from "@react-three/fiber";
import Globe from "./Globe";

/**
 * GlobeScene component that renders the 3D globe within a Canvas
 */
export default function GlobeScene({ selectedCountry }) {
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [250, 0, 270], fov: 50 }} className="w-full h-full">
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 5, 5]} intensity={3.5} />
        <Globe selectedCountry={selectedCountry} />
      </Canvas>
      
      {/* Fade overlays */}
      <div className="absolute top-0 left-0 w-full h-[250px] bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.2)_70%,rgba(0,0,0,0.1)_85%,rgba(0,0,0,0)_100%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[250px] bg-[linear-gradient(to_top,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.2)_70%,rgba(0,0,0,0.1)_85%,rgba(0,0,0,0)_100%)] pointer-events-none" />
    </div>
  );
}
