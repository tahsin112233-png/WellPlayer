export async function getPosts() {
  const res = await fetch("/api/posts");
  return res.json();
}

export async function getSources(url: string) {
  const res = await fetch(`/api/source?url=${encodeURIComponent(url)}`);
  return res.json();
}

export async function getStream(url: string) {
  const res = await fetch(`/api/stream?url=${encodeURIComponent(url)}`);
  return res.json();
}
