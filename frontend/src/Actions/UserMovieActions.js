
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

const userLogMovie= async({movieId,personalGrade,watchDate})=>{
 try {
    const res = await api.post(`${mainpath}/add`, { movieId,personalGrade,watchDate});
    alert("movie logged succesfully");
  
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message); 
  }

}

export {getUserLogsMovieList,userLogMovie};