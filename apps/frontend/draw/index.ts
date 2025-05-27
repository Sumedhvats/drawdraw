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
      centerX: number;
      centerY: number;
      radius: number;
    };

export async function initDraw(
  ctx: CanvasRenderingContext2D,
  roomId: string,
  socket: WebSocket
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
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    const createdShape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
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
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;

    clearCanvas(existingShapes, ctx);
    ctx.strokeStyle = "white";
    ctx.strokeRect(startX, startY, width, height);
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
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
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
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYTBiZTI4Ni1iOTRlLTRmMTktODI3My1mOTczMmM0ZjU2ZTEiLCJ1c2VybmFtZSI6InN1bWVkaFZhdHMiLCJpYXQiOjE3NDgyODgzMDksImV4cCI6MTc0ODg5MzEwOX0.1JJirS45iflaOxHGqA9TKE53GUXnfVQbdk7jJv6KynU`, // or wherever your token is stored
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
