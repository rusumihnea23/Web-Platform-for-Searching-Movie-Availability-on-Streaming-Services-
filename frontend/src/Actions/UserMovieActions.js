
import api from "../Services/api";
const mainpath="/api/log"
const getUserLogsMovieList =async () => {
  try {
    const res = await api.get(`${mainpath}/movies`);
    return res.data;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};


export {getUserLogsMovieList};