import { useEffect, useState } from "react";
import { getUserReviews, deleteReview } from "../../Actions/ReviewActions";
import {  useNavigate } from "react-router-dom";
export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);
  const navigate=useNavigate();
  const fetchReviews = async () => {
    const data = await getUserReviews();
    if (data) setReviews(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  if (loading) return <div className="text-white">Loading reviews...</div>;

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p className="text-gray-400">You haven't written any reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <h3 onClick={() => navigate(`/movies/${review.movieId}/details`)} className="text-blue-400 font-bold">{review.movieTitle}</h3>
                
              </div>
              <button 
                onClick={() => handleDelete(review.id)}
                className="text-red-500 text-xs hover:underline"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-300 mt-2 italic">"{review.content}"</p>
            <p className="text-gray-500 text-xs mt-2">
              Posted on {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}