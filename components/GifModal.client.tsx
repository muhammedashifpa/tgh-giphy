"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "./ui/Modal.client";

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

interface GifModalProps {
  gif: Gif | null;
  isLoading?: boolean;
  onClose: () => void;
}

export const GifModal = ({ gif, isLoading, onClose }: GifModalProps) => {
  const [imgLoading, setImgLoading] = useState(true);
  console.log(gif,"Gif");

  return (
    <Modal isOpen={!!(gif || isLoading)} onClose={onClose}>
      {isLoading || !gif ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-zinc-900 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-zinc-500 font-medium">Summoning your GIF...</p>
        </div>
      ) : (
        <>
          <div className="relative flex-1 bg-zinc-900 flex items-center justify-center overflow-hidden min-h-[400px]">
            {/* Low-res layer (visible immediately) */}
            {imgLoading && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={gif.url}
                  alt={gif.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}

            {/* High-res layer */}
            <Image
              src={gif.highResUrl}
              alt={gif.title}
              fill
              className={`relative z-10 object-contain transition-opacity duration-700 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoadingComplete={() => setImgLoading(false)}
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>

          <div className="p-6 bg-zinc-950 border-t border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate mb-1">
                  {gif.title || "Untitled GIF"}
                </h2>
                <div className="flex items-center gap-2">
                  {gif.user.avatar && (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src={gif.user.avatar} 
                        alt={gif.user.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text-zinc-400 text-sm truncate font-medium">
                    {gif.user.name}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                  onClick={() => {
                      navigator.clipboard.writeText(gif.highResUrl);
                      alert("Link copied to clipboard!");
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
