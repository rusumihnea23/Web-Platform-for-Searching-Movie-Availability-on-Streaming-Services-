import api from "../Services/api";
const login = async (email, password) => {
  try {
    const res = await api.post("/api/auth/authenticate", { email, password });
    localStorage.setItem("token", res.data.token);
    alert("Login successful!");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const register = async (firstName,lastName,email, password) => {
  try {
    const res = await api.post("/api/auth/register", { firstName,lastName,email, password });
    localStorage.setItem("token", res.data.token);
    alert("Register successful!");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};

const logout=async()=>{
 try{
  localStorage.clear();
  window.location.href='/'
 }
 catch{err} {alert(err.response?.data?.message || err.message);}
}

export  {login,register,logout}


