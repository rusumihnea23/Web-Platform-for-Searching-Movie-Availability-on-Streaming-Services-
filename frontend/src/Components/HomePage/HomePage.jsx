import { useState } from "react";
import MovieList from "../MovieList/MovieList/MovieList";
import { useEffect } from "react";
import getPopularMovieList from "../../Actions/MovieActions";



export default function HomePage() {
    const [movieList, setmovieList] = useState([]);

    useEffect(() => {

        const fetchMovies = async () => {
            const movies = await getPopularMovieList();
            setmovieList(movies);
        };
        fetchMovies();
    }, [])

    return (
        <>
            <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 gap-6">
                <h1>Hello ... Here Are Some Popular Movies</h1>
                <MovieList Movies={movieList} max={5}></MovieList>
                <div className="w-full max-w-sm min-w-[200px]">


                    <div className="relative flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600">
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                        </svg>

                        <input
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="Search a movie"
                        />

                        <button
                            className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            type="button"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>


        </>
    )
}