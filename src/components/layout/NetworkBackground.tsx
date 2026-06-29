"use client";

import { useRef } from "react";

import { useNetworkBackground } from "@/hooks/useNetworkBackground";

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useNetworkBackground(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    />
  );
}
