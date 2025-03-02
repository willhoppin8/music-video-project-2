import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { COLORS } from "../constants/colors";
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
    color: new THREE.Color(COLORS.SELECTED),
    metalness: 0.5,
    roughness: 0.3,
    emissive: new THREE.Color(COLORS.SELECTED),
    emissiveIntensity: 0.2
  });

  const completedMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(COLORS.UNSELECTED_VISITED),
    emissive: new THREE.Color(COLORS.UNSELECTED_VISITED),
    emissiveIntensity: 0.3,
    metalness: 0.5,
    roughness: 0.3
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
              ? COLORS.LIGHT_STATE
              : COLORS.DARK_STATE
          );
          if (mesh.name !== "Ocean") {
            mesh.material.metalness = 0.3;
            mesh.material.roughness = 0.4;
            mesh.material.emissive = new THREE.Color(COLORS.DARK_STATE);
            mesh.material.emissiveIntensity = 0.1;
          }
        }
      }
    });
  });

  return <primitive ref={globeRef} object={scene} scale={1.5} />;
} 