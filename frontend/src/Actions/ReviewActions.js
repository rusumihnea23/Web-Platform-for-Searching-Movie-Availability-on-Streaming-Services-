import api from "../Services/api";

const mainpath = "/api/reviews";

// Helper to build query strings efficiently
const buildQuery = (sortBy, grade) => {
  const params = new URLSearchParams();
  if (sortBy) params.append("sortBy", sortBy);
  if (grade) params.append("grade", grade);
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};// de mutat asta intr un utils

const addReview = async (reviewData) => {
  try {
    const res = await api.post(`${mainpath}/add`, reviewData);
    alert("Review added successfully!");
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const getReviewsByMovie = async (movieId, sortBy = "newest", grade = null) => {
  try {
    const query = buildQuery(sortBy, grade);
    const res = await api.get(`${mainpath}/movie/${movieId}${query}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getUserReviews = async (sortBy = "newest", grade = null) => {
  try {
    const query = buildQuery(sortBy, grade);
    const res = await api.get(`${mainpath}/user${query}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getAllReviews = async () => {
  try {
    const res = await api.get(`${mainpath}/all`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const deleteReview = async (reviewId) => {
  try {
    const res = await api.delete(`${mainpath}/delete/${reviewId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};

const editReview = async (reviewId, content) => {
  try {
    const res = await api.patch(`${mainpath}/edit/${reviewId}`, { content });
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};

const toggleReviewLike = async (reviewId) => {
  try {
    const response = await api.post(`${mainpath}/${reviewId}/like`);
    return response.status === 200;
  } catch (error) {
    console.error("Error toggling like:", error);
    return false;
  }
};
const getPublicUserReviews = async (userId, sortBy = "newest", grade = null) => {
  try {
    const query = buildQuery(sortBy, grade);
    const res = await api.get(`${mainpath}/user/${userId}/reviews${query}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
export {
  addReview,
  getReviewsByMovie,
  getUserReviews,
  getAllReviews,
  deleteReview,
  editReview,
  toggleReviewLike,
  getPublicUserReviews
};