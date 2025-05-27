"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

export function Canvas({ roomId,socket }: { roomId: string,socket:WebSocket }){
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const setup = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      cleanup = await initDraw(ctx, roomId,socket);
    };
    setup();
    return () => {
      if (cleanup) cleanup();
    };        
  }, [roomId]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: "block" }}
      />
    </div>
  );
}