import { useState } from "react";
import MovieList from "../MovieList/MovieList/MovieList";
import SearchBar from "../Search/SearchBar/SearchBar";
import { useEffect } from "react";
import {getPopularMovieList} from "../../Actions/MovieActions";
import { getUserDetails } from "../../Actions/UserActions";


export default function HomePage() {
    const [movieList, setmovieList] = useState([]);
    const[UserDetails,setUserDetails]=useState("");
    useEffect(() => {
        const fetchDetails=async ()=>{
            const user=await getUserDetails();
            setUserDetails(user);
        }
        const fetchMovies = async () => {
            const movies = await getPopularMovieList();
            setmovieList(movies);
        };
        fetchMovies();
        fetchDetails();
    }, [])

    return (
        <>
            <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 gap-6 h-screen mb-10">
                <h1 className="text-white">   Hello {UserDetails.firstName} , Here Are Some Popular Movies</h1>
                <MovieList Movies={movieList} max={5}></MovieList>
                <div className="w-full max-w-sm min-w-[200px]">
                <SearchBar></SearchBar>

                 
                </div>
            </div>


        </>
    )
}