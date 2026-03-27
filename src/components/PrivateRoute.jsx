// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const expiry = parseInt(localStorage.getItem("adminExpiry"), 10);

  const isExpired = !expiry || Date.now() > expiry;

  if (!isAdmin || isExpired) {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminExpiry");
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default PrivateRoute;
