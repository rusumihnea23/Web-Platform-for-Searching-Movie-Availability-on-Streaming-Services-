import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "null" ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}
);

//sa dea log out cand nu ai autorizatie sau nu mai e valabil tokenul
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.warn("Token expired or unauthorized. Logging out...");
      
     localStorage.clear();
  window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
export default api;