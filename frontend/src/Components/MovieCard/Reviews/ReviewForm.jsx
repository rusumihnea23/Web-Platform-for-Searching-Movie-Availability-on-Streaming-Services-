import { useState } from "react";
import { addReview } from "../../../Actions/ReviewActions";

export default function ReviewForm({ movieId, onReviewAdded }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    // Matches your backend ReviewRequest DTO
    const success = await addReview({ movieId, content, rating });
    
    if (success) {
      setContent("");
      setRating(10);
      onReviewAdded(); // Refresh the list
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-10">
      <h3 className="text-xl font-bold mb-4 text-pink-500">Add a Review</h3>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
    
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you think of the movie?"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none min-h-[100px]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-pink-600 hover:bg-pink-500 disabled:bg-slate-700 text-white font-bold py-2 px-6 rounded-full self-end transition-colors"
        >
          {submitting ? "Posting..." : "Post Review"}
        </button>
      </div>
    </form>
  );
}