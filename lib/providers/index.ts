export async function getSources(url: string) {
  const sources = [];

  // 🔥 Provider 1 (iframe safe fallback)
  const slug = url.split("/movie/")[1]?.replace("/", "");

  sources.push({
    name: "Server 1",
    type: "iframe",
    url: `https://vidsrc.to/embed/movie/${slug}`
  });

  // 🔥 Placeholder for future real extractor
  // sources.push(await hubcloudExtractor(url));

  return sources;
}
