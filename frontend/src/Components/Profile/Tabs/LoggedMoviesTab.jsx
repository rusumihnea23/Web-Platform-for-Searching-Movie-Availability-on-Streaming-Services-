import { useState, useEffect } from "react";
import { getUserLogsMovieList,getPublicUserLogs } from "../../../Actions/UserMovieActions";

import MovieList from "../../MovieList/MovieList/MovieList";

// When userId is provided → public read-only view of that user's logged movies.
// When userId is absent  → original behaviour (own profile, with live event sync).
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

    // Only listen for live updates on the owner's own profile
    if (!userId) {
      window.addEventListener("movieLogged", fetchMovies);
      return () => window.removeEventListener("movieLogged", fetchMovies);
    }
  }, [userId]);

  return <MovieList Movies={movies} />;
}
