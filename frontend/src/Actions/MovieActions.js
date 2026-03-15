import api from "../Services/api";
const mainpath="/api/movies"
const getPopularMovieList =async () => {
  try {
    const res = await api.get(`${mainpath}/popular`);
    return res.data;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};


const getQueryMovieList =async (query) => {
  try {
    const res = await api.get(`${mainpath}/search`,{params:{
      query:String(query)
    }});
    console.log(res.data)
    return res.data;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};


export {getPopularMovieList,getQueryMovieList};