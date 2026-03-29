import { useEffect, useState } from "react";
import { getUserLogsMovieList } from "../../Actions/UserMovieActions";
import MovieList from "../MovieList/MovieList/MovieList";

export default function LoggedMoviesTab() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getUserLogsMovieList();
      setMovies(data);
    };
    fetchMovies();
  }, []);

  return <MovieList Movies={movies} />;
}