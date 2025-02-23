import { useRef, useEffect } from "react";
import * as THREE from "three";
import { countries } from "../data/countries";

const ROTATION_CONSTANTS = {
  DEFAULT_ZOOM: 1.5,
  DEFAULT_CAMERA_DISTANCE: 270,
  MIN_TRANSITION_SPEED: 0.03,
  MAX_TRANSITION_SPEED: 0.09,
  AUTO_ROTATE_DURATION: 180, // 3 seconds (60 * 3)
  MAX_ZOOM_OUT_MULTIPLIER: 1.0,
};

/**
 * Calculates the great-circle distance between two points on a sphere.
 * @param {Object} rot1 - First rotation point {x: latitude1, y: longitude1}
 * @param {Object} rot2 - Second rotation point {x: latitude2, y: longitude2}
 * @return {number} Angular distance between points
 */
const calculateGreatCircleDistance = (rot1, rot2) => {
  const dLon = rot2.y - rot1.y;
  const dLat = rot2.x - rot1.x;
  const a = Math.sin(dLat/2) ** 2 + 
            Math.cos(rot1.x) * Math.cos(rot2.x) * Math.sin(dLon/2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

/**
 * Custom hook to handle globe rotation and zoom transitions
 */
export default function useGlobeRotation(selectedCountry, camera) {
  const state = useRef({
    targetRotation: { x: 0, y: 0 },
    targetZoom: ROTATION_CONSTANTS.DEFAULT_ZOOM,
    previousCountry: null,
    transitionSpeed: ROTATION_CONSTANTS.MIN_TRANSITION_SPEED,
    transitionProgress: 0,
    maxZoomOutFactor: 1,
    startZoom: ROTATION_CONSTANTS.DEFAULT_ZOOM,
  });

  const customAxis = new THREE.Vector3(1, 0, -0.8).normalize();

  useEffect(() => {
    const s = state.current;
    
    if (!selectedCountry) {
      s.startZoom = camera.position.length() / ROTATION_CONSTANTS.DEFAULT_CAMERA_DISTANCE;
      s.targetZoom = ROTATION_CONSTANTS.DEFAULT_ZOOM;
      s.previousCountry = null;
      s.transitionSpeed = ROTATION_CONSTANTS.MIN_TRANSITION_SPEED;
      s.maxZoomOutFactor = 1;
      s.transitionProgress = 0;
      return;
    }

    const country = countries.find(c => c.name === selectedCountry);
    if (!country) return;

    s.startZoom = camera.position.length() / ROTATION_CONSTANTS.DEFAULT_CAMERA_DISTANCE;
    s.transitionProgress = 0;
    
    const newRotation = { x: country.rotationX, y: country.rotationY };

    if (s.previousCountry) {
      const prevCountry = countries.find(c => c.name === s.previousCountry);
      if (prevCountry) {
        const prevRotation = { x: prevCountry.rotationX, y: prevCountry.rotationY };
        const distance = calculateGreatCircleDistance(newRotation, prevRotation);
        
        s.transitionSpeed = Math.max(
          ROTATION_CONSTANTS.MIN_TRANSITION_SPEED,
          ROTATION_CONSTANTS.MAX_TRANSITION_SPEED / (1 + distance)
        );
        s.maxZoomOutFactor = 1 + Math.min(distance, Math.PI) / Math.PI * ROTATION_CONSTANTS.MAX_ZOOM_OUT_MULTIPLIER;
      }
    }

    s.targetRotation = newRotation;
    s.targetZoom = country.zoom;
    s.previousCountry = selectedCountry;
  }, [selectedCountry]);

  const updateRotation = (globeRef, delta) => {
    if (!globeRef.current) return;
    const s = state.current;

    if (!selectedCountry) {
      globeRef.current.rotation.y += (Math.PI * 2 * delta) / ROTATION_CONSTANTS.AUTO_ROTATE_DURATION;
      return;
    }

    s.transitionProgress = Math.min(1, s.transitionProgress + s.transitionSpeed);

    // Calculate rotation quaternions
    const targetQuat = new THREE.Quaternion()
      .setFromAxisAngle(customAxis, s.targetRotation.x)
      .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), s.targetRotation.y));

    // Update globe rotation
    globeRef.current.quaternion.slerp(targetQuat, s.transitionSpeed);

    // Update camera zoom with arc effect
    const currentDistance = camera.position.length();
    const baseStartDistance = ROTATION_CONSTANTS.DEFAULT_CAMERA_DISTANCE * s.startZoom;
    const baseTargetDistance = ROTATION_CONSTANTS.DEFAULT_CAMERA_DISTANCE * s.targetZoom;
    
    const arcFactor = Math.sin(s.transitionProgress * Math.PI) * (s.maxZoomOutFactor - 1);
    const targetDistance = THREE.MathUtils.lerp(baseStartDistance, baseTargetDistance, s.transitionProgress) * (1 + arcFactor);

    camera.position.normalize().multiplyScalar(
      THREE.MathUtils.lerp(currentDistance, targetDistance, s.transitionSpeed)
    );
  };

  return { updateRotation };
} 