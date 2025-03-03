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
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
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

    console.log("Globe clicked"); // Debug log
    if (!gltf || !onCountrySelect) {
      console.log("Missing gltf or onCountrySelect", { gltf: !!gltf, onCountrySelect: !!onCountrySelect }); // Debug log
      return;
    }

    // Get the correct event coordinates for both touch and mouse events
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    // Get the canvas element and its bounding rect
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    // Calculate normalized device coordinates (-1 to +1) for both touch and mouse
    pointer.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

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
    console.log("Intersections:", intersects.length); // Debug log

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
    } else if (event.touches.length === 1 && pointerDown.current) {
      // Handle single touch drag
      const touch = event.touches[0];
      const dx = touch.clientX - pointerDown.current.x;
      const dy = touch.clientY - pointerDown.current.y;
      
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging.current = true;
        
        // Convert pixel movement to rotation (scale down the movement)
        const rotationScale = 0.005;
        const deltaRotationY = dx * rotationScale;
        const deltaRotationX = dy * rotationScale;
        
        // Update the rotation
        manualRotate(deltaRotationX, deltaRotationY);
        
        // Update pointer position for next frame
        pointerDown.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      // Prevent default browser pinch-zoom
      event.preventDefault();
      event.stopPropagation();
    } else if (event.touches.length === 1) {
      // Store the initial touch position
      const touch = event.touches[0];
      pointerDown.current = { x: touch.clientX, y: touch.clientY };
      isDragging.current = false;

      // Update pointer position for raycasting
      const rect = event.currentTarget.getBoundingClientRect();
      pointer.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    }
  };

  const handleTouchEnd = (event) => {
    event.preventDefault(); // Prevent any default handling
    
    // Only handle tap if we weren't dragging
    if (!isDragging.current && pointerDown.current) {
      // Use the stored pointer position from touchstart for better accuracy
      handleClick({
        touches: [{ 
          clientX: pointerDown.current.x, 
          clientY: pointerDown.current.y 
        }],
        currentTarget: event.currentTarget,
        preventDefault: () => {},
        stopPropagation: () => {}
      });
    }
    
    // Reset states
    lastPinchDistance.current = null;
    isDragging.current = false;
    pointerDown.current = null;
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
      // Only handle mouse events here, touch events are handled separately
      if (event.pointerType === 'touch') return;
      
      const rect = event.currentTarget.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    // Handle global pointer events (for when pointer moves outside canvas)
    const handleGlobalPointerMove = (event) => {
      // Only handle mouse events here, touch events are handled separately
      if (event.pointerType === 'touch') return;
      
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

    // Handle global pointer up events
    const handleGlobalPointerUp = (event) => {
      // Only handle mouse events here, touch events are handled separately
      if (event.pointerType === 'touch') return;

      if (isDragging.current) {
        // Prevent the click event from firing after a drag
        event.preventDefault();
        event.stopPropagation();
        
        // Signal the end of dragging to resume auto-rotation
        manualRotate(0, 0, true);
        
        // Add a one-time click blocker that will prevent the next click
        const clickBlocker = (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.removeEventListener('click', clickBlocker, true);
        };
        window.addEventListener('click', clickBlocker, true);
      }
      
      isDragging.current = false;
      pointerDown.current = null;
    };

    // Create a click handler function that we can reference in both add and remove
    const handleClickWithCheck = (e) => {
      if (e.pointerType !== 'touch' && !isDragging.current) {
        handleClick(e);
      }
    };

    // Add event listeners with proper options
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    // Mouse-specific event listeners
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handleCanvasPointerMove);
    canvas.addEventListener("click", handleClickWithCheck);

    // Add global event listeners
    window.addEventListener("pointermove", handleGlobalPointerMove);
    window.addEventListener("pointerup", handleGlobalPointerUp);

    // Add wheel event listener
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
      
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handleCanvasPointerMove);
      canvas.removeEventListener("click", handleClickWithCheck);
      
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      
      canvas.removeEventListener("wheel", handleWheel);
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