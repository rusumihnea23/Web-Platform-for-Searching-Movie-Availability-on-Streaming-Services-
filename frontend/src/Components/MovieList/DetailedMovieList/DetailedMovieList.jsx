import Movie from "../Movie/Movie"

export default function DetailedMovieList({ Movies, max }) {

    return (
        <div className="flex flex-col items-center gap-6 px-6 w-full">
            {
                Movies.slice(0, max).map((movie) => {
                    return (
                        <div key={movie.id} className="flex gap-6 max-w-4xl w-full bg-white shadow-md rounded-lg p-4">
                            <div className="flex-shrink-0"> 
                                <Movie
                                    poster_path={movie.poster_path}
                                    title={movie.title}
                                />
                            </div>

                            <div className="flex flex-col justify-start overflow-hidden">
                                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{movie.title}</h2>
                                <p className="text-gray-600 line-clamp-4 md:line-clamp-6 text-ellipsis">
                                    {movie.overview} 
                                    {/* de reparat , cand am prea multe caractere iese de pe ecran */}
                                </p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}