import Link from "next/link";

import { SearchBar } from "@/components/SearchBar.client";
import { GifGridClient } from "@/components/GifGrid.client";
import { giphyService } from "@/services/giphyService";
import { normalizeGifs } from "@/lib/gifUtils";
import { Gif } from "@/types/gif";

// This sets the default revalidation time for the page (ISR: 30 minutes)
export const revalidate = 1800;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;
  let initialGifs: Gif[] = [];
  let error = null;

  try {
    // Fetch initial 20 GIFs on the server
    const data = query 
      ? await giphyService.searchGifs(query, 20)
      : await giphyService.getTrendingGifs(20);

    initialGifs = normalizeGifs(data);
  } catch (err) {
    console.error("Server Fetch Error:", err);
    error = "Failed to load GIFs. Please check your API configuration.";
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center pt-8">
        <Link href="/" className="inline-block group">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-tight transition-all duration-300 group-hover:opacity-80 group-active:scale-95">
            Giphy Explorer
          </h1>
        </Link>
        <p className="text-zinc-400 text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto">
          Explore the world of GIFs with high-performance search and instant streaming.
        </p>
        <SearchBar />
      </header>
      
      <main>
        {error ? (
          <div className="text-center py-20 px-4">
             <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold px-0 md:px-4 text-zinc-100 flex items-center gap-2">
              <span className="w-2 h-8 bg-purple-600 rounded-full" />
              {query ? `Search Results for "${query}"` : "Trending Now"}
            </h2>
            <GifGridClient initialGifs={initialGifs} query={query} />
          </div>
        )}
      </main>
      
      <footer className="mt-20 md:mt-32 py-12 border-t border-zinc-800 text-center text-zinc-500 text-xs md:text-sm">
        <p>© {new Date().getFullYear()} Giphy Explorer. Powered by Giphy API.</p>
      </footer>
    </div>
  );
}
