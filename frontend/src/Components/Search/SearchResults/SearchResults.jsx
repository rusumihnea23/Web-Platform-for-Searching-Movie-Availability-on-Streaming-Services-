import { useState, useEffect } from "react";
import { getQueryMovieList } from "../../../Actions/MovieActions";
import { useSearchParams, useNavigate } from "react-router-dom";
import DetailedMovieList from "../../MovieList/DetailedMovieList/DetailedMovieList";

export default function SearchResult() {
    const [movieList, setmovieList] = useState([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("query");

    useEffect(() => {

        const fetchMovies = async () => {
            const movies = await getQueryMovieList(query);
            setmovieList(movies);
        };
        if (query) {
            fetchMovies();
        }
    }, [query])

    return (

        <div className="flex flex-col items-center gap-2 my-2">
            
            <h1>
                <span className="text-white"> All results for</span>
                <span className="text-pink-600"> "{query}"</span>
            </h1>
            <DetailedMovieList Movies={movieList}></DetailedMovieList>
            <div className="w-full max-w-sm min-w-50">

            </div>
            <button
                onClick={() => { navigate("/") }}
                className=" cursor-pointer rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            >
                Go back home
            </button>
        </div>


    )
}