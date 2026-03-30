import api from "../Services/api";
const mainpath="/api/movies"
const watchlistpath="/api/watchlist"
const logpath="/api/log";

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

const getMovieDetails=async(id)=>{
try {
    const res = await api.get(`${mainpath}/${id}/details`,);
    const res2=await api.get(`${watchlistpath}/${id}`)
    const res3=await api.get(`${logpath}/${id}`)
    const combinedMovieData = {
      ...res.data,          
      watchlisted: res2.data,
      logged: res3.data 
    };
    //console.log(combinedMovieData)
    return combinedMovieData;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};




export {getPopularMovieList,getQueryMovieList,getMovieDetails};
