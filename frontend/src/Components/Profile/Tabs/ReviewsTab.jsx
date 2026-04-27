import { useEffect, useState } from "react";
import { getUserReviews,getPublicUserReviews } from "../../../Actions/ReviewActions";

import ReviewList from "../../Reviews/ReviewList";
import SortControls from "../../Sort/SortControls";

// userId present → public read-only view (sort/filter work, no delete).
// userId absent  → own profile with delete callback.
export default function ReviewsTab({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [grade, setGrade] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = userId
        ? await getPublicUserReviews(userId, sortBy, grade)
        : await getUserReviews(sortBy, grade);
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, sortBy, grade]);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-white mb-4">
        {userId ? "Movie Reviews" : "My Movie Reviews"}
      </h2>

      <SortControls
        sortBy={sortBy}
        setSortBy={setSortBy}
        grade={grade}
        setGrade={setGrade}
      />

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500" />
        </div>
      ) : (
        <ReviewList
          reviews={reviews}
          showMovieTitle={true}
          // Only pass delete callback on own profile
          onReviewDeleted={!userId ? fetchData : undefined}
        />
      )}
    </div>
  );
}
