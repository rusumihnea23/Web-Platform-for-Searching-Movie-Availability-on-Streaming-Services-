
import api from "../Services/api";
const mainpath="/api/log"
const watchlistpath="/api/watchlist"
const getUserLogsMovieList =async () => {
  try {
    const res = await api.get(`${mainpath}/movies`);
    return res.data;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};

const userLogMovie= async({movieId,personalGrade,watchDate})=>{
 try {
    const res = await api.post(`${mainpath}/add`, { movieId,personalGrade,watchDate});
    
  
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message); 
  }

}

const getUserWatchlist=async()=>{
  try{
    
const res = await api.get(`${watchlistpath}`);
    
    return res.data
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};
const watchlistMovie=async(id)=>{
  try{
    
const res = await api.patch(`${watchlistpath}/add/${id}`);
    
  
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};
const unWatchlistMovie=async(id)=>{
  try{
    
const res = await api.patch(`${watchlistpath}/remove/${id}`);
    
    alert("unWatchlisted successfully!");
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};
const getUserLogsDetailed = async () => {
  try {
    const res = await api.get(`${mainpath}/details`);
    return res.data; // This now contains personalGrade!
  } catch (err) {
    console.error("Failed to fetch detailed logs:", err);
    return [];
  }
};

const getPublicUserLogs = async (userId) => {
  try {
    const res = await api.get(`${mainpath}/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getPublicUserWatchlist = async (userId) => {
  try {
    const res = await api.get(`${watchlistpath}/user/${userId}/watchlist`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export {getUserLogsMovieList,userLogMovie,getUserWatchlist,watchlistMovie,unWatchlistMovie,getUserLogsDetailed,getPublicUserLogs,getPublicUserWatchlist};