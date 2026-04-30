import React, { useState, useEffect } from 'react';
import { getQueryMovieList } from '../../Actions/MovieActions';
import Movie from '../MovieList/Movie';

const MovieChatBubble = ({ titles }) => {
  const [resolvedMovies, setResolvedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resolveMovies = async () => {
      if (!titles || titles.length === 0) return;
      
      setLoading(true);
      try {
        const results = await Promise.all(
          titles.map(async (title) => {
            const res = await getQueryMovieList(title);
            // Return the first match from the search results
            return res && res.length > 0 ? res[0] : null;
          })
        );
        setResolvedMovies(results.filter(m => m !== null));
      } catch (err) {
        console.error("Failed to resolve movie titles:", err);
      } finally {
        setLoading(false);
      }
    };

    resolveMovies();
  }, [titles]);

  if (loading) {
    return <div className="text-[10px] text-gray-400 animate-pulse mt-2 italic">Searching for movie details...</div>;
  }

  if (resolvedMovies.length === 0) return null;

  return (
    <div className="mt-2 flex gap-2 overflow-x-auto pb-2 w-full scrollbar-hide">
      {resolvedMovies.map((movie) => (
        <div key={movie.id} className="scale-75 origin-top-left -mr-8 -mb-10">
          <Movie 
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
            showDelete={false} 
          />
        </div>
      ))}
    </div>
  );
};

export default MovieChatBubble;