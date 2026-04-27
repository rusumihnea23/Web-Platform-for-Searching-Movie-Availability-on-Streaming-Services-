import api from "../Services/api";
const login = async (email, password) => {
  try {
    const res = await api.post("/api/auth/authenticate", { email, password });
    localStorage.setItem("token", res.data.token);
    alert("Login successful!");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message); // sa nu uit sa schimba asta ca sa nu am tooata ziua alerte 
  }
};


const register = async (firstName,lastName,username,email, password) => {
  try {
    const res = await api.post("/api/auth/register", { firstName,lastName,username,email, password });
    localStorage.setItem("token", res.data.token);
    alert("Register successful!");
    return true
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message); // sa nu uit sa schimba asta ca sa nu am tooata ziua alerte 
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


