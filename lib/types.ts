// lib/types.ts

export type Source = {
  type: "file" | "iframe";
  url: string;
  name: string;
};

export type StreamResponse = {
  success: boolean;
  sources: Source[];
};
