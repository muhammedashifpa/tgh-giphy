import { GiphyFetch } from "@giphy/js-fetch-api";

// Initialize the Giphy Fetch API client
const apiKey = process.env.GIPHY_API_KEY || "";

if (!apiKey) {
  console.warn("Giphy API Key is missing. Please add GIPHY_API_KEY to your .env file.");
}

export const gf = new GiphyFetch(apiKey);
