import axios from "axios";

export async function getMyFlix(url: string) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = res.data;

    const match = html.match(/https?:\/\/short\.icu\/[^\s"'<>]+/);

    if (!match) return [];

    return [
      {
        type: "iframe",
        url: match[0],
        name: "MyFlixBD",
      },
    ];
  } catch {
    return [];
  }
}
