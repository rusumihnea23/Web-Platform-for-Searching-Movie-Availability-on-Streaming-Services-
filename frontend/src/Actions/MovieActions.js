import api from "../Services/api";

const getPopularMovieList =async () => {
  try {
    const res = await api.get("/api/movies/popular");
    return res.data;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};

export default getPopularMovieList;