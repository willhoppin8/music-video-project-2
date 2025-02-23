import { useRef, useEffect } from "react";
import * as THREE from "three";
import { countries } from "../data/countries";

const DEFAULT_ZOOM = 1.5;
const DEFAULT_CAMERA_DISTANCE = 270;
const MIN_TRANSITION_SPEED = 0.03; // Double current speed (was 0.02)
const MAX_TRANSITION_SPEED = 0.09; // Double current speed (was 0.06)

/**
 * Custom hook to handle globe rotation and zoom logic
 */
export default function useGlobeRotation(selectedCountry, camera) {
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetZoom = useRef(DEFAULT_ZOOM);
  const customAxis = new THREE.Vector3(1, 0, -0.8).normalize();
  const previousCountry = useRef(null);
  const transitionSpeed = useRef(MIN_TRANSITION_SPEED);

  // Calculate angular distance between two sets of rotations
  const calculateDistance = (rot1, rot2) => {
    // Normalize angles to handle wraparound
    const dx = Math.abs(rot1.x - rot2.x);
    const dy = Math.abs(rot1.y - rot2.y);
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(c => c.name === selectedCountry);
      if (country) {
        const newRotation = {
          x: country.rotationX,
          y: country.rotationY
        };

        // Calculate transition speed based on distance if we have a previous country
        if (previousCountry.current) {
          const prevCountry = countries.find(c => c.name === previousCountry.current);
          if (prevCountry) {
            const prevRotation = {
              x: prevCountry.rotationX,
              y: prevCountry.rotationY
            };
            
            const distance = calculateDistance(newRotation, prevRotation);
            // Inverse relationship: larger distance = slower speed
            transitionSpeed.current = Math.max(
              MIN_TRANSITION_SPEED,
              MAX_TRANSITION_SPEED / (1 + distance)
            );
          }
        }

        targetRotation.current = newRotation;
        targetZoom.current = country.zoom;
        previousCountry.current = selectedCountry;
      }
    } else {
      targetZoom.current = DEFAULT_ZOOM;
      previousCountry.current = null;
      transitionSpeed.current = MIN_TRANSITION_SPEED;
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
      
      // Smoothly interpolate to target quaternion using dynamic speed
      globeRef.current.quaternion.slerp(targetQuat, transitionSpeed.current);
    }

    // Update camera zoom with matching speed
    const currentDistance = camera.position.length();
    const targetDistance = DEFAULT_CAMERA_DISTANCE * targetZoom.current;
    const newDistance = THREE.MathUtils.lerp(
      currentDistance,
      targetDistance,
      transitionSpeed.current
    );
    camera.position.normalize().multiplyScalar(newDistance);
  };

  return { updateRotation };
} 