export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://xm3enq.movielinkbd.li/", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    const html = await res.text();

    // Extract movie cards
    const matches = [
      ...html.matchAll(
        /href="(https:\/\/xm3enq\.movielinkbd\.li\/movie\/[^"]+)".*?<img src="([^"]+)".*?alt="([^"]+)"/gs
      ),
    ];

    const posts = matches.map((m) => ({
      title: m[3],
      link: m[1],
      image: m[2],
    }));

    return Response.json({ success: true, posts });
  } catch (e) {
    return Response.json({ success: false });
  }
}
