"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

export function Canvas({ 
  roomId, 
  socket, 
  tool 
}: { 
  roomId: string;
  socket: WebSocket;
  tool: "circle" | "rectangle" | "pencil";
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const toolRef = useRef(tool);
const cleanupRef = useRef<(() => void) | undefined>(undefined);

  // Update tool reference when tool changes
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    const setup = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Clean up previous setup
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      
      cleanupRef.current = await initDraw(ctx, roomId, socket, toolRef);
    };

    setup();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };        
  }, [roomId, socket]); // Only re-initialize when roomId or socket changes

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