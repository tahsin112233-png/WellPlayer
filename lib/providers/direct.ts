export function getDirect(url: string) {
  if (url.endsWith(".mp4") || url.endsWith(".m3u8")) {
    return {
      success: true,
      sources: [
        {
          type: "file",
          url,
          name: "Direct",
        },
      ],
    };
  }

  return { success: false, sources: [] };
}
