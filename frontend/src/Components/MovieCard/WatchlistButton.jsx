import { watchlistMovie, unWatchlistMovie } from "../../Actions/UserMovieActions";

export default function WatchlistButton({ movie, setMovie, movieId }) {
  const handleToggle = async () => {
    try {
      movie.watchlisted ? await unWatchlistMovie(movieId) : await watchlistMovie(movieId);
      setMovie(prev => ({ ...prev, watchlisted: !prev.watchlisted }));
    } catch (err) {
      alert(err.response?.data?.message || "Login required to manage watchlist.");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg " ${
        movie.watchlisted ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer" : "bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer hover:bg-slate-800"
      }`}
    >
      {movie.watchlisted ? "✓ In Watchlist" : "+ Add to Watchlist"}
    </button>
  );
}