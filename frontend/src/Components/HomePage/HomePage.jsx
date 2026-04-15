import { useState, useEffect } from "react";
import MovieList from "../MovieList/MovieList/MovieList";
import { getPopularMovieList } from "../../Actions/MovieActions";
import { getRecommendedMovieList, getUserDetails } from "../../Actions/UserActions";


export default function HomePage() {
    const [loading, setLoading] = useState(true);
    const [movieList, setmovieList] = useState([]);
    const [recomendedMovieList, setrecomendedMovieList] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
  
            const [user, popular] = await Promise.all([
                getUserDetails(),
                getPopularMovieList(),
            ]);

            setUserDetails(user);
            setmovieList(popular);
            try {
                const recommended = await getRecommendedMovieList();
                setrecomendedMovieList(recommended || []);
            } catch (recError) {
                console.warn("Recommender system is offline, skipping section.");
                setrecomendedMovieList([]); 
            }

        } catch (error) {
            console.error("Critical error fetching data:", error);
            
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
      </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20">
            {/* Hero Section / Welcome Area */}
            <div className="relative h-[40vh] flex items-center justify-center overflow-hidden  from-sky-900/20 to-slate-950">
                <div className="text-center z-10 px-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                        Hello, <span className="text-sky-400">{userDetails?.firstName || "Cinephile"}</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Ready for a movie night? Explore the latest trends and personalized picks just for you.
                    </p>
                </div>
            
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-16">
                
                {/* Recommended Section (Prioritizează AI-ul tău!) */}
                {recomendedMovieList.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-l-4 border-sky-500 pl-4">
                            <div>
                                <h2 className="text-2xl font-bold">Recommended for You</h2>
                                <p className="text-gray-400 text-sm">Based on your taste and activity</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl backdrop-blur-sm border border-white/5">
                            <MovieList Movies={recomendedMovieList}  />
                            
                        </div>
                    </section>
                )}

                {/* Popular Movies Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between border-l-4 border-slate-600 pl-4">
                        <div>
                            <h2 className="text-2xl font-bold">Trending Now</h2>
                            <p className="text-gray-400 text-sm">Most watched movies today</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl backdrop-blur-sm border border-white/5">
                        <MovieList Movies={movieList} max={5} />
                    </div>
                </section>

            </div>
        </div>
    );
}