import api from "../Services/api";
const mainpath="/api/movies"
const watchlistpath="/api/watchlist"
const logpath="/api/log";

const buildQuery = (sortBy, grade) => {
  const params = new URLSearchParams();
  if (sortBy) params.append("sortBy", sortBy);
  if (grade) params.append("grade", grade);
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};// de mutat asta intr un utils


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
    

    return combinedMovieData;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};
const getAllMovies = async (sortBy, grade) => {
  try {
    const queryString = buildQuery(sortBy, grade);
    const res = await api.get(`${mainpath}/movies${queryString}`);
    
    // Check if the data is a string and parse it manually if necessary
    const parsedData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  
    return parsedData;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};

const getRecommandation=async(id)=>{
try {
    const res = await api.get(`${mainpath}/${id}/recommendations`,);
   
    return res;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};
//de mutat astea cu watchlist in usermovieactions


export {getPopularMovieList,getQueryMovieList,getMovieDetails,getAllMovies,getRecommandation};
