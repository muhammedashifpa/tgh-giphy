import { gf } from "../lib/giphy";

export const giphyService = {
  /**
   * Fetch trending GIFs
   * @param limit - Number of GIFs to fetch
   * @param offset - Offset for pagination
   */
  getTrendingGifs: async (limit: number = 20, offset: number = 0) => {
    try {
      const result = await gf.trending({ limit, offset });
      return result.data;
    } catch (error) {
      console.error("Error fetching trending gifs:", error);
      throw error;
    }
  },

  /**
   * Search for GIFs
   * @param query - Search term
   * @param limit - Number of GIFs to fetch
   * @param offset - Offset for pagination
   */
  searchGifs: async (query: string, limit: number = 20, offset: number = 0) => {
    try {
      const result = await gf.search(query, { limit, offset });
      return result.data;
    } catch (error) {
      console.error("Error searching gifs:", error);
      throw error;
    }
  }
};
