import { useRef, useEffect } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { COLORS } from "../constants/colors";
import useGlobeRotation from "../hooks/useGlobeRotation";
import { countries } from "../data/countries";
import PropTypes from 'prop-types';

/**
 * Globe component that renders a 3D model and highlights the selected country
 */
const Globe = ({ selectedCountry, onCountrySelect }) => {
  const gltf = useLoader(GLTFLoader, "/globe.glb");
  const { camera } = useThree();
  const originalMaterials = useRef({});
  const globeRef = useRef();
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const pointerDown = useRef(null);
  const isDragging = useRef(false);
  const isMobile = useRef(false);
  const lastPinchDistance = useRef(null);
  const { updateRotation, manualRotate, manualZoom } = useGlobeRotation(selectedCountry, camera);
  const transitionSpeed = 0.1; // Speed of color transition

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth <= 768;
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Store original materials on first render
  useEffect(() => {
    if (!gltf) return;
    
    gltf.scene.traverse((object) => {
      if (object.isMesh) {
        originalMaterials.current[object.name] = object.material.clone();
      }
    });
  }, [gltf]);

  // Handle pointer down for drag detection
  const handlePointerDown = (event) => {
    pointerDown.current = { x: event.clientX, y: event.clientY };
    isDragging.current = false;
  };

  // Handle pointer leave/out to reset states
  const handlePointerLeave = () => {
    if (isDragging.current) {
      // Keep the last known position to prevent sudden rotation on re-entry
      isDragging.current = false;
    }
    pointerDown.current = null;
  };

  // Handle pointer move for raycasting and drag detection
  const handlePointerMove = (event) => {
    // Check for drag if pointer is down
    if (pointerDown.current) {
      const dragThreshold = 5; // pixels
      const dx = event.clientX - pointerDown.current.x;
      const dy = event.clientY - pointerDown.current.y;
      
      if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
        isDragging.current = true;
        
        // Convert pixel movement to rotation (scale down the movement)
        const rotationScale = 0.005;
        const deltaRotationY = dx * rotationScale;
        const deltaRotationX = dy * rotationScale;
        
        // Update the rotation
        manualRotate(deltaRotationX, deltaRotationY);
        
        // Update pointer position for next frame
        pointerDown.current = { x: event.clientX, y: event.clientY };
      }
    }

    // Calculate pointer position in normalized device coordinates (-1 to +1)
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Account for device pixel ratio and any CSS scaling
    const pixelRatio = window.devicePixelRatio || 1;
    const canvasWidth = canvas.width / pixelRatio;
    const canvasHeight = canvas.height / pixelRatio;
    
    pointer.current.x = (x / canvasWidth) * 2 - 1;
    pointer.current.y = -(y / canvasHeight) * 2 + 1;
  };

  // Handle pointer up to reset drag state
  const handlePointerUp = (event) => {
    // If we were dragging, prevent the next click event from firing
    if (isDragging.current) {
      event.preventDefault();
      event.stopPropagation();
    }
    isDragging.current = false;
    pointerDown.current = null;
  };

  // Handle click events
  const handleClick = (event) => {
    // If we were just dragging or there's still a pointer down, ignore the click
    if (isDragging.current || pointerDown.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Update pointer position one final time before raycasting
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    
    // Handle touch events differently
    let x, y;
    if (event.touches && event.touches[0]) {
      // For touch events
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
      
      // Apply a touch offset correction (touches tend to be registered lower than intended)
      y -= 20; // Adjust this value as needed
    } else {
      // For mouse events
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }
    
    // Account for device pixel ratio and any CSS scaling
    const pixelRatio = window.devicePixelRatio || 1;
    const canvasWidth = canvas.width / pixelRatio;
    const canvasHeight = canvas.height / pixelRatio;
    
    pointer.current.x = (x / canvasWidth) * 2 - 1;
    pointer.current.y = -(y / canvasHeight) * 2 + 1;

    console.log("Globe clicked", { 
      x: pointer.current.x, 
      y: pointer.current.y,
      isTouchEvent: !!(event.touches && event.touches[0])
    }); // Debug log

    if (!gltf || !onCountrySelect) {
      console.log("Missing gltf or onCountrySelect", { gltf: !!gltf, onCountrySelect: !!onCountrySelect }); // Debug log
      return;
    }

    // Update raycaster
    raycaster.current.setFromCamera(pointer.current, camera);

    // Get all meshes from the scene
    const meshes = [];
    gltf.scene.traverse((object) => {
      if (object.isMesh) {
        meshes.push(object);
      }
    });

    console.log("Found meshes:", meshes.length); // Debug log

    // Calculate intersections
    const intersects = raycaster.current.intersectObjects(meshes);
    console.log("Intersections:", intersects.length, intersects.map(i => i.object.name)); // Debug log

    // Handle Ocean clicks differently based on selection state
    if (intersects.length > 0 && intersects[0].object.name === "Ocean") {
      if (selectedCountry) {
        // If a country is selected, clicking ocean deselects it
        onCountrySelect(null);
      }
      return;
    }

    // Find the first intersection that isn't the ocean
    const countryIntersection = intersects.find(
      (intersect) => intersect.object.name !== "Ocean"
    );

    if (countryIntersection) {
      const countryName = countryIntersection.object.name;
      console.log("Selected country:", countryName); // Debug log
      onCountrySelect(countryName);
    }
  };

  // Handle wheel events for desktop zoom
  const handleWheel = (event) => {
    if (isMobile.current) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // Convert wheel delta to zoom delta (normalize it a bit)
    const zoomDelta = event.deltaY * 0.0005;
    manualZoom(zoomDelta);
  };

  // Handle touch events for mobile pinch zoom
  const handleTouchMove = (event) => {
    if (isMobile.current) return;
    
    if (event.touches.length === 2) {
      // Prevent default browser pinch-zoom
      event.preventDefault();
      event.stopPropagation();
      
      // Calculate the distance between the two touch points
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (lastPinchDistance.current !== null) {
        const delta = distance - lastPinchDistance.current;
        // Convert pinch delta to zoom delta (increase sensitivity)
        const zoomDelta = delta * 0.005;
        manualZoom(zoomDelta);
      }

      lastPinchDistance.current = distance;
    }
  };

  const handleTouchStart = (event) => {
    if (isMobile.current) return;
    
    if (event.touches.length === 2) {
      // Prevent default browser pinch-zoom
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleTouchEnd = () => {
    lastPinchDistance.current = null;
  };

  // Add event listeners
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.warn('Canvas not found for event listeners');
      return;
    }

    // Handle canvas-specific pointer move for raycasting
    const handleCanvasPointerMove = (event) => {
      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Account for device pixel ratio and any CSS scaling
      const pixelRatio = window.devicePixelRatio || 1;
      const canvasWidth = canvas.width / pixelRatio;
      const canvasHeight = canvas.height / pixelRatio;
      
      pointer.current.x = (x / canvasWidth) * 2 - 1;
      pointer.current.y = -(y / canvasHeight) * 2 + 1;
    };

    // Handle global pointer events (for when pointer moves outside canvas)
    const handleGlobalPointerMove = (event) => {
      if (!pointerDown.current) return;
      
      const dx = event.clientX - pointerDown.current.x;
      const dy = event.clientY - pointerDown.current.y;
      
      if (isDragging.current) {
        // Convert pixel movement to rotation (scale down the movement)
        const rotationScale = 0.005;
        const deltaRotationY = dx * rotationScale;
        const deltaRotationX = dy * rotationScale;
        
        // Update the rotation
        manualRotate(deltaRotationX, deltaRotationY);
        
        // Update pointer position for next frame
        pointerDown.current = { x: event.clientX, y: event.clientY };
      } else if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging.current = true;
      }
    };

    const handleGlobalPointerUp = (event) => {
      if (isDragging.current) {
        // Prevent the click event from firing after a drag
        event.preventDefault();
        event.stopPropagation();
        
        // Signal the end of dragging to resume auto-rotation
        manualRotate(0, 0, true);
        
        // Set a flag to prevent the next click
        const clickBlocker = (e) => {
          e.stopPropagation();
          window.removeEventListener('click', clickBlocker, true);
        };
        window.addEventListener('click', clickBlocker, true);
      }
      isDragging.current = false;
      pointerDown.current = null;
    };

    // Add canvas-specific event listeners
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handleCanvasPointerMove);
    canvas.addEventListener("click", handleClick);

    // Add global event listeners
    window.addEventListener("pointermove", handleGlobalPointerMove);
    window.addEventListener("pointerup", handleGlobalPointerUp);

    // Add zoom event listeners
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      // Remove canvas-specific event listeners
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handleCanvasPointerMove);
      canvas.removeEventListener("click", handleClick);

      // Remove global event listeners
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);

      // Remove zoom event listeners
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [camera, onCountrySelect]);

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
    if (!gltf || !gltf.scene) return;
    
    updateRotation(globeRef, delta);

    // Update materials
    gltf.scene.traverse((object) => {
      if (object.isMesh) {
        const country = object.name !== "Ocean" && countries.find(c => c.name === object.name);
        
        if (object.name === selectedCountry) {
          // Selected country gets bright orange
          object.material = highlightMaterial;
        } else if (country?.completed) {
          // Initialize transition material if it doesn't exist
          if (!transitionMaterials.current[object.name]) {
            transitionMaterials.current[object.name] = new THREE.MeshStandardMaterial({
              color: new THREE.Color(COLORS.SELECTED),
              metalness: 0.2,
              roughness: 0.8,
              emissive: new THREE.Color(COLORS.SELECTED),
              emissiveIntensity: 2.0
            });
          }

          const material = transitionMaterials.current[object.name];
          const targetColor = selectedCountry ? new THREE.Color(COLORS.COMPLETED_DIMMED) : new THREE.Color(COLORS.SELECTED);
          const targetEmissive = selectedCountry ? new THREE.Color(COLORS.COMPLETED_DIMMED) : new THREE.Color(COLORS.SELECTED);
          const targetIntensity = selectedCountry ? 1.5 : 2.0;

          // Interpolate color
          material.color.lerp(targetColor, transitionSpeed);
          material.emissive.lerp(targetEmissive, transitionSpeed);
          material.emissiveIntensity += (targetIntensity - material.emissiveIntensity) * transitionSpeed;

          object.material = material;
        } else {
          // Non-completed countries get default dark state
          if (originalMaterials.current[object.name]) {
            object.material = originalMaterials.current[object.name].clone();
          }
        }
      }
    });
  });

  if (!gltf) return null;

  return (
    <primitive 
      ref={globeRef} 
      object={gltf.scene} 
      scale={1.5}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
    />
  );
};

Globe.propTypes = {
  selectedCountry: PropTypes.string,
  onCountrySelect: PropTypes.func.isRequired
};

export default Globe; 