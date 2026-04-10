"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/lib/api";
import { searchMovie } from "@/lib/tmdb";
import Row from "@/components/Row";
import PlayerModal from "@/components/PlayerModal";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [hero, setHero] = useState<any>(null);

  useEffect(() => {
    getPosts().then(async (res) => {
      if (res.success) {
        setMovies(res.posts);

        const random = res.posts[0];
        const tmdb = await searchMovie(random.title);

        if (tmdb) setHero(tmdb);
      }
    });
  }, []);

  return (
    <div style={{ background: "black", minHeight: "100vh" }}>
      
      {/* 🎬 HERO */}
      {hero && (
        <div
          style={{
            height: 400,
            backgroundImage: `url(https://image.tmdb.org/t/p/original${hero.backdrop_path})`,
            backgroundSize: "cover",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, black, transparent)",
            }}
          />

          <div style={{ position: "absolute", bottom: 20, left: 20 }}>
            <h1 style={{ color: "white", fontSize: 30 }}>
              {hero.title}
            </h1>
            <p style={{ color: "gray", maxWidth: 400 }}>
              {hero.overview}
            </p>
          </div>
        </div>
      )}

      {/* 🎞️ ROW */}
      <div style={{ padding: 20 }}>
        <Row
          title="Trending"
          movies={movies}
          onClick={(m: any) => setSelected(m)}
        />
      </div>

      {/* 🎥 PLAYER */}
      {selected && (
        <PlayerModal
          movie={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
