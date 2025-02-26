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
export default function Globe({ selectedCountry, onCountrySelect }) {
  const { scene, nodes } = useGLTF("/globe.glb");
  const originalMaterials = useRef({});
  const globeRef = useRef();
  const { camera } = useThree();
  const { updateRotation } = useGlobeRotation(selectedCountry, camera);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Store original materials on first render
  useEffect(() => {
    Object.values(nodes).forEach((mesh) => {
      if (mesh.isMesh) {
        originalMaterials.current[mesh.name] = mesh.material.clone();
      }
    });
  }, []);

  // Handle click events for country selection
  const handleClick = (event) => {
    console.log('Click event received');
    // Prevent event from propagating
    event.stopPropagation();
    
    // Get normalized click coordinates from the event
    mouse.current.x = event.nativeEvent.offsetX / event.nativeEvent.target.clientWidth * 2 - 1;
    mouse.current.y = -(event.nativeEvent.offsetY / event.nativeEvent.target.clientHeight) * 2 + 1;
    
    console.log('Mouse coords:', mouse.current.x, mouse.current.y);

    // Update the picking ray with the camera and mouse position
    raycaster.current.setFromCamera(mouse.current, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    console.log('Intersects:', intersects);

    // Find the first intersected mesh that is a country (not ocean)
    const countryMesh = intersects.find(intersect => 
      intersect.object.isMesh && 
      intersect.object.name !== "Ocean" &&
      countries.some(c => c.name === intersect.object.name)
    );

    console.log('Found country:', countryMesh?.object?.name);

    if (countryMesh) {
      onCountrySelect(countryMesh.object.name);
    }
  };

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

  return (
    <primitive 
      ref={globeRef} 
      object={scene} 
      scale={1.5} 
      onPointerDown={handleClick}
    />
  );
} 