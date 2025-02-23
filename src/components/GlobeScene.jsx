import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { countries } from "../data/countries";
import { MATRIX_COLORS } from "../constants/colors";

/**
 * Globe component that renders a 3D model and highlights the selected country in green.
 */
function Globe({ selectedCountry }) {
  const { scene, nodes } = useGLTF("/globe.glb");
  const originalMaterials = useRef({});
  const globeRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetZoom = useRef(1.5);
  const { camera } = useThree();
  const customAxis = new THREE.Vector3(1, 0, -0.8).normalize();
  const targetQuaternion = useRef(new THREE.Quaternion());
  const defaultCameraDistance = 270;

  // Store original materials on first render
  useEffect(() => {
    Object.values(nodes).forEach((mesh) => {
      if (mesh.isMesh) {
        originalMaterials.current[mesh.name] = mesh.material.clone();
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(c => c.name === selectedCountry);
      if (country) {
        targetRotation.current = {
          x: country.rotationX,
          y: country.rotationY
        };
        targetZoom.current = country.zoom;
      }
    } else {
      targetZoom.current = 1.5;
    }
  }, [selectedCountry]);

  // Create a static green material for highlighting the selected country
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(MATRIX_COLORS.LIGHT_GREEN),
    emissive: new THREE.Color(MATRIX_COLORS.DARK_GREEN),
    emissiveIntensity: 1
  });

  useFrame((_, delta) => {
    if (globeRef.current) {
      if (!selectedCountry) {
        // Only auto-rotate when no country is selected
        globeRef.current.rotation.y += (Math.PI * 2 * delta) / (60 * 3);
      } else {
        // Create quaternion for custom axis rotation
        const targetQuat = new THREE.Quaternion();
        targetQuat.setFromAxisAngle(customAxis, targetRotation.current.x);
        
        // Create quaternion for y-rotation
        const yQuat = new THREE.Quaternion();
        yQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation.current.y);
        
        // Combine the rotations
        targetQuat.multiply(yQuat);
        
        // Smoothly interpolate to target quaternion
        globeRef.current.quaternion.slerp(targetQuat, 0.1);
      }

      // Smoothly animate camera position based on zoom
      const currentDistance = camera.position.length();
      const targetDistance = defaultCameraDistance * targetZoom.current;
      const newDistance = THREE.MathUtils.lerp(currentDistance, targetDistance, 0.1);
      camera.position.normalize().multiplyScalar(newDistance);
    }

    Object.values(nodes).forEach((mesh) => {
      if (mesh.isMesh) {
        if (mesh.name === selectedCountry) {
          // Apply static green highlight to selected country
          mesh.material = highlightMaterial;
        } else {
          // Restore original material if previously modified
          if (originalMaterials.current[mesh.name]) {
            mesh.material = originalMaterials.current[mesh.name].clone();
          }
          // Apply default colors for ocean and land
          mesh.material.color.set(mesh.name === "Ocean" ? MATRIX_COLORS.MATRIX_WHITE : MATRIX_COLORS.MATRIX_BLACK);
        }
      }
    });
  });

  return <primitive ref={globeRef} object={scene} scale={1.5} />;
}

/**
 * GlobeScene component that renders the 3D globe within a Canvas.
 */
export default function GlobeScene({ selectedCountry }) {
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [250, 0, 270], fov: 50 }} className="w-full h-full">
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 5, 5]} intensity={3.5} />
        <Globe selectedCountry={selectedCountry} />
      </Canvas>
      {/* Top fade overlay */}
      <div className="absolute top-0 left-0 w-full h-[250px] bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.2)_70%,rgba(0,0,0,0.1)_85%,rgba(0,0,0,0)_100%)] pointer-events-none"></div>
      {/* Bottom fade overlay */}
      <div className="absolute bottom-0 left-0 w-full h-[250px] bg-[linear-gradient(to_top,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.2)_70%,rgba(0,0,0,0.1)_85%,rgba(0,0,0,0)_100%)] pointer-events-none"></div>
    </div>
  );
}
