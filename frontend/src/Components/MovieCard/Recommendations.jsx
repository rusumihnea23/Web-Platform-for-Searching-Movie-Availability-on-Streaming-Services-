import { useEffect, useState } from "react";
import { getRecommandation } from "../../Actions/MovieActions";
import MovieList from "../MovieList/MovieList/MovieList";

export default function Recommendations({ movieId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      const res = await getRecommandation(movieId);
      if (res && res.data) {
        setRecommendations(res.data);
      }
      setLoading(false);
    };

    if (movieId) fetchRecs();
  }, [movieId]);

  if (loading) return <div className="py-10 text-center animate-pulse text-slate-400">Loading...</div>;
  if (recommendations.length === 0) return null;

  return (
    <section className="mt-12 pt-10 border-t border-slate-800">
      <h2 className="text-3xl font-bold text-white mb-8">We also suggest</h2>
      
      <div className="w-full overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-pink-500
        [&>div]:flex-nowrap 
        [&>div]:justify-start 
        [&>div]:gap-4
        [&>div>div]:shrink-0 
        [&>div>div]:snap-start
        [&>div>div]:w-[calc(100%-1rem)] 
        md:[&>div>div]:w-[calc(50%-1rem)] 
        lg:[&>div>div]:w-[calc(33.333%-1rem)]"
      >
        <MovieList Movies={recommendations} />
      </div>
    </section>
  );
}