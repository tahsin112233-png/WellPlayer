import { useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("/api/movies")
      .then(res => res.json())
      .then(data => {
        console.log("Movies:", data);
        setMovies(data);
      });
  }, []);

  return (
    <div>
      <h1>WellStreamer</h1>

      {movies.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {movies.map((m, i) => (
            <div key={i}>
              <img src={m.image} width="200" />
              <p>{m.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
