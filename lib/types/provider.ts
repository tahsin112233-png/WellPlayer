export interface Post {
  title: string;
  image: string;
  link: string;
}

export interface Info {
  title: string;
  image: string;
  synopsis?: string;
  type: "movie" | "series";
  linkList?: any[];
}

export interface Stream {
  server: string;
  link: string;
  type?: string;
  quality?: string;
}
