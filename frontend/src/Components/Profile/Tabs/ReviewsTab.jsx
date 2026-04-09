import { useEffect, useState } from "react";
import { getUserReviews } from "../../../Actions/ReviewActions";
import ReviewList from "../../Reviews/ReviewList";
import SortControls from "../../Sort/SortControls";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Add states for sorting and filtering
  const [sortBy, setSortBy] = useState("newest");
  const [grade, setGrade] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 2. Pass the parameters to your action
      const data = await getUserReviews(sortBy, grade); 
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching user reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Trigger fetch whenever sortBy or grade changes
  useEffect(() => { 
    fetchData(); 
  }, [sortBy, grade]); 

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold text-white mb-4">My Movie Reviews</h2>
      
      {/* 4. Add the controls at the top */}
      <SortControls 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
        grade={grade} 
        setGrade={setGrade} 
      />

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div>
        </div>
      ) : (
        <ReviewList 
          reviews={reviews} 
          showMovieTitle={true} 
          onReviewDeleted={fetchData} 
        />
      )}
    </div>
  );
}