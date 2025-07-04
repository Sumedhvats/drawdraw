"use client";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { ToolSelector } from "./ToolSelector";

export function CanvasRoom({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<"circle" | "rectangle" | "pencil">("circle");

  useEffect(() => {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYTBiZTI4Ni1iOTRlLTRmMTktODI3My1mOTczMmM0ZjU2ZTEiLCJ1c2VybmFtZSI6InN1bWVkaFZhdHMiLCJpYXQiOjE3NDg3ODg3OTgsImV4cCI6MTc0OTM5MzU5OH0.3zz2Bmdbgun_vicuqkY1cudKpk1s26Q-BrhYUfNZ7WQ`;
    if (!wsUrl) {
      setError("WebSocket URL is not defined.");
      return;
    }

    console.log("Connecting to WebSocket:", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type: "join_room",
        roomId,
      }));
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
      setError("WebSocket connection failed.");
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  if (error) return <div>Error: {error}</div>;
  if (!socket) return <div>Connecting to server...</div>;

  return (
    <div className="flex flex-col items-center">
      <ToolSelector selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <Canvas roomId={roomId} socket={socket} tool={selectedTool} />
    </div>
  );
}