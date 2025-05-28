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
  ctx: CanvasRenderingContext2D,
  roomId: string,
  socket: WebSocket,
  toolRef: React.MutableRefObject<"circle" | "rectangle" | "pencil">
) {
  const canvas = ctx.canvas;
  let existingShapes: Shape[] = await getExistingShapes(roomId);

  socket.onmessage = (event) => {
    console.log("Received socket message", event.data);
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      const parsed = JSON.parse(message.message);
      const shape = parsed.createdShape as Shape;
      existingShapes.push(shape);
      clearCanvas(existingShapes, ctx);
    }
  };

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";

  clearCanvas(existingShapes, ctx);

  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let pencilPoints: { x: number; y: number }[] = [];

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

    existingShapes.push(createdShape);
    isDrawing = false;
    clearCanvas(existingShapes, ctx);
    
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

    const pos = getMousePos(e);
    clearCanvas(existingShapes, ctx);
    ctx.strokeStyle = "white";

    if (toolRef.current === "rectangle") {
      const width = pos.x - startX;
      const height = pos.y - startY;
      ctx.strokeRect(startX, startY, width, height);
    } else if (toolRef.current === "circle") {
      const width = pos.x - startX;
      const height = pos.y - startY;
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;
      const radiusX = Math.abs(width / 2);
      const radiusY = Math.abs(height / 2);
      
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (toolRef.current === "pencil") {
      pencilPoints.push({ x: pos.x, y: pos.y });
      
      // Draw the current pencil stroke
      ctx.beginPath();
      ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
      for (let i = 1; i < pencilPoints.length; i++) {
        ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
      }
      ctx.stroke();
    }
  };

  function clearCanvas(shapes: Shape[], ctx: CanvasRenderingContext2D) {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    shapes.forEach((shape) => {
      if (shape.type === "rect") {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        const centerX = shape.x + shape.width / 2;
        const centerY = shape.y + shape.height / 2;
        const radiusX = Math.abs(shape.width / 2);
        const radiusY = Math.abs(shape.height / 2);
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape.type === "pencil") {
        ctx.beginPath();
        if (shape.points.length > 0) {
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          for (let i = 1; i < shape.points.length; i++) {
            ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }
          ctx.stroke();
        }
      }
    });
  }

  async function getExistingShapes(roomId: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HTTP_BACKEND}/chats/${roomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYTBiZTI4Ni1iOTRlLTRmMTktODI3My1mOTczMmM0ZjU2ZTEiLCJ1c2VybmFtZSI6InN1bWVkaFZhdHMiLCJpYXQiOjE3NDgyODgzMDksImV4cCI6MTc0ODg5MzEwOX0.1JJirS45iflaOxHGqA9TKE53GUXnfVQbdk7jJv6KynU`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { chats } = await response.json();

      return chats.map((x: { message: string }) => {
        const data = JSON.parse(x.message);
        return data.createdShape;
      });
    } catch (err) {
      console.error("Failed to fetch shapes", err);
      return [];
    }
  }

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mousemove", onMouseMove);
  };
}