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
  const transitionSpeed = 0.1; // Speed of color transition

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
    metalness: 0.2,
    roughness: 0.8,
    emissive: new THREE.Color(COLORS.SELECTED),
    emissiveIntensity: 2.0
  });

  // Create material for completed countries when another is selected
  const completedDimmedMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(COLORS.COMPLETED_DIMMED),
    metalness: 0.2,
    roughness: 0.8,
    emissive: new THREE.Color(COLORS.COMPLETED_DIMMED),
    emissiveIntensity: 1.5
  });

  // Keep track of transition materials for completed countries
  const transitionMaterials = useRef({});

  useFrame((_, delta) => {
    updateRotation(globeRef, delta);

    // Update materials
    Object.values(nodes).forEach((mesh) => {
      if (mesh.isMesh) {
        const country = mesh.name !== "Ocean" && countries.find(c => c.name === mesh.name);
        
        if (mesh.name === selectedCountry) {
          // Selected country gets bright orange
          mesh.material = highlightMaterial;
        } else if (country?.completed) {
          // Initialize transition material if it doesn't exist
          if (!transitionMaterials.current[mesh.name]) {
            transitionMaterials.current[mesh.name] = new THREE.MeshStandardMaterial({
              color: new THREE.Color(COLORS.SELECTED),
              metalness: 0.2,
              roughness: 0.8,
              emissive: new THREE.Color(COLORS.SELECTED),
              emissiveIntensity: 2.0
            });
          }

          const material = transitionMaterials.current[mesh.name];
          const targetColor = selectedCountry ? new THREE.Color(COLORS.COMPLETED_DIMMED) : new THREE.Color(COLORS.SELECTED);
          const targetEmissive = selectedCountry ? new THREE.Color(COLORS.COMPLETED_DIMMED) : new THREE.Color(COLORS.SELECTED);
          const targetIntensity = selectedCountry ? 1.5 : 2.0;

          // Interpolate color
          material.color.lerp(targetColor, transitionSpeed);
          material.emissive.lerp(targetEmissive, transitionSpeed);
          material.emissiveIntensity += (targetIntensity - material.emissiveIntensity) * transitionSpeed;

          mesh.material = material;
        } else {
          // Non-completed countries get default dark state
          if (originalMaterials.current[mesh.name]) {
            mesh.material = originalMaterials.current[mesh.name].clone();
          }
          mesh.material.color.set(
            mesh.name === "Ocean" 
              ? COLORS.LIGHT_STATE
              : COLORS.DARK_STATE
          );
          mesh.material.metalness = 0.2;
          mesh.material.roughness = 0.8;
          mesh.material.emissive = new THREE.Color(0x000000);
          mesh.material.emissiveIntensity = 0;
        }
      }
    });
  });

  return <primitive ref={globeRef} object={scene} scale={1.5} />;
} 