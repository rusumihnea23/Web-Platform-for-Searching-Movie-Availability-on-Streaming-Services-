import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteReview, editReview } from "../../Actions/ReviewActions"; 
import { deleteReview as adminDeleteReview } from "../../Actions/GeneralAdminDashboardActions"; 
import { TrashIcon,PencilSquareIcon} from '@heroicons/react/24/solid';

import LikeButton from "./LikeButton";
import ReviewContent from "./ReviewContent";

export default function ReviewItem({ review, onUpdate, showMovieTitle, isAdmin = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        // Use admin-specific delete if isAdmin is true
        if (isAdmin) {
          await adminDeleteReview(review.id);
        } else {
          await deleteReview(review.id);
        }
        onUpdate();
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
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
       <div className="flex flex-col gap-1">
  {/* Movie Title - Main Link */}
  <h3 
    onClick={() => navigate(`/movies/${review.movieId}/details`)} 
    className="text-blue-400 font-bold text-lg cursor-pointer hover:text-blue-300 transition-colors leading-tight"
  >
    {review.movieTitle}
  </h3>

  {/* Reviewer Name - Subtext */}
  <span className="text-slate-100 text-sm font-medium">
    by {review.userFirstName} {review.userLastName}
  </span>
</div>
            ) : (
              <span className="font-bold text-slate-100 text-lg">
                {review.userFirstName} {review.userLastName}
              </span>
            )}

            {/* HIDE GRADE IF ADMIN */}
            {!isAdmin && review.personalGrade != null && (
              <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                <span className="text-yellow-500 text-xs font-black">★</span>
                <span className="text-yellow-500 text-xs font-bold">
                  {review.personalGrade.toFixed(1)}/10
                </span>
              </div>
            )}
          </div>
          <span className="text-slate-500 text-[11px] uppercase tracking-widest font-medium">
            {new Date(review.createdAt).toLocaleDateString(undefined, { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* HIDE EDIT IF ADMIN */}
          {!isAdmin && review.owner && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="cursor-pointer text-slate-500 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-400/10 transition-all" 
              title="Edit Review"
            >
             <PencilSquareIcon className="w-5 h-5"/>
            </button>
          )}
          
          {/* DELETE BUTTON (Shown to owner OR admin) */}
          {(review.owner || isAdmin) && (
            <button 
              onClick={handleDelete} 
              className="cursor-pointer text-slate-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all" 
              title="Delete Review"
            >
             <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
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