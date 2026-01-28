"use client";

import  { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

import { GifModal } from "./GifModal";

interface Gif {
  id: string;
  url: string;
  highResUrl: string;
  title: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface GifGridProps {
  initialGifs: Gif[];
  query?: string;
}

export const GifGridClient = ({ initialGifs, query }: GifGridProps) => {
  const [gifs, setGifs] = useState<Gif[]>(initialGifs);
  const [offset, setOffset] = useState(initialGifs.length);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGif, setSelectedGif] = useState<Gif | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Reset state when query changes (since initialGifs will be new from server)
  useEffect(() => {
    setGifs(initialGifs);
    setOffset(initialGifs.length);
    setHasMore(true);
  }, [initialGifs]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const url = new URL("/api/gifs", window.location.origin);
      url.searchParams.set("offset", offset.toString());
      if (query) url.searchParams.set("q", query);

      const res = await fetch(url);
      const newGifs = await res.json();

      if (newGifs.length === 0) {
        setHasMore(false);
      } else {
        setGifs((prev) => [...prev, ...newGifs]);
        setOffset((prev) => prev + newGifs.length);
      }
    } catch (error) {
      console.error("Error loading more gifs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, query, isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  // Distribute GIFs into 4 columns for the masonry effect
  const columns: Gif[][] = [[], [], [], []];
  gifs.forEach((gif, index) => {
    columns[index % 4].push(gif);
  });

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {columns.map((column, colIndex) => (
          <div key={`col-${colIndex}`} className="grid gap-4 h-fit">
            {column.map((gif, gifIndex) => (
              <div 
                key={`${gif.id}-${gifIndex}`} 
                className="relative group rounded-xl overflow-hidden cursor-pointer bg-zinc-900 shadow-sm hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedGif(gif)}
              >
                <Image
                  src={gif.url}
                  alt={gif.title}
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white text-sm font-medium truncate drop-shadow-md">
                      {gif.title || "Untitled"}
                    </span>
                    <button className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="py-12 flex justify-center">
        {isLoading && (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        )}
        {!hasMore && gifs.length > 0 && (
          <p className="text-zinc-500 font-medium italic">You've reached the end.</p>
        )}
      </div>

      {selectedGif && (
        <GifModal 
          gif={selectedGif} 
          onClose={() => setSelectedGif(null)} 
        />
      )}
    </div>
  );
};
