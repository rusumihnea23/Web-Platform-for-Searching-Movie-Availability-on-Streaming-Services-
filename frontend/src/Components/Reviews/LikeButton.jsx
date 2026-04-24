import { useState, useEffect } from "react";
import { toggleReviewLike } from "../../Actions/ReviewActions";
import { HeartIcon } from "@heroicons/react/24/outline";
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
    <HeartIcon className="w-5 h-5"></HeartIcon>
      <span className="text-sm font-bold">{likeCount}</span>
    </button>
  );
}