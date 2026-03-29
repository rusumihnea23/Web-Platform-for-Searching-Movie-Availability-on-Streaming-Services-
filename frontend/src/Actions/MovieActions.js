import api from "../Services/api";
const mainpath="/api/movies"
const watchlistpath="/api/watchlist"
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

    const combinedMovieData = {
      ...res.data,           // This "unpacks" title, id, overview, etc.
      watchlisted: res2.data // This adds the boolean from your second API call
    };
    //console.log(combinedMovieData)
    return combinedMovieData;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};


const watchlistMovie=async(id)=>{
  try{
    
const res = await api.patch(`${watchlistpath}/add/${id}`);
    
    alert("Watchlist successful!");
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

//de mutat astea cu watchlist in usermovieactions


export {getPopularMovieList,getQueryMovieList,getMovieDetails,watchlistMovie,unWatchlistMovie};
