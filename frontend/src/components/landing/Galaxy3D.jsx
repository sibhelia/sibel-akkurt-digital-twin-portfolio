import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Galaxy3D({
  backgroundColor = "#000000",
  transparentBackground = true,
  centerLightColor = "#e9d5ff",
  coreColor = "#8b5cf6", // Purple accent
  midColor = "#4c1d95", // Darker purple
  edgeColor = "#6d28d9", // Medium purple
  particleCount = 50000,
  backgroundStarsCount = 800,
  radius = 7.5,
  branches = 10,
  spin = 3.5,
  randomness = 0.25,
  randomnessPower = 3,
  particleSize = 0.25,
  glowSpeed = 1.5,
  pulseSpread = 0.8,
  vortexSpeed = -0.4,
  rotationSpeed = 0.08,
  cameraPitch = 5,
  cameraDistance = 17,
  fov = 45,
  enableParallax = true,
  parallaxStrength = 5,
  parallaxDamping = 0.01
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    let animationFrameId;
    let isIntersecting = true;
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Core Scene Environment
    const scene = new THREE.Scene();
    if (!transparentBackground) {
      scene.background = new THREE.Color(backgroundColor);
    }
    
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
    camera.position.set(0, cameraPitch, cameraDistance);
    camera.lookAt(0, 0, 0);

    // 2. Ultra High-Fidelity Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // 3. Shaders
    const vertexShader = `
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uSizeBase;
      uniform float uVortexSpeed;
      attribute float size;
      attribute vec3 customColor;
      attribute float aDistance;
      attribute float aAngle;
      varying vec3 vColor;
      varying float vDistance;
      varying float vAngle;
      void main() {
          vColor = customColor;
          vDistance = aDistance;
          vAngle = aAngle;
          vec3 pos = position;
          float twist = (uTime * uVortexSpeed) / (vDistance + 0.1);
          float c = cos(twist);
          float s = sin(twist);
          float newX = pos.x * c - pos.z * s;
          float newZ = pos.x * s + pos.z * c;
          pos.x = newX;
          pos.z = newZ;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uSizeBase * uPixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
      }
    `;
    
    const fragmentShader = `
      uniform float uTime;
      uniform float uGlowSpeed;
      uniform vec3 uCenterColor;
      uniform float uPulseSpread;
      varying vec3 vColor;
      varying float vDistance;
      varying float vAngle;
      void main() {
          vec2 pt = gl_PointCoord - vec2(0.5);
          float d = length(pt);
          float alpha = exp(-d * d * 30.0);
          float core = exp(-d * d * 150.0);
          float flowPhase = vDistance * 1.5 - vAngle * 2.0 - uTime * uGlowSpeed;
          float flowStrength = pow(sin(flowPhase) * 0.5 + 0.5, 1.0 / uPulseSpread); 
          vec3 baseColor = mix(vColor, uCenterColor, core * 0.8);
          vec3 finalColor = baseColor + (baseColor * flowStrength * 1.8);
          float finalAlpha = alpha * (0.6 + flowStrength * 0.6);
          if (finalAlpha < 0.01) discard; 
          gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `;
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uSizeBase: { value: particleSize },
        uGlowSpeed: { value: glowSpeed },
        uVortexSpeed: { value: vortexSpeed },
        uCenterColor: { value: new THREE.Color(centerLightColor) },
        uPulseSpread: { value: pulseSpread }
      },
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader,
      fragmentShader,
      transparent: true
    });

    // 4. Generate Geometry (Optimized Count)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const distances = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);
    
    const coreC = new THREE.Color(coreColor);
    const midC = new THREE.Color(midColor);
    const edgeC = new THREE.Color(edgeColor);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.random() * radius;
      const spinAngle = r * spin;
      const branchAngle = (i % branches) / branches * Math.PI * 2;
      const perfectAngle = branchAngle + spinAngle;
      const pwr = randomnessPower;
      const rnd = randomness;
      
      const randomX = Math.pow(Math.random(), pwr) * (Math.random() < 0.5 ? 1 : -1) * rnd * r;
      const randomY = Math.pow(Math.random(), pwr) * (Math.random() < 0.5 ? 1 : -1) * rnd * r * 0.15;
      const randomZ = Math.pow(Math.random(), pwr) * (Math.random() < 0.5 ? 1 : -1) * rnd * r;
      
      positions[i3] = Math.cos(perfectAngle) * r + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(perfectAngle) * r + randomZ;
      distances[i] = r;
      angles[i] = perfectAngle;
      
      const mixedColor = new THREE.Color();
      const midThreshold = radius * 0.35;
      
      if (r < midThreshold) {
        mixedColor.copy(coreC).lerp(midC, r / midThreshold);
      } else {
        mixedColor.copy(midC).lerp(edgeC, (r - midThreshold) / (radius - midThreshold));
      }
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      sizes[i] = 0.5 + Math.random() * 0.5;
    }
    
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aDistance", new THREE.BufferAttribute(distances, 1));
    geometry.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));
    
    const galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);

    // Ambient Stars
    const ambGeo = new THREE.BufferGeometry();
    const ambPos = new Float32Array(backgroundStarsCount * 3);
    const ambColors = new Float32Array(backgroundStarsCount * 3);
    const ambSizes = new Float32Array(backgroundStarsCount);
    const ambDistances = new Float32Array(backgroundStarsCount);
    const ambAngles = new Float32Array(backgroundStarsCount);
    
    for (let i = 0; i < backgroundStarsCount; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60;
      
      ambPos[i3] = x;
      ambPos[i3 + 1] = y;
      ambPos[i3 + 2] = z;
      ambColors[i3] = 0.9 + Math.random() * 0.1;
      ambColors[i3 + 1] = 0.9 + Math.random() * 0.1;
      ambColors[i3 + 2] = 1;
      ambSizes[i] = 0.2 + Math.random() * 0.4;
      ambDistances[i] = Math.sqrt(x * x + y * y + z * z);
      ambAngles[i] = Math.atan2(z, x);
    }
    
    ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    ambGeo.setAttribute("customColor", new THREE.BufferAttribute(ambColors, 3));
    ambGeo.setAttribute("size", new THREE.BufferAttribute(ambSizes, 1));
    ambGeo.setAttribute("aDistance", new THREE.BufferAttribute(ambDistances, 1));
    ambGeo.setAttribute("aAngle", new THREE.BufferAttribute(ambAngles, 1));
    
    const ambStars = new THREE.Points(ambGeo, material);
    scene.add(ambStars);

    // --- Master Animation Loop ---
    const clock = new THREE.Clock();
    
    const tick = () => {
      if (!isIntersecting) return;
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();
      
      material.uniforms.uTime.value = elapsedTime;
      
      galaxy.rotation.y += delta * rotationSpeed;
      ambStars.rotation.y += delta * rotationSpeed * 0.15;
      
      currentX += (targetX - currentX) * parallaxDamping;
      currentY += (targetY - currentY) * parallaxDamping;
      
      if (enableParallax) {
        camera.position.x = currentX * parallaxStrength * 5;
        camera.position.y = cameraPitch + currentY * parallaxStrength * 3;
      } else {
        camera.position.x = 0;
        camera.position.y = cameraPitch;
      }
      
      camera.position.z = cameraDistance;
      camera.fov = fov;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) tick();
    });
    observer.observe(mountRef.current);

    const resizeObserver = new ResizeObserver(() => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(mountRef.current);

    const onMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener("mousemove", onMouseMove);
    tick();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      ambGeo.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [
    backgroundColor, transparentBackground, centerLightColor, coreColor, midColor, edgeColor,
    particleCount, backgroundStarsCount, radius, branches, spin, randomness,
    randomnessPower, particleSize, glowSpeed, pulseSpread, vortexSpeed,
    rotationSpeed, cameraPitch, cameraDistance, fov, enableParallax,
    parallaxStrength, parallaxDamping
  ]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        minWidth: 100,
        minHeight: 100,
        position: "absolute", // Adjusted for background usage
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        pointerEvents: "none", // Let clicks pass through
        zIndex: -1, // Keep it behind content
        background: transparentBackground ? "transparent" : backgroundColor
      }}
    />
  );
}