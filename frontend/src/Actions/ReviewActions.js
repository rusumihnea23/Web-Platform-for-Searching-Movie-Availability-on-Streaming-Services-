import api from "../Services/api";

const mainpath = "/api/reviews";


const addReview = async (reviewData) => {
  try {
    // reviewData should match your ReviewRequest DTO
    const res = await api.post(`${mainpath}/add`, reviewData);
    alert("Review added successfully!");
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const getReviewsByMovie = async (movieId) => {
  try {
    const res = await api.get(`${mainpath}/movie/${movieId}`);
    console.log(res.data)
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const getUserReviews = async () => {
  try {
    const res = await api.get(`${mainpath}/user`);
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const getAllReviews = async () => {
  try {
    const res = await api.get(`${mainpath}/all`);
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const deleteReview = async (reviewId) => {
  try {
    const res = await api.delete(`${mainpath}/delete/${reviewId}`);
    alert("Review deleted successfully");
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};

export {
  addReview,
  getReviewsByMovie,
  getUserReviews,
  getAllReviews,
  deleteReview
};