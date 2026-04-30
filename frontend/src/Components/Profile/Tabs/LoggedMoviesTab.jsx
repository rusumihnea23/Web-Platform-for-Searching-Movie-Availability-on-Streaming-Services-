import { useState, useEffect } from "react";
import { getUserLogsMovieList,getPublicUserLogs } from "../../../Actions/UserMovieActions";

import MovieList from "../../MovieList/MovieList";
export default function LoggedMoviesTab({ userId }) {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const data = userId
      ? await getPublicUserLogs(userId)
      : await getUserLogsMovieList();
    setMovies(data || []);
  };

  useEffect(() => {
    fetchMovies();

    if (!userId) {
      window.addEventListener("movieLogged", fetchMovies);
      return () => window.removeEventListener("movieLogged", fetchMovies);
    }
  }, [userId]);

  return <MovieList Movies={movies} />;
}
