import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteReview, editReview } from "../../Actions/ReviewActions";
import LikeButton from "./LikeButton";
import ReviewContent from "./ReviewContent";

export default function ReviewItem({ review, onUpdate, showMovieTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Delete this review?")) {
      await deleteReview(review.id);
      onUpdate(); 
    }
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;
    const success = await editReview(review.id, editContent);
    if (success) {
      setIsEditing(false);
      onUpdate();
    }
  };

  return (
    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 group hover:border-slate-700 transition-all min-w-0 overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            {showMovieTitle ? (
              <h3 onClick={() => navigate(`/movies/${review.movieId}/details`)} className="text-blue-400 font-bold text-lg cursor-pointer hover:text-blue-300 transition-colors">
                {review.movieTitle}
              </h3>
            ) : (
              <span className="font-bold text-slate-100 text-lg">{review.userFirstName} {review.userLastName}</span>
            )}
            {review.personalGrade != null && (
              <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                <span className="text-yellow-500 text-xs font-black">★</span>
                <span className="text-yellow-500 text-xs font-bold">{review.personalGrade.toFixed(1)}/10</span>
              </div>
            )}
          </div>
          <span className="text-slate-500 text-[11px] uppercase tracking-widest font-medium">
            {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* 1. CHECK: Does your review object have an 'owner' property? */}
        {review.owner && (
          <div className="flex gap-2">
            {/* Edit Button */}
            <button 
              onClick={() => setIsEditing(true)} 
              className="cursor-pointer text-slate-500 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-400/10 transition-all" 
              title="Edit Review"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            {/* Delete Button */}
            <button 
              onClick={handleDelete} 
              className="cursor-pointer text-slate-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all" 
              title="Delete Review"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-slate-800 border border-pink-500/50 rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-pink-500 min-h-[80px]"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsEditing(false)} className="text-xs text-slate-400 hover:text-white px-3 py-1">Cancel</button>
              <button onClick={handleSave} className="text-xs bg-pink-600 text-white px-3 py-1 rounded-md hover:bg-pink-500">Save Changes</button>
            </div>
          </div>
        ) : (
          <>
            <ReviewContent content={review.content} limit={350} />
            <div className="flex items-center justify-start mt-4">
              <LikeButton review={review} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}