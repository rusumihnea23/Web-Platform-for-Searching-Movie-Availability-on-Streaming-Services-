import { useEffect, useState } from "react";
import { getUserWatchlist,unWatchlistMovie } from "../../../Actions/UserMovieActions";
import MovieList from "../../MovieList/MovieList/MovieList";

export default function WatchlistTab() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getUserWatchlist();
      setMovies(data);
    };
    fetchMovies();
  }, []);

  const handleRemove = async (id) => {
    if (window.confirm("Remove this movie from your watchlist?")) {
      try {
        await unWatchlistMovie(id);
        
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
      } catch (err) {
        console.error("Failed to remove movie:", err);
      }
    }
  };

  return (
    <div className="w-full">
      <MovieList 
        Movies={movies} 
        showDelete={true} 
        onDelete={handleRemove} 
      />
    </div>
  );
}