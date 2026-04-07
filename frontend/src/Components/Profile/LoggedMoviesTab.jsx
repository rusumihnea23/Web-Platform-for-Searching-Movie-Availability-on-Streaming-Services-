import { useEffect, useState } from "react";

import { getUserLogsMovieList } from "../../Actions/UserMovieActions";

import MovieList from "../MovieList/MovieList/MovieList";
export default function LoggedMoviesTab() {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const data = await getUserLogsMovieList();
    setMovies(data);
  };

  useEffect(() => {
    fetchMovies();

    window.addEventListener("movieLogged", fetchMovies);
    return () => window.removeEventListener("movieLogged", fetchMovies);
  }, []);

  return <MovieList Movies={movies} />;
}