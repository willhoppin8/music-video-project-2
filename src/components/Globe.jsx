import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MATRIX_COLORS } from "../constants/colors";
import useGlobeRotation from "../hooks/useGlobeRotation";
import { countries } from "../data/countries";

/**
 * Globe component that renders a 3D model and highlights the selected country
 */
export default function Globe({ selectedCountry }) {
  const { scene, nodes } = useGLTF("/globe.glb");
  const originalMaterials = useRef({});
  const globeRef = useRef();
  const { camera } = useThree();
  const { updateRotation } = useGlobeRotation(selectedCountry, camera);

  // Store original materials on first render
  useEffect(() => {
    Object.values(nodes).forEach((mesh) => {
      if (mesh.isMesh) {
        originalMaterials.current[mesh.name] = mesh.material.clone();
      }
    });
  }, []);

  // Create materials for highlighting
  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(MATRIX_COLORS.LIGHT_GREEN),
    emissive: new THREE.Color(MATRIX_COLORS.DARK_GREEN),
    emissiveIntensity: 1
  });

  const completedMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(MATRIX_COLORS.DARK_GREEN),
    emissive: new THREE.Color(MATRIX_COLORS.DARK_GREEN),
    emissiveIntensity: 0.3
  });

  useFrame((_, delta) => {
    updateRotation(globeRef, delta);

    // Update materials
    Object.values(nodes).forEach((mesh) => {
      if (mesh.isMesh) {
        const country = mesh.name !== "Ocean" && countries.find(c => c.name === mesh.name);
        
        if (mesh.name === selectedCountry) {
          mesh.material = highlightMaterial;
        } else if (country?.completed) {
          mesh.material = completedMaterial;
        } else {
          if (originalMaterials.current[mesh.name]) {
            mesh.material = originalMaterials.current[mesh.name].clone();
          }
          mesh.material.color.set(
            mesh.name === "Ocean" 
              ? MATRIX_COLORS.MATRIX_WHITE 
              : MATRIX_COLORS.MATRIX_BLACK
          );
        }
      }
    });
  });

  return <primitive ref={globeRef} object={scene} scale={1.5} />;
} 