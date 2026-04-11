export async function getMovieLinkBD() {
  try {
    const res = await fetch("https://movielinkbd.li", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await res.text();

    const posts: {
      title: string;
      image: string;
      link: string;
    }[] = [];

    const items = html.split("<article");

    for (let item of items) {
      const linkMatch = item.match(/href="(https:\/\/movielinkbd\.li\/[^"]+)"/);
      const imgMatch = item.match(/src="([^"]+)"/);
      const titleMatch = item.match(/alt="([^"]+)"/);

      if (linkMatch && imgMatch && titleMatch) {
        posts.push({
          link: linkMatch[1],
          image: imgMatch[1],
          title: titleMatch[1],
        });
      }
    }

    return posts;
  } catch (e) {
    console.error("MovieLinkBD fetch error:", e);
    return [];
  }
}
