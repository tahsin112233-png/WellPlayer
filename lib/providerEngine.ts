import * as moviesdrive from "./providers/moviesdrive/posts";

export const getProvider = (name: string) => {
  switch (name) {
    case "moviesdrive":
      return moviesdrive;
    default:
      throw new Error("Provider not found");
  }
};
