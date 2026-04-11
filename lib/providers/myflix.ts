export async function getMyflixPosts() {
  try {
    const res = await fetch("https://myflixbd.to", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await res.text();

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

    // 🔥 VERY IMPORTANT FALLBACK
    return [
      {
        title: "Fallback Movie",
        link: "https://myflixbd.to",
        image: "https://via.placeholder.com/300x450",
      },
    ];
  }
}
