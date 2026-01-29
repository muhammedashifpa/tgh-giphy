"use client";

import { memo } from "react";

interface TagProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const TagComponent = ({
  label,
  isActive,
  onClick,
  className = "",
}: TagProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${
        isActive
          ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40 translate-y-[-2px]"
          : "bg-zinc-900/50 border-zinc-700/50 text-zinc-400 hover:border-purple-500/50 hover:text-white hover:translate-y-[-2px]"
      } ${className}`}
    >
      {label}
    </button>
  );
};

export const Tag = memo(TagComponent);
