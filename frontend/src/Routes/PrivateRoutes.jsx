import { Navigate, Outlet } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");

  if (!token || token === "null") return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // ca e m,asurat in secunde

    //daca decoded time e mai mic decat timpul de acum inseamna ca e expirat
    if (decoded.exp < currentTime) {
      console.warn("Token expired. Clearing storage.");
      localStorage.clear();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token format");
    localStorage.clear();
    return false;
  }
};

const PrivateRoutes = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (

    <Outlet />

  );
};

export default PrivateRoutes;