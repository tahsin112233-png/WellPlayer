import * as moviesdrive from "./providers/moviesdrive/posts";
import * as myflixbd from "./providers/myflixbd/posts";

export const getProvider = (name: string) => {
  switch (name) {
    case "moviesdrive":
      return moviesdrive;

    case "myflixbd":
      return myflixbd;

    default:
      throw new Error("Provider not found");
  }
};
