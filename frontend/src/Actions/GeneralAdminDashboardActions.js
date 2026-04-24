import api from "../Services/api";

const mainpath = "/api/admin/dashboard";


const buildQuery = (sortBy, grade) => {
  const params = new URLSearchParams();
  if (sortBy) params.append("sortBy", sortBy);
  if (grade) params.append("grade", grade);
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};// de mutat asta intr un utils

const getGeneralStats = async () => {
  try {
    const res = await api.get(`${mainpath}/general`);
    return res.data;
  } catch (err) {
    console.error("Error fetching general stats:", err);
    return {}; 
  }
};

const getLogsChart = async (days = 30) => {
  try {
    const res = await api.get(`${mainpath}/logs-chart?days=${days}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching logs chart:", err);
    return { chartData: [], average: 0 }; 
  }
};

const getReviewsChart = async (days = 30) => {
  try {
    const res = await api.get(`${mainpath}/reviews-chart?days=${days}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching reviews chart:", err);
    return { chartData: [], average: 0 };
  }
};

const getTopMovies = async (limit = 5) => {
  try {
    const res = await api.get(`${mainpath}/top-movies?limit=${limit}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching top movies:", err);
    return [];
  }
};

const deleteReview = async (reviewId) => {
  try {
   
    const res = await api.delete(`${mainpath}reviews/delete`, {
      data: reviewId, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  } catch (err) {
    console.error("Delete review error:", err);
    throw err; 
  }
};
const getAllReviews = async (sortBy) => {
  try {
    const query = buildQuery(sortBy);
    const res = await api.get(`${mainpath}/reviews${query}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching review list:", err);
    return [];
  }
};

const getAllUsers=async(query)=>{
try{
  const res = await api.get(`${mainpath}/users${query}`);
  return res.data;
}catch (err) {
    console.error("Error fetching review list:", err);
    return [];
  }
}
const deleteUser = async (userId) => {
  try {
   
    const res = await api.delete(`${mainpath}/users/delete`, {
      data: userId, 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  } catch (err) {
    console.error("Delete user error:", err);
    throw err; 
  }
};

export {
  getGeneralStats,
  getLogsChart,
  getReviewsChart,
  getTopMovies,
  deleteReview,
  getAllReviews,
  deleteUser,
  getAllUsers
};