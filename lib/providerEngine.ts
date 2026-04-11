import { getMovieLinkBD } from "./providers/movielinkbd";

export async function getProvider() {
  try {
    const data = await getMovieLinkBD();

    return {
      success: true,
      sources: data,
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      sources: [],
    };
  }
}
