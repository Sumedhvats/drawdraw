"use client";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { ToolSelector } from "./ToolSelector";
import { MicBarComponent } from "./MicBarComponent";

export function CanvasRoom({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<"circle" | "rectangle" | "pencil">("circle");
  const[mic,setMic]=useState<boolean>(false);
  const [speaker,setSpeaker]=useState<boolean>(false);

  useEffect(() => {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYTBiZTI4Ni1iOTRlLTRmMTktODI3My1mOTczMmM0ZjU2ZTEiLCJ1c2VybmFtZSI6InN1bWVkaFZhdHMiLCJpYXQiOjE3NDg2NzI4NTMsImV4cCI6MTc0OTI3NzY1M30.9uwxLGPwQojkNzLg5kwXffd3CQZh_2ETU2u934kfc3w`;
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
    <div className="relative w-screen h-screen overflow-hidden">
      <Canvas roomId={roomId} socket={socket} tool={selectedTool} />

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <ToolSelector selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <MicBarComponent speaker={speaker} mic={mic} setSpeaker={setSpeaker} setMic={setMic} />
      </div>
    </div>
  );
}