export async function getMovieLinkBD() {
  try {
    const res = await fetch("https://movielinkbd.li", {
      cache: "no-store",
    });

    const html = await res.text();

    // basic scraping (you can refine later)
    const regex =
      /<a href="(https:\/\/movielinkbd\.li\/[^"]+)"[^>]*>\s*<img src="([^"]+)"[^>]*>\s*<h2[^>]*>([^<]+)<\/h2>/g;

    const posts: {
      title: string;
      image: string;
      link: string;
    }[] = [];

    let match;

    while ((match = regex.exec(html)) !== null) {
      posts.push({
        link: match[1],
        image: match[2],
        title: match[3].trim(),
      });
    }

    return posts.slice(0, 20); // limit
  } catch (err) {
    console.error("MovieLinkBD fetch error:", err);
    return [];
  }
}
