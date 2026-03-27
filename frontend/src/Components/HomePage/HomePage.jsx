import { useState } from "react";
import MovieList from "../MovieList/MovieList/MovieList";

import { useEffect } from "react";
import {getPopularMovieList} from "../../Actions/MovieActions";
import { getUserDetails } from "../../Actions/UserActions";
import SearchBar from "../Search/SearchBar/SearchBar";


export default function HomePage() {
     const [loading, setLoading] = useState(true);
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
         setLoading(false);
    }, [])

   
if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
        </div>
    );
}

    
    return (

        <>
            <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 gap-6 h-screen mb-10">
                <h1 className="text-white">   Hello {UserDetails.firstName} , Here Are Some Popular Movies</h1>
               {loading ? null : (
    <>
        <MovieList Movies={movieList} max={5} />
        <div className="w-full max-w-sm min-w-[200px]">
            
            <SearchBar/>
        </div>
    </>
)}             

        <div><img src={UserDetails.profilePicturePath} alt="" /></div>
            </div>


        </>
    )
}