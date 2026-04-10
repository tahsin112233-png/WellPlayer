import axios from "axios";

export type Source = {
  type: "file" | "iframe";
  url: string;
  name: string;
};

export type StreamResponse = {
  success: boolean;
  sources: Source[];
};

export async function getMoviesDrive(url: string): Promise<StreamResponse> {
  try {
    // 🔥 your extraction logic here
    // (for now dummy fallback)

    const sources: Source[] = [];

    // Example (replace later with real extractor)
    if (url.includes("moviesdrive")) {
      sources.push({
        type: "iframe",
        url: url,
        name: "MoviesDrive Embed",
      });
    }

    return {
      success: sources.length > 0,
      sources,
    };
  } catch (err) {
    return {
      success: false,
      sources: [],
    };
  }
}
