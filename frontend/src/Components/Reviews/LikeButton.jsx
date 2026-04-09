import { useState, useEffect } from "react";
import { toggleReviewLike } from "../../Actions/ReviewActions";

export default function LikeButton({ review }) {

  const [isLiked, setIsLiked] = useState(review.likedByMe || false);
  const [likeCount, setLikeCount] = useState(review.likeCount || 0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setIsLiked(review.likedByMe);
    setLikeCount(review.likeCount || 0);
  }, [review.likedByMe, review.likeCount]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    const success = await toggleReviewLike(review.id);

    if (success) {

      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked(!isLiked);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
        isLiked 
          ? "bg-pink-500/20 border-pink-500 text-pink-500" 
          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-5 w-5 ${isLiked ? "fill-current" : "fill-none"}`} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="text-sm font-bold">{likeCount}</span>
    </button>
  );
}