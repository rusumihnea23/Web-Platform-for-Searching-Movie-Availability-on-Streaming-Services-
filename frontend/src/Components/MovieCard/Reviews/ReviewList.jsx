import { useState } from "react";
import { deleteReview } from "../../../Actions/ReviewActions";

export default function ReviewList({ reviews, onReviewDeleted }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Pagination Logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this review?")) {
      await deleteReview(id);
      onReviewDeleted();
    }
  };

  if (reviews.length === 0) return <p className="text-slate-500 italic">No reviews yet. Be the first!</p>;

  return (
    <div className="space-y-6">
      {currentReviews.map((review) => (
        <div key={review.id} className="border-b border-slate-800 pb-6 group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">{review.userLastName +" " +  review.userFirstName || "User"}</span>
             
              <span className="text-slate-500 text-xs">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {/* Logic: Backend should return 'isOwner' or you check username against local user */}
            {review.isOwner && (
              <button 
                onClick={() => handleDelete(review.id)}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:underline"
              >
                Delete
              </button>
            )}
          </div>
          <p className="text-slate-300 leading-relaxed">{review.content}</p>
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-pink-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}