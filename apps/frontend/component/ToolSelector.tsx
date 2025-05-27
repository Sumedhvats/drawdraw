import { Circle, Pencil, RectangleVertical } from "lucide-react";
import { IconComponent } from "./IconComponent";

export function ToolSelector({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: "circle" | "rectangle" | "pencil";
  setSelectedTool: (tool: "circle" | "rectangle" | "pencil") => void;
}) {
  return (
    <div className="flex justify-center w-full mt-4">
      <div className="flex gap-2 bg-[#1E1E2F] p-2 px-4 rounded-full shadow-md border border-gray-700">
        <IconComponent
          onClick={() => setSelectedTool("circle")}
          icon={<Circle size={20} />}
          activated={selectedTool === "circle"}
        />
        <IconComponent
          onClick={() => setSelectedTool("pencil")}
          icon={<Pencil size={20} />}
          activated={selectedTool === "pencil"}
        />
        <IconComponent
          onClick={() => setSelectedTool("rectangle")}
          icon={<RectangleVertical size={20} />}
          activated={selectedTool === "rectangle"}
        />
      </div>
    </div>
  );
}
