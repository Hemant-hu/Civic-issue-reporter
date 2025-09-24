import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <Link to="/home" className="logo">
        Civic Issue Reporter 🏙️
      </Link>
      <nav>
        <Link to="/home">Home</Link>
        {user && user.role === "admin" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}
        {user && user.role === "public" && (
          <Link to="/report">Report Issue</Link>
        )}

        {user ? (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
