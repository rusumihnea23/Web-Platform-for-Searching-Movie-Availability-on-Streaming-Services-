import { useEffect, useState } from "react";
import { getUserWatchlist } from "../../Actions/UserMovieActions";
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

  return <MovieList Movies={movies} />;

}