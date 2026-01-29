"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const TAGS = [
  { id: "trending", label: "🔥 Trending", value: "" },
  { id: "ajp", label: "🕺🏻 AJP", value: "ajp" },
  { id: "kerala", label: "🌴 Kerala", value: "kerala" },
  { id: "suresh-gopi", label: "🕶️ Suresh Gopi", value: "suresh gopi" },
  { id: "happy", label: "😊 Happy", value: "happy" },
  { id: "coding", label: "💻 Coding", value: "coding" },
  { id: "cats", label: "🐱 Cats", value: "cats" },
  { id: "music", label: "🎵 Music", value: "music" },
  { id: "nature", label: "🌲 Nature", value: "nature" },
  { id: "anime", label: "🎌 Anime", value: "anime" },
];

export const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(currentQuery);

  // Sync with URL params (e.g., when navigation happens)
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSearch = (val: string) => {
    const trimmed = val.trim();
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 space-y-6">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for GIFs..."
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

      <div className="flex flex-wrap items-center justify-center gap-3 px-4">
        {TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleSearch(tag.value)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
              (tag.value === "" && !currentQuery) || (tag.value !== "" && currentQuery === tag.value)
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40 translate-y-[-2px]"
                : "bg-zinc-900/50 border-zinc-700/50 text-zinc-400 hover:border-purple-500/50 hover:text-white hover:translate-y-[-2px]"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
};
