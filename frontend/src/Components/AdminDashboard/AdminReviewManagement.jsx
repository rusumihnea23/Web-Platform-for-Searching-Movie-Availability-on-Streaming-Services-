import React, { useState, useEffect, useCallback } from 'react';
import { getAllReviews } from '../../Actions/GeneralAdminDashboardActions';
import ReviewList from '../Reviews/ReviewList';
import SortControls from '../Sort/SortControls';

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);

  // Define the specific options for Admin
  const adminSortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
  ];

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const data = await getAllReviews(sortBy);
    setReviews(data);
    setLoading(false);
  }, [sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="space-y-6">
    
       
      <div className="bg-slate-950 p-8 rounded-2xl shadow-inner min-h-[500px]">
           <SortControls 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
          options={adminSortOptions} 
          // We DON'T pass setGrade here, so the grade filter will be hidden
        />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
          </div>
        ) : (
          <ReviewList 
            reviews={reviews.map(r => ({ ...r, owner: true }))} 
            showMovieTitle={true}
            onReviewDeleted={fetchReviews} 
            isAdmin={true}
          />
        )}
      </div>
    </div>
  );
};

export default AdminReviewManagement;