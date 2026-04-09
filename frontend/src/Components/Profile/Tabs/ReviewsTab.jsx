import { useEffect, useState } from "react";
import { getUserReviews } from "../../../Actions/ReviewActions";
import ReviewList from "../../Reviews/ReviewList";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUserReviews(); 
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching user reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ReviewList 
      reviews={reviews} 
      showMovieTitle={true} 
      onReviewDeleted={fetchData} 
    />
  );
}