import Movie from "./Movie";

export default function MovieList({ Movies, max, showDelete, onDelete, showLogs, onDeleteDate, onDeleteAll }) {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-center w-full">
      {Movies.slice(0, max || Movies.length).map((movie) => {
        const id = movie.id ?? movie.movieId;
        const posterPath = movie.poster_path ?? movie.posterPath;
        return (
          <Movie
            key={id}
            poster_path={posterPath}
            title={movie.title}
            id={id}
            showDelete={showDelete}
            onDelete={onDelete}
            watchDates={movie.watchDates}
            showLogs={showLogs}
            onDeleteDate={onDeleteDate}
            onDeleteAll={onDeleteAll}
          />
        );
      })}
    </div>
  );
}