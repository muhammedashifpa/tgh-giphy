import React from "react";
import { GifSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center pt-8">
        <div className="h-12 w-64 bg-zinc-800 animate-pulse mx-auto mb-4 rounded-xl" />
        <div className="h-6 w-96 bg-zinc-800 animate-pulse mx-auto mb-8 rounded-lg" />
        
        {/* Search Bar Skeleton */}
        <div className="w-full max-w-4xl mx-auto mb-16 space-y-6">
          <div className="h-16 w-full bg-zinc-800 animate-pulse rounded-full" />
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-zinc-800 animate-pulse rounded-full" />
            ))}
          </div>
        </div>
      </header>

      <main>
        <div className="space-y-8">
          <div className="h-8 w-48 bg-zinc-800 animate-pulse rounded-full mx-4" />
          <GifSkeleton />
        </div>
      </main>
    </div>
  );
}
