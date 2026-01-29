"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => {
  return (
    <div 
      className={`animate-pulse bg-zinc-800/50 rounded-xl ${className}`}
    />
  );
};

export const GifSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 px-0 md:px-4">
        {[...Array(4)].map((_, colIndex) => (
          <div key={`skeleton-col-${colIndex}`} className="grid gap-2 md:gap-4 h-fit">
            {[...Array(5)].map((_, itemIndex) => {
              // Varying heights for masonry feel
              const heights = ["h-48", "h-64", "h-40", "h-72", "h-56"];
              const height = heights[(colIndex + itemIndex) % heights.length];
              return (
                <Skeleton 
                  key={`skeleton-item-${colIndex}-${itemIndex}`} 
                  className={`w-full ${height}`} 
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
