"use client";

import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) => {
  return (
    <form onSubmit={onSubmit} className={`relative group ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-full py-4 px-6 pl-14 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-md group-hover:border-zinc-600/50 shadow-2xl"
      />
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
      >
        Search
      </button>
    </form>
  );
};
