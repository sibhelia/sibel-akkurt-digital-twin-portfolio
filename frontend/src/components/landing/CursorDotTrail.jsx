import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function CursorDotTrail({
  color = "#8b5cf6", // Default to our purple-accent
  colorInverted = "#FFFFFF",
  size = 12,
  hoverSize = 40,
  borderWidth = 2,
  spring = 0.15,
  friction = 0.5,
  trailDuration = 200,
  transitionSpeed = 0.15,
}) {
  const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  const canvasRef = useRef(null);
  
  const pointsRef = useRef([]);
  const ballRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  
  const animRef = useRef();
  const lastTimeRef = useRef(0);
  const radiusRef = useRef(size / 2);
  const fillOpacityRef = useRef(1);
  const strokeOpacityRef = useRef(0);
  const lineOpacityRef = useRef(0);
  const lineWidthRef = useRef(0);
  const lineTargetWidthRef = useRef(0);
  const lineProgressRef = useRef(0);

  useEffect(() => {
    if (!isBrowser) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const centerX = w / 2;
      const centerY = h / 2;
      if (!ballRef.current.x && !ballRef.current.y) {
        ballRef.current = { x: centerX, y: centerY };
      }
      if (!targetRef.current.x && !targetRef.current.y) {
        targetRef.current = { x: centerX, y: centerY };
      }
    };
    resize();

    const onMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);

    const lerp = (from, to, amt) => from + (to - from) * amt;

    const animate = () => {
      const now = performance.now();
      const dt = Math.min(now - lastTimeRef.current, 33);
      lastTimeRef.current = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Physics
      const dx = targetRef.current.x - ballRef.current.x;
      const dy = targetRef.current.y - ballRef.current.y;
      velocityRef.current.x += dx * spring;
      velocityRef.current.y += dy * spring;
      velocityRef.current.x *= friction;
      velocityRef.current.y *= friction;
      ballRef.current.x += velocityRef.current.x;
      ballRef.current.y += velocityRef.current.y;

      // Trail
      pointsRef.current.push({ x: ballRef.current.x, y: ballRef.current.y, age: 0 });
      for (let i = 0; i < pointsRef.current.length; i++) {
        pointsRef.current[i].age += dt;
      }
      pointsRef.current = pointsRef.current.filter((p) => p.age < trailDuration);

      // Element under cursor
      const el = document.elementFromPoint(targetRef.current.x, targetRef.current.y);
      const isRing = !!el?.closest("a, button, [role~='button']");
      const isWorkCard = !!el?.closest('[data-work-card]'); // Assuming we want custom hover for cards

      const currentColor = color;

      // Draw Trail
      if (pointsRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);
        for (let i = 1; i < pointsRef.current.length; i++) {
          const p = pointsRef.current[i];
          ctx.lineTo(p.x, p.y);
        }
        const oldest = pointsRef.current[0];
        const newest = pointsRef.current[pointsRef.current.length - 1];
        const oldestOpacity = 1 - oldest.age / trailDuration;
        
        const gradient = ctx.createLinearGradient(oldest.x, oldest.y, newest.x, newest.y);
        gradient.addColorStop(0, hexToRgba(currentColor, Math.max(0, oldestOpacity * 0.3)));
        gradient.addColorStop(1, hexToRgba(currentColor, 1));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(2, size / 4);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      // Radius / Opacities
      const targetRadius = isWorkCard || (!isRing) ? size / 2 : hoverSize / 2;
      radiusRef.current = lerp(radiusRef.current, targetRadius, transitionSpeed);
      fillOpacityRef.current = lerp(fillOpacityRef.current, isWorkCard ? 1 : isRing ? 0 : 1, transitionSpeed);
      strokeOpacityRef.current = lerp(strokeOpacityRef.current, isWorkCard ? 0 : isRing ? 1 : 0, transitionSpeed);

      // Draw Main Dot/Ring
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, radiusRef.current, 0, Math.PI * 2);
      if (strokeOpacityRef.current > 0.01) {
        ctx.strokeStyle = hexToRgba(currentColor, strokeOpacityRef.current);
        ctx.lineWidth = borderWidth;
        ctx.stroke();
      }
      if (fillOpacityRef.current > 0.01) {
        ctx.fillStyle = hexToRgba(currentColor, fillOpacityRef.current);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [color, colorInverted, size, hoverSize, borderWidth, spring, friction, trailDuration, transitionSpeed]);

  if (!isBrowser) return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />,
    document.body
  );
}

function hexToRgba(color, alpha) {
  if (!color) return `rgba(0,0,0,${alpha})`;
  if (color.startsWith("rgba")) {
    return color.replace(/rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*[^)]+\)/, (_, r, g, b) => `rgba(${r},${g},${b},${alpha})`);
  }
  if (color.startsWith("rgb(")) {
    const body = color.slice(4, -1);
    return `rgba(${body},${alpha})`;
  }
  if (color.startsWith("#")) {
    let r = 0, g = 0, b = 0;
    if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return `rgba(0,0,0,${alpha})`;
}