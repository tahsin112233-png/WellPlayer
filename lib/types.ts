export type Source = {
  type: "iframe" | "file";
  url: string;
  name: string;
};

export type StreamResponse = {
  success: boolean;
  sources: Source[];
};
