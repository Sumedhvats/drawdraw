"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      initDraw(ctx);
    }
  });
  return (
    <div>
      <canvas ref={canvasRef} width={1920} height={1080}></canvas>
    </div>
  );
}
