export async function getMyflixPosts() {
  try {
    const res = await fetch("https://myflixbd.to", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    const html = await res.text();

    // ✅ NO "s" FLAG — SAFE FOR VERCEL
    const regex = /<a href="(https:\/\/myflixbd\.to\/movie\/[^"]+)"[\s\S]*?<img src="([^"]+)"[\s\S]*?alt="([^"]+)"/g;

    const posts = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      posts.push({
        title: match[3],
        image: match[2],
        link: match[1],
      });
    }

    return posts.slice(0, 20);
  } catch (e) {
    console.log("Myflix failed", e);
    return [];
  }
}
