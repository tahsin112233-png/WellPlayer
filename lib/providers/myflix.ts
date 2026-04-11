export async function getMyflixPosts() {
  try {
    const res = await fetch("https://myflixbd.to", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    const html = await res.text();

    const posts = [...html.matchAll(/<a href="(https:\/\/myflixbd\.to\/movie\/[^"]+)".*?<img src="([^"]+)".*?alt="([^"]+)"/gs)]
      .map(match => ({
        title: match[3],
        image: match[2],
        link: match[1],
      }));

    return posts.slice(0, 20);
  } catch (e) {
    console.log("Myflix failed", e);
    return [];
  }
}
