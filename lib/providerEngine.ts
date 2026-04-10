import * as myflixPosts from "./providers/myflixbd/posts";
import * as myflixMeta from "./providers/myflixbd/meta";
import * as myflixStream from "./providers/myflixbd/stream";

...

case "myflixbd":
  return {
    ...myflixPosts,
    ...myflixMeta,
    ...myflixStream,
  };
