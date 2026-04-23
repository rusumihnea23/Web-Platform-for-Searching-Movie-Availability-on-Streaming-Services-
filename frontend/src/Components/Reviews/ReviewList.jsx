import { useState } from "react";
import ReviewItem from "./ReviewItem";
import Pagination from "./Pagination";

export default function ReviewList({ reviews, onReviewDeleted, showMovieTitle = false, isAdmin = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center p-10 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
        <p className="text-slate-500 italic">No reviews found.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {currentReviews.map((review) => (
        <ReviewItem 
          key={review.id} 
          review={review} 
          showMovieTitle={showMovieTitle}
          onUpdate={() => onReviewDeleted()} 
          isAdmin={isAdmin}
        />
      ))}

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
}