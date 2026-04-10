import * as moviesdrive from "./providers/moviesdrive/posts";
import * as myflixPosts from "./providers/myflixbd/posts";
import * as myflixMeta from "./providers/myflixbd/meta";

export const getProvider = (name: string) => {
  switch (name) {
    case "moviesdrive":
      return moviesdrive;

    case "myflixbd":
      return {
        ...myflixPosts,
        ...myflixMeta,
      };

    default:
      throw new Error("Provider not found");
  }
};
