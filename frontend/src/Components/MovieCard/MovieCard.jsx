import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../../Actions/MovieActions";
import { getReviewsByMovie } from "../../Actions/ReviewActions";

// Components
import Providers from "./Providers/Providers";
import ListActionMenu from "./ListActionsMenu";
import { LogModal } from "../LogModal/LogModal";
import CreditsSection from "./CreditsSection";
import WatchlistButton from "./WatchlistButton";
import ReviewForm from "../Reviews/ReviewForm";
import ReviewList from "../Reviews/ReviewList";
import SortControls from "../Sort/SortControls";

export default function MovieCard() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  
  // 1. Add Filter/Sort States
  const [sortBy, setSortBy] = useState("newest");
  const [grade, setGrade] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // 2. Separate Review Fetching
  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    const reviewData = await getReviewsByMovie(id, sortBy, grade);
    setReviews(reviewData || []);
    setReviewsLoading(false);
  }, [id, sortBy, grade]);

  const fetchMovieData = async () => {
    const movieData = await getMovieDetails(id);
    setMovie(movieData);
    await fetchReviews();
    setLoading(false);
  };

  // 3. Effect for Movie ID changes
  useEffect(() => {
    fetchMovieData();
  }, [id]);

  // 4. Effect specifically for Sort/Filter changes
  useEffect(() => {
    if (!loading) { // Don't run on initial mount as fetchMovieData handles it
      fetchReviews();
    }
  }, [sortBy, grade]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
      </div>
    );
  }

  if (!movie) return <div className="text-center mt-20 text-red-500">Movie not found.</div>;

  const director = movie?.crew?.find((member) => member.job === "Director");

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Left Column: Poster & Utilities */}
        <div className="w-full md:w-1/3 shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-2xl shadow-2xl border border-slate-700 w-full mb-5"
          />
          <div className="mb-6">
            <Providers movieTitle={movie.title} watchProviders={movie.watchProviderDTO} />
          </div>
          <ListActionMenu movieId={id} />
        </div>

        {/* Right Column: Info & Actions */}
        <div className="flex-1">
          <header className="mb-6">
            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 className="text-4xl md:text-6xl tracking-tighter font-bold">{movie.title}</h1>
              {director && (
                <h3 className="text-lg md:text-xl text-white/50">
                  Directed by <span className="text-white">{director.name}</span>
                </h3>
              )}
            </div>
            <h2 className="text-xl text-white/50 mt-2 tracking-tighter italic">
              {movie.original_language?.toUpperCase()}: "{movie.original_title}"
            </h2>
          </header>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-8 items-center">
            <span className="bg-slate-800 px-3 py-1 rounded-full text-pink-500 font-bold">
              {movie.release_date?.split("-")[0]}
            </span>
            <span>• {movie.runtime} min</span>
            <span>• {movie.genres?.join(", ")}</span>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            <WatchlistButton movie={movie} setMovie={setMovie} movieId={id} />
            <LogModal
              preSelectedMovieId={id}
              onLogSuccess={() => {
                setMovie(prev => ({ ...prev, logged: true }));
                fetchReviews(); // Refetch reviews to update grades/isOwnReview logic
              }}
            />
            {movie.logged && (
              <span className="flex items-center text-green-500 font-medium ml-2">
                ✓ Logged in your history
              </span>
            )}
          </div>
          
          <p className="text-lg leading-relaxed mb-10 text-slate-300 max-w-2xl border-l-4 border-pink-500 pl-6">
            {movie.overview}
          </p>
          <CreditsSection cast={movie.cast} crew={movie.crew} />
          
          <section className="mt-20 pt-10 border-t border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-3xl font-bold text-white">Reviews</h2>
                {/* 5. Add SortControls here */}
               
            </div>

            <ReviewForm
              movieId={id}
              onReviewAdded={fetchReviews} 
            />
 <SortControls 
                    sortBy={sortBy} 
                    setSortBy={setSortBy} 
                    grade={grade} 
                    setGrade={setGrade} 
                />
            <div className={`mt-8 transition-opacity duration-300 ${reviewsLoading ? 'opacity-50' : 'opacity-100'}`}>
              <ReviewList
                reviews={reviews}
                showMovieTitle={false}
                onReviewDeleted={fetchReviews}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}