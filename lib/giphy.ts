import { GiphyFetch } from "@giphy/js-fetch-api";

// Initialize the Giphy Fetch API client
const apiKey = "q7nw5M3MeOpMLncZr7pxZxrH7MRczhuR"

if (!apiKey) {
  console.warn("Giphy API Key is missing. Please add GIPHY_API_KEY to your .env file.");
}

export const gf = new GiphyFetch(apiKey);
