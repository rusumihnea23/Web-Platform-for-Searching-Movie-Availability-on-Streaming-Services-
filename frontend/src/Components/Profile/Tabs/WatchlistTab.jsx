import { useEffect, useState } from "react";
import { getUserWatchlist, unWatchlistMovie ,getPublicUserWatchlist} from "../../../Actions/UserMovieActions";

import MovieList from "../../MovieList/MovieList/MovieList";

// userId present → public read-only (no remove button).
// userId absent  → own profile with full remove functionality.
export default function WatchlistTab({ userId }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = userId
        ? await getPublicUserWatchlist(userId)
        : await getUserWatchlist();
      setMovies(data || []);
    };
    fetchMovies();
  }, [userId]);

  const handleRemove = async (id) => {
    if (window.confirm("Remove this movie from your watchlist?")) {
      try {
        await unWatchlistMovie(id);
        setMovies((prev) => prev.filter((movie) => movie.id !== id));
      } catch (err) {
        console.error("Failed to remove movie:", err);
      }
    }
  };

  return (
    <div className="w-full">
      <MovieList
        Movies={movies}
        // Only expose delete controls on the owner's own profile
        showDelete={!userId}
        onDelete={!userId ? handleRemove : undefined}
      />
    </div>
  );
}
