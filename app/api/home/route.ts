import { getMovieLinkBD } from "@/lib/providers/movielinkbd";

export async function GET() {
  try {
    const posts = await getMovieLinkBD();

    return Response.json(posts);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
