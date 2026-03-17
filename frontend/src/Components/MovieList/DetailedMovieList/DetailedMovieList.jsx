import Movie from "../Movie/Movie"
import { useNavigate } from "react-router-dom"

export default function DetailedMovieList({ Movies, max }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center gap-6 px-4 py-8 w-full">
            {Movies.slice(0, max).map((movie) => {
                return (
                    // Poster-ul
                    <div key={movie.id} className="flex flex-row gap-4 md:gap-8 max-w-4xl w-full bg-slate-800 border border-slate-700  overflow-hidden shadow-lg hover:bg-slate-750 transition-colors cursor-pointer group">
                        <Movie

                            poster_path={movie.poster_path}
                            title={movie.title}
                            id={movie.id}
                        />
                        {/* //Overview+ anul */}
                        <div className="flex flex-col justify-center p-4 pr-6 overflow-hidden flex-1">
                            <h2 onClick={() => navigate(`/movies/${movie.id}/details`)} className="text-sm md:text-xl font-bold text-white mb-2 group-hover:text-pink-500 transition-colors truncate">
                                {movie.title}
                            </h2>
                            {/*Anul  */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                                    {movie.release_date?.split('-')[0]}
                                </span>
                            </div>
                            <p className="hidden md:block text-slate-400 text-sm md:text-base leading-relaxed line-clamp-3 lg:line-clamp-4">
                                {movie.overview}
                            </p>


                        </div>
                    </div>
                )
            })}
        </div>
    )
}