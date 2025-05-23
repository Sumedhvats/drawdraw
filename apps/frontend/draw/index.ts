export function initDraw(ctx: CanvasRenderingContext2D) {
  const canvas = ctx.canvas;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white"; 

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

  const onMouseUp = () => {
    isDrawing = false;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;

    // Clear and redraw background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw rectangle
    ctx.strokeStyle = "white";
    ctx.strokeRect(startX, startY, width, height);
  };

  // Attach listeners
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  // Optional: Cleanup helper if needed later
  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mousemove", onMouseMove);
  };
}
