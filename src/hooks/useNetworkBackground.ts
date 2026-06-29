"use client";

import { useEffect, type RefObject } from "react";

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

function getCssColor(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function useNetworkBackground(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const activeCanvas = canvas;
    const activeContext = context;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let nodes: NodePoint[] = [];

    const accent = hexToRgb(getCssColor("--color-accent-primary") || "#7c3aed");

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      activeCanvas.width = Math.floor(width * ratio);
      activeCanvas.height = Math.floor(height * ratio);
      activeCanvas.style.width = `${width}px`;
      activeCanvas.style.height = `${height}px`;
      activeContext.setTransform(ratio, 0, 0, ratio, 0, 0);

      nodes = Array.from({ length: 60 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    }

    function animate() {
      activeContext.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = Math.min((1 - distance / 150) * 0.15, 0.15);
            activeContext.strokeStyle = `rgba(${accent.r}, ${accent.g}, ${accent.b}, ${opacity})`;
            activeContext.beginPath();
            activeContext.moveTo(a.x, a.y);
            activeContext.lineTo(b.x, b.y);
            activeContext.stroke();
          }
        }
      }

      activeContext.fillStyle = `rgb(${accent.r}, ${accent.g}, ${accent.b})`;
      for (const node of nodes) {
        activeContext.globalAlpha = 0.2;
        activeContext.beginPath();
        activeContext.arc(node.x, node.y, 1.8, 0, Math.PI * 2);
        activeContext.fill();
      }
      activeContext.globalAlpha = 1;

      animationFrame = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}
