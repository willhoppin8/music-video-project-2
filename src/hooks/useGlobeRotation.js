import { useRef, useEffect } from "react";
import * as THREE from "three";
import { countries } from "../data/countries";

const DEFAULT_ZOOM = 1.5;
const DEFAULT_CAMERA_DISTANCE = 270;
const MIN_TRANSITION_SPEED = 0.03; // Double current speed (was 0.02)
const MAX_TRANSITION_SPEED = 0.09; // Double current speed (was 0.06)
const RESET_TRANSITION_SPEED = 0.12; // Faster speed for resetting to default state

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
    // Convert to spherical coordinates (assuming rotationY is longitude and rotationX is latitude)
    const lon1 = rot1.y;
    const lat1 = rot1.x;
    const lon2 = rot2.y;
    const lat2 = rot2.x;

    // Haversine formula for great-circle distance
    const dLon = lon2 - lon1;
    const dLat = lat2 - lat1;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return c;
  };

  // Add transition progress tracking
  const transitionProgress = useRef(0);
  const maxZoomOutFactor = useRef(1);
  const startZoom = useRef(DEFAULT_ZOOM);

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(c => c.name === selectedCountry);
      if (country) {
        // Store the starting zoom level for smooth transitions
        startZoom.current = camera.position.length() / DEFAULT_CAMERA_DISTANCE;
        
        const newRotation = {
          x: country.rotationX,
          y: country.rotationY
        };

        // Reset transition progress
        transitionProgress.current = 0;

        if (previousCountry.current) {
          const prevCountry = countries.find(c => c.name === previousCountry.current);
          if (prevCountry) {
            const prevRotation = {
              x: prevCountry.rotationX,
              y: prevCountry.rotationY
            };
            
            const distance = calculateDistance(newRotation, prevRotation);
            transitionSpeed.current = Math.max(
              MIN_TRANSITION_SPEED,
              MAX_TRANSITION_SPEED / (1 + distance)
            );
            // Increase max zoom out factor (max 2x at longest distances)
            maxZoomOutFactor.current = 1 + Math.min(distance, Math.PI) / Math.PI * 1.0;
          }
        }

        targetRotation.current = newRotation;
        targetZoom.current = country.zoom;
        previousCountry.current = selectedCountry;
      }
    } else {
      startZoom.current = camera.position.length() / DEFAULT_CAMERA_DISTANCE;
      targetZoom.current = DEFAULT_ZOOM;
      previousCountry.current = null;
      transitionSpeed.current = RESET_TRANSITION_SPEED; // Use faster speed when resetting
      maxZoomOutFactor.current = 1;
      transitionProgress.current = 0;
    }
  }, [selectedCountry]);

  const updateRotation = (globeRef, delta) => {
    if (!globeRef.current) return;

    if (!selectedCountry) {
      // Auto-rotate when no country is selected
      globeRef.current.rotation.y += (Math.PI * 2 * delta) / (60 * 3);
      
      // Direct lerp to default zoom when no country is selected
      const currentDistance = camera.position.length();
      const targetDistance = DEFAULT_CAMERA_DISTANCE * DEFAULT_ZOOM;
      const newDistance = THREE.MathUtils.lerp(
        currentDistance,
        targetDistance,
        RESET_TRANSITION_SPEED
      );
      camera.position.normalize().multiplyScalar(newDistance);
      return;
    }

    // Update transition progress
    transitionProgress.current = Math.min(1, transitionProgress.current + transitionSpeed.current);

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

    // Update camera zoom with enhanced arc effect
    const currentDistance = camera.position.length();
    const baseStartDistance = DEFAULT_CAMERA_DISTANCE * startZoom.current;
    const baseTargetDistance = DEFAULT_CAMERA_DISTANCE * targetZoom.current;
    
    // Create smoother arc effect using sin curve
    const arcProgress = Math.sin(transitionProgress.current * Math.PI);
    const arcFactor = arcProgress * (maxZoomOutFactor.current - 1);
    
    // Interpolate between start and target distances, then apply arc
    const linearDistance = THREE.MathUtils.lerp(baseStartDistance, baseTargetDistance, transitionProgress.current);
    const targetDistance = linearDistance * (1 + arcFactor);

    const newDistance = THREE.MathUtils.lerp(
      currentDistance,
      targetDistance,
      transitionSpeed.current
    );
    camera.position.normalize().multiplyScalar(newDistance);
  };

  return { updateRotation };
} 