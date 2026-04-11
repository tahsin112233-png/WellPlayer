import { getMyflixPosts } from "./myflix";

export async function getAllContent() {
  const myflix = await getMyflixPosts();

  return [
    ...myflix,
    // later add:
    // ...vegamovies
    // ...moviesdrive
  ];
}
