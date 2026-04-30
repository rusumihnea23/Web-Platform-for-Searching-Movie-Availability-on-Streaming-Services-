import Movie from "./Movie";
export default function MovieList({ Movies, max, showDelete, onDelete }) {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-center w-full">
      {Movies.slice(0, max || Movies.length).map((movie) => {
        return (
          <Movie
            key={movie.id}
            poster_path={movie.poster_path}
            title={movie.title}
            id={movie.id}
            showDelete={showDelete}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}