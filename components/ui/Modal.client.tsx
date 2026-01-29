"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-7xl",
  maxHeight = "h-[90vh]",
  className = "",
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[60] backdrop-blur-md"
        aria-label="Close modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <div 
        className={`relative ${maxWidth} w-full ${maxHeight} flex flex-col bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/50 animate-in zoom-in-95 duration-300 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
