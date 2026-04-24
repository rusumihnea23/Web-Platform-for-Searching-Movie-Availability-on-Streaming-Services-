import React, { useState, useEffect, useCallback } from 'react';
import { getAllReviews } from '../../Actions/GeneralAdminDashboardActions';
import ReviewList from '../Reviews/ReviewList';
import SortControls from '../Sort/SortControls';

const OPTIONS = [{ value: "newest", label: "Newest First" }, { value: "oldest", label: "Oldest First" }, { value: "popular", label: "Most Popular" }];

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setReviews(await getAllReviews(sortBy));
    setLoading(false);
  }, [sortBy]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  return (
    <div className="bg-slate-950 p-8 rounded-2xl shadow-inner min-h-125 space-y-6">
      <SortControls sortBy={sortBy} setSortBy={setSortBy} options={OPTIONS} />
      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div></div>
      ) : (
        <ReviewList reviews={reviews.map(r => ({ ...r, owner: true }))} showMovieTitle onReviewDeleted={fetchReviews} isAdmin />
      )}
    </div>
  );
};
export default AdminReviewManagement;