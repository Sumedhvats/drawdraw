import { ReactNode } from "react";

export function IconComponent({
  icon,
  onClick,
  activated,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md hover:bg-[#2A2A3D] transition-colors duration-150 ${
        activated ? "bg-[#3B3B57] text-white" : "text-gray-300"
      }`}
    >
      {icon}
    </button>
  );
}
