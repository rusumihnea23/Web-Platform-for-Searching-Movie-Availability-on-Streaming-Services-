import { useState, useEffect } from "react";
import {
  getUserLogsWithGrades,
  getPublicUserLogs,
  deleteWatchDate,
  deleteAllLogsForMovie,
} from "../../../Actions/UserMovieActions";
import MovieList from "../../MovieList/MovieList";

export default function LoggedMoviesTab({ userId }) {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const data = userId
      ? await getPublicUserLogs(userId)
      : await getUserLogsWithGrades();
    setMovies(data || []);
  };

  useEffect(() => {
    fetchMovies();
    if (!userId) {
      window.addEventListener("movieLogged", fetchMovies);
      return () => window.removeEventListener("movieLogged", fetchMovies);
    }
  }, [userId]);

  const handleDeleteDate = async (movieId, date) => {
    await deleteWatchDate(movieId, date);
    fetchMovies();
  };

  const handleDeleteAll = async (movieId) => {
    await deleteAllLogsForMovie(movieId);
    fetchMovies();
  };

  return (
    <MovieList
      Movies={movies}
      showLogs={!userId}
      onDeleteDate={handleDeleteDate}
      onDeleteAll={handleDeleteAll}
    />
  );
}