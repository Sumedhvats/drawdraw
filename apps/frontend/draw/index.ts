import { RoughCanvas } from "roughjs/bin/canvas";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
    };

export async function initDraw(
  roughCanvas: RoughCanvas,
  ctx: CanvasRenderingContext2D,
  roomId: string,
  socket: WebSocket,
  toolRef: React.MutableRefObject<"circle" | "rectangle" | "pencil">
) {
  const canvas = ctx.canvas;
  let existingShapes: Shape[] = await getExistingShapes(roomId);
  
  // Track if we're already initialized to prevent duplicate listeners
  if (canvas.dataset.initialized === 'true') {
    return () => {}; // Return empty cleanup if already initialized
  }
  canvas.dataset.initialized = 'true';

  // Use a Set to track processed message IDs to prevent duplicates
  const processedMessages = new Set<string>();

  const handleSocketMessage = (event: MessageEvent) => {
    console.log("Received socket message", event.data);
    
    try {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        // Create a unique ID for this message to prevent duplicates
        const messageId = `${message.roomId}-${Date.now()}-${Math.random()}`;
        
        if (processedMessages.has(messageId)) {
          return; // Skip if already processed
        }
        processedMessages.add(messageId);
        
        const parsed = JSON.parse(message.message);
        const shape = parsed.createdShape as Shape;
        
        // Only add if it's a valid shape and not already in existingShapes
        if (shape && !existingShapes.some(s => JSON.stringify(s) === JSON.stringify(shape))) {
          existingShapes = [...existingShapes, shape]; // Create new array instead of mutating
          renderCanvas(existingShapes, ctx, roughCanvas);
        }
      }
    } catch (error) {
      console.error("Error processing socket message:", error);
    }
  };

  socket.addEventListener('message', handleSocketMessage);

  // Initial render
  renderCanvas(existingShapes, ctx, roughCanvas);

  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let pencilPoints: { x: number; y: number }[] = [];
  let animationFrameId: number | null = null;

  const getMousePos = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onMouseDown = (e: MouseEvent) => {
    const pos = getMousePos(e);
    isDrawing = true;
    startX = pos.x;
    startY = pos.y;

    if (toolRef.current === "pencil") {
      pencilPoints = [{ x: pos.x, y: pos.y }];
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    let createdShape: Shape;

    if (toolRef.current === "rectangle") {
      const width = pos.x - startX;
      const height = pos.y - startY;
      createdShape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      };
    } else if (toolRef.current === "circle") {
      const width = pos.x - startX;
      const height = pos.y - startY;
      createdShape = {
        type: "circle",
        x: startX,
        y: startY,
        width,
        height,
      };
    } else if (toolRef.current === "pencil") {
      pencilPoints.push({ x: pos.x, y: pos.y });
      createdShape = {
        type: "pencil",
        points: [...pencilPoints],
      };
    } else {
      return; // Invalid tool
    }

    // Add to local state immediately for responsive UI
    existingShapes = [...existingShapes, createdShape];
    isDrawing = false;
    renderCanvas(existingShapes, ctx, roughCanvas);

    // Send to socket (but don't re-add when we receive it back)
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          createdShape,
        }),
        roomId: roomId,
      })
    );

    // Reset pencil points for next drawing
    if (toolRef.current === "pencil") {
      pencilPoints = [];
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    // Cancel previous animation frame to prevent stacking
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      const pos = getMousePos(e);
      
      // Clear and render existing shapes
      renderCanvas(existingShapes, ctx, roughCanvas);

      // Set stroke style for preview shape
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;

      if (toolRef.current === "rectangle") {
        const width = pos.x - startX;
        const height = pos.y - startY;
        
        // Draw preview rectangle with proper styling
        const drawable = roughCanvas.generator.rectangle(startX, startY, width, height, {
          stroke: "white",
          strokeWidth: 1,
          fill: "transparent",
          fillStyle: "solid"
        });
        roughCanvas.draw(drawable);
      } else if (toolRef.current === "circle") {
        const width = pos.x - startX;
        const height = pos.y - startY;
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const radiusX = Math.abs(width / 2);
        const radiusY = Math.abs(height / 2);

        // Draw preview ellipse with proper styling
        const drawable = roughCanvas.generator.ellipse(centerX, centerY, radiusX * 2, radiusY * 2, {
          stroke: "white",
          strokeWidth: 1,
          fill: "transparent",
          fillStyle: "solid"
        });
        roughCanvas.draw(drawable);
      } else if (toolRef.current === "pencil") {
        pencilPoints.push({ x: pos.x, y: pos.y });

        // Draw pencil line
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
        for (let i = 1; i < pencilPoints.length; i++) {
          ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
        }
        ctx.stroke();
      }
    });
  };

  // Optimized render function
  function renderCanvas(shapes: Shape[], ctx: CanvasRenderingContext2D, roughCanvas: RoughCanvas) {
    const canvas = ctx.canvas;
    
    // Clear and set background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    shapes.forEach((shape) => {
      try {
        if (shape.type === "rect") {
          const drawable = roughCanvas.generator.rectangle(shape.x, shape.y, shape.width, shape.height, {
            stroke: "white",
            strokeWidth: 1,
            fill: "transparent",
            fillStyle: "solid"
          });
          roughCanvas.draw(drawable);
        } else if (shape.type === "circle") {
          const centerX = shape.x + shape.width / 2;
          const centerY = shape.y + shape.height / 2;
          const radiusX = Math.abs(shape.width / 2);
          const radiusY = Math.abs(shape.height / 2);

          const drawable = roughCanvas.generator.ellipse(centerX, centerY, radiusX * 2, radiusY * 2, {
            stroke: "white",
            strokeWidth: 1,
            fill: "transparent",
            fillStyle: "solid"
          });
          roughCanvas.draw(drawable);
        } else if (shape.type === "pencil" && shape.points.length > 0) {
          ctx.beginPath();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1;
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          for (let i = 1; i < shape.points.length; i++) {
            ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }
          ctx.stroke();
        }
      } catch (error) {
        console.error("Error rendering shape:", shape, error);
      }
    });
  }

  async function getExistingShapes(roomId: string): Promise<Shape[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HTTP_BACKEND}/chats/${roomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYTBiZTI4Ni1iOTRlLTRmMTktODI3My1mOTczMmM0ZjU2ZTEiLCJ1c2VybmFtZSI6InN1bWVkaFZhdHMiLCJpYXQiOjE3NDg0MzU3ODYsImV4cCI6MTc0OTA0MDU4Nn0.ZuyEeGEBDRIhEiSlfWz-0ZVsopohuU8fW4SLW8XQyYk`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { chats } = await response.json();

      return chats.map((x: { message: string }) => {
        try {
          const data = JSON.parse(x.message);
          return data.createdShape;
        } catch (error) {
          console.error("Error parsing shape data:", error);
          return null;
        }
      }).filter(Boolean); // Remove null values
    } catch (err) {
      console.error("Failed to fetch shapes", err);
      return [];
    }
  }

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  // Return cleanup function
  return () => {
    canvas.dataset.initialized = 'false';
    socket.removeEventListener('message', handleSocketMessage);
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mousemove", onMouseMove);
    
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}