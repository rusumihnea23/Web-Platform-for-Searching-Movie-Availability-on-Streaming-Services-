import { useEffect, useState } from "react";
import { getUserReviews, deleteReview } from "../../Actions/ReviewActions";
import { getUserLogsDetailed } from "../../Actions/UserMovieActions"; // Your updated action
import { useNavigate } from "react-router-dom";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch both datasets in parallel
      const [reviewData, logData] = await Promise.all([
        getUserReviews(),
        getUserLogsDetailed()
      ]);

      if (reviewData) {

        const mergedData = reviewData.map((review) => {

          const matchingLog = logData?.find(
            (log) => String(log.movieId) === String(review.movieId)
          );

          return {
            ...review,

            personalGrade: matchingLog ? matchingLog.personalGrade : null
          };
        });

        setReviews(mergedData);
      }
    } catch (err) {
      console.error("Error fetching review data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);

      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center p-10 bg-white/5 rounded-lg border border-dashed border-white/10">
          <p className="text-gray-400">You haven't written any reviews yet.</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-white/5 p-5 rounded-lg border border-white/10 transition-hover hover:bg-white/[0.07]">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 
                    onClick={() => navigate(`/movies/${review.movieId}/details`)} 
                    className="text-blue-400 font-bold text-lg cursor-pointer hover:underline"
                  >
                    {review.movieTitle}
                  </h3>
                  
                  {/* Personal Grade Badge */}
                  {review.personalGrade !== null && (
                    <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-0.5 rounded border border-yellow-500/20">
                      ★ {review.personalGrade}/10
                    </span>
                  )}
                </div>
                
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button 
                onClick={() => handleDelete(review.id)}
                className="text-gray-500 hover:text-red-500 transition-colors p-1"
                title="Delete review"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="mt-3 relative">

              <p className="text-gray-300 italic leading-relaxed pl-2">
                {review.content}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}