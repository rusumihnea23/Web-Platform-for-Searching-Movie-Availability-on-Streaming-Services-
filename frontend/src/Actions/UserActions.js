import api from "../Services/api";
const mainpath="/api/users"

const getUserDetails= async()=>{
    try {
    const res = await api.get(`${mainpath}/details`,);
    return res.data;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
}

}

export  {getUserDetails}