import { Post } from "@/lib/types/provider";

export const getPosts = async (): Promise<Post[]> => {
  return [
    {
      title: "Avatar",
      image: "https://via.placeholder.com/300x450",
      link: "/movie/avatar",
    },
    {
      title: "The Boys",
      image: "https://via.placeholder.com/300x450",
      link: "/tv/the-boys",
    },
  ];
};
