"use client";

import MovieCard from "./MovieCard";

export default function Row({ title, movies, onClick }: any) {
  return (
    <div style={{ marginBottom: 30 }}>
      <h2 style={{ color: "white" }}>{title}</h2>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: 10,
          paddingBottom: 10,
        }}
      >
        {movies.map((m: any, i: number) => (
          <MovieCard key={i} movie={m} onClick={onClick} />
        ))}
      </div>
    </div>
  );
}
