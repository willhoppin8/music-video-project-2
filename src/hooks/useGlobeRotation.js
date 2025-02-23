import { useRef, useEffect } from "react";
import * as THREE from "three";
import { countries } from "../data/countries";

const DEFAULT_ZOOM = 1.5;
const DEFAULT_CAMERA_DISTANCE = 270;

/**
 * Custom hook to handle globe rotation and zoom logic
 */
export default function useGlobeRotation(selectedCountry, camera) {
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetZoom = useRef(DEFAULT_ZOOM);
  const customAxis = new THREE.Vector3(1, 0, -0.8).normalize();

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
      targetZoom.current = DEFAULT_ZOOM;
    }
  }, [selectedCountry]);

  const updateRotation = (globeRef, delta) => {
    if (!globeRef.current) return;

    if (!selectedCountry) {
      // Auto-rotate when no country is selected
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

    // Update camera zoom
    const currentDistance = camera.position.length();
    const targetDistance = DEFAULT_CAMERA_DISTANCE * targetZoom.current;
    const newDistance = THREE.MathUtils.lerp(currentDistance, targetDistance, 0.1);
    camera.position.normalize().multiplyScalar(newDistance);
  };

  return { updateRotation };
} 