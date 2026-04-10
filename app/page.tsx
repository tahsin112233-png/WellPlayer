"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/lib/api";
import Row from "@/components/Row";
import PlayerModal from "@/components/PlayerModal";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    getPosts().then((res) => {
      if (res.success) setMovies(res.posts);
    });
  }, []);

  return (
    <div style={{ background: "black", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "white" }}>WellPlayer 🎬</h1>

      <Row
        title="Trending"
        movies={movies}
        onClick={(m: any) => setSelected(m)}
      />

      {selected && (
        <PlayerModal
          movie={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
