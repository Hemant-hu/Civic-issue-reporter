import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Root = () => {
  const { user } = useAuth();

  // If a user is logged in, redirect them to the home page.
  // Otherwise, redirect them to the login page.
  return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export default Root;
