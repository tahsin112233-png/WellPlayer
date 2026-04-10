export async function getDirect() {
  return [
    {
      type: "file",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      name: "Direct Fallback",
    },
  ];
}
