"use client";

import React, { memo } from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoaderComponent = ({ size = "md", text, className = "" }: LoaderProps) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-t-2 border-b-2",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-2 border-b-2 border-purple-500 ${sizeClasses[size]}`}
      ></div>
      {text && (
        <p className="text-zinc-500 font-medium">{text}</p>
      )}
    </div>
  );
};

export const Loader = memo(LoaderComponent);
