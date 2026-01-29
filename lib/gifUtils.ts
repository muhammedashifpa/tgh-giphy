import { Gif, GiphyGif } from "../types/gif";

/**
 * Normalizes a raw GIF object from the Giphy API into a standard Gif format used by the client.
 */
export const normalizeGif = (gif: any): Gif => {
  return {
    id: gif.id,
    url: gif.images.fixed_width.url,
    highResUrl: gif.images.original.url,
    title: gif.title,
    user: {
      name: gif.user?.display_name || gif.username || "Anonymous",
      avatar: gif.user?.avatar_url
    }
  };
};

/**
 * Normalizes an array of raw GIF objects from the Giphy API.
 */
export const normalizeGifs = (gifs: any[]): Gif[] => {
  return gifs.map(normalizeGif);
};
