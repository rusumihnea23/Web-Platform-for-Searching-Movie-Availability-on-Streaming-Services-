import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 1. Added useNavigate
import { getMovieDetails,watchlistMovie,unWatchlistMovie } from "../../Actions/MovieActions";
import Providers from "./Providers/Providers";
export default function MovieCard() {
    const { id } = useParams();
   
    const [movie, setMovie] = useState(null);
    const [activeTab, setActiveTab] = useState("cast");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getMovieDetails(id).then((data) => {
            setMovie(data);
            setLoading(false);
        });
    }, [id]);

    const director = movie?.crew?.find(member => member.job === "Director");

    if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
        </div>
    );
}

if (!movie) {
    return <div className="text-center mt-20 text-red-500">Movie not found.</div>;
}
const handleWatchlistToggle = async () => {
    try {
        // Determine which action to call based on current state
        if (movie.watchlisted) {
            await unWatchlistMovie(id);
        } else {
            await watchlistMovie(id);
        }

        // Update local state to flip the UI
        setMovie(prevMovie => ({
            ...prevMovie,
            watchlisted: !prevMovie.watchlisted
        }));
        
    } catch (err) {
        console.error("Failed to update watchlist:", err);
        const errorMessage = err.response?.data?.message || "You must be logged in to manage your watchlist.";
        alert(errorMessage);
    }
};
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 relative">
            
    
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
                {/* Left: Poster */}
                <div className="w-full md:w-1/3 shrink-0 ">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="rounded-2xl shadow-2xl border border-slate-700 w-full mb-5"
                    />
                    <div className="ml-6">
                    <Providers watchProviders={movie.watchProviderDTO}></Providers>
                    </div>
                    
                </div>
                {/* Right: Info */}
                <div className="flex-1">
                    <div className="flex items-baseline gap-4 flex-wrap">
                        <h1 className="text-4xl md:text-6xl mb-4 tracking-tighter font-bold">
                            {movie.title}
                        </h1>
                        {/* Fixed: Added a check for director */}
                        {director && (
                            <h3 className="text-lg md:text-xl text-white/50 mb-4">
                                Directed by <span className="text-white">{director.name}</span>
                            </h3>
                        )}
                    </div>

                    <h2 className="text-xl text-white/50 mb-4 tracking-tighter">
                        {movie.original_language?.toUpperCase()}: "{movie.original_title}"
                    </h2>

                    <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-6 items-center">
                        <span className="bg-slate-800 px-3 py-1 rounded-full text-pink-500">
                            {movie.release_date?.split('-')[0]}
                        </span>
                        <span>•</span>
                        <span>{movie.runtime} min</span>
                        <span>•</span>
                        <span className="italic">{movie.genres?.join(", ")}</span>
                        <button
                            onClick={handleWatchlistToggle}
                            className={`mb-6 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 shadow-lg ${movie.watchlisted
                                    ? "bg-pink-600 text-white shadow-pink-500/20"
                                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:border-slate-500"
                                }`}
                        >
                            {movie.watchlisted ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>In Watchlist</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Add to Watchlist</span>
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-lg leading-relaxed mb-10 text-slate-300 max-w-2xl">
                        {movie.overview}
                    </p>

                    {/* Toggle Buttons */}
                    <div className="flex gap-4 mb-6 border-b border-slate-800 pb-4">
                        <button
                            onClick={() => setActiveTab("cast")}
                            className={`px-6 py-2 rounded-full transition-all ${activeTab === 'cast' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                        >
                            Cast
                        </button>
                        <button
                            onClick={() => setActiveTab("crew")}
                            className={`px-6 py-2 rounded-full transition-all ${activeTab === 'crew' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                        >
                            Crew
                        </button>
                    </div>

                    {/* Bubbles Container */}
                    <div className="flex flex-wrap gap-3">
                        {(activeTab === "cast" ? movie.cast : movie.crew)?.map((person, index) => (
                            <div key={index} className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-full hover:scale-105 transition-transform">
                                <span className="text-sm font-medium">{person.name}</span>
                                <span className="text-xs text-pink-500 ml-2 opacity-80">
                                    {activeTab === "cast" ? person.character : person.job}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}