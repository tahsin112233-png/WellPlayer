"use client";

export default function MovieCard({ movie, onClick }: any) {
  return (
    <div
      onClick={() => onClick(movie)}
      style={{
        minWidth: 140,
        cursor: "pointer",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={movie.image}
        style={{
          width: "100%",
          borderRadius: 8,
        }}
      />
      <p style={{ color: "white", fontSize: 12 }}>{movie.title}</p>
    </div>
  );
}
