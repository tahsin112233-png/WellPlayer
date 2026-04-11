export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieUrl = searchParams.get("url");

  if (!movieUrl) {
    return Response.json({ error: "No URL" });
  }

  try {
    // STEP 1: open movie page
    const movieRes = await fetch(movieUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    const movieHtml = await movieRes.text();

    // STEP 2: extract WATCH link
    const watchMatch = movieHtml.match(
      /href="(https:\/\/xm3enq\.movielinkbd\.li\/watch\/[^"]+)"/
    );

    if (!watchMatch) {
      return Response.json({ error: "No watch link" });
    }

    const watchUrl = watchMatch[1];

    // STEP 3: open watch page
    const watchRes = await fetch(watchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    const watchHtml = await watchRes.text();

    // STEP 4: extract REAL STREAM
    const streamMatch = watchHtml.match(
      /https:\/\/play\.movielinkbd\.mom\/watch\/[^\s"'<>]+/
    );

    if (!streamMatch) {
      return Response.json({ error: "No stream found" });
    }

    return Response.json({
      sources: [
        {
          url: streamMatch[0],
          type: "mp4",
        },
      ],
    });
  } catch (err) {
    return Response.json({ error: "Failed" });
  }
}
