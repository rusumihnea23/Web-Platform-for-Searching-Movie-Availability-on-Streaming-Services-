import api from "../Services/api";
const mainpath="/api/users"

const getUserDetails= async()=>{
    try {
    const res = await api.get(`${mainpath}/details`,);
    console.log(res.data)
    return res.data;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
}

}
const updateFirstName= async(Name)=>{
  try{
    const res = await api.patch(`${mainpath}/profile/firstName`,{Name});
    console.log(res.data)
  }catch(err){
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
}
const updateLastName= async(Name)=>{
  try{
    const res = await api.patch(`${mainpath}/profile/lastName`,{Name});
    console.log(res.data)
  }catch(err){
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
}
const getRecommendedMovieList =async () => {
  try {
    const res = await api.get(`${mainpath}/recommended`);
    return res.data;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};
export  {getUserDetails,updateFirstName,updateLastName,getRecommendedMovieList}