import api from "../Services/api";

const mainpath = "/api/admin/dashboard";

const getGeneralStats = async () => {
  try {
    const res = await api.get(`${mainpath}/general`);
    return res.data;
  } catch (err) {
    console.error("Error fetching general stats:", err);
    // Returning an empty object as a fallback so the UI doesn't crash
    return {}; 
  }
};

const getLogsChart = async (days = 30) => {
  try {
    const res = await api.get(`${mainpath}/logs-chart?days=${days}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching logs chart:", err);
    // Returning the expected DTO structure on failure
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

export {
  getGeneralStats,
  getLogsChart,
  getReviewsChart,
  getTopMovies,
};