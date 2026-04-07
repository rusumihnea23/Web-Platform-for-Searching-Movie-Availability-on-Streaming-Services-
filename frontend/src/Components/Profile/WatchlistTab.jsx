import { useEffect, useState } from "react";
import { getUserWatchlist, unWatchlistMovie } from "../../Actions/UserMovieActions"; // Import here
import MovieList from "../MovieList/MovieList/MovieList";

export default function WatchlistTab() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getUserWatchlist();
      setMovies(data);
    };
    fetchMovies();
  }, []);

  // Handler to call the API and then update the local state
  const handleRemove = async (id) => {
    // Optional: add a confirm dialog
    if (window.confirm("Remove this movie from your watchlist?")) {
      try {
        await unWatchlistMovie(id);
        
        // Remove the movie from the local list so it disappears instantly
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
      } catch (err) {
        // Error is already handled/alerted inside unWatchlistMovie based on your code
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