"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "./ui/SearchInput.client";

import { Tag } from "./ui/Tag.client";

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
  { id: "sports", label: "⚽ Sports", value: "sports" },
  { id: "gaming", label: "🎮 Gaming", value: "gaming" },
  { id: "movies", label: "🍿 Movies", value: "movies" },
  { id: "food", label: "🍕 Food", value: "food" },
  { id: "travel", label: "✈️ Travel", value: "travel" },
  { id: "art", label: "🎨 Art", value: "art" },
  { id: "science", label: "🔬 Science", value: "science" },
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
      <SearchInput 
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        placeholder="Search for GIFs..."
      />

      <div className="flex flex-wrap items-center justify-center gap-3 px-4">
        {TAGS.map((tag) => (
          <Tag
            key={tag.id}
            label={tag.label}
            isActive={(tag.value === "" && !currentQuery) || (tag.value !== "" && currentQuery === tag.value)}
            onClick={() => handleSearch(tag.value)}
          />
        ))}
      </div>
    </div>
  );
};
