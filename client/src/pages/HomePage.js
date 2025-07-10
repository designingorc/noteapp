import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <h1>Welcome to the JWT Note App!</h1>
      {isAuthenticated ? (
        <>
          <p>You are logged in.</p>
          <Link to="/notes">
            <button>Go to My Notes</button>
          </Link>
          <button onClick={logout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <p>Please log in or register to manage your notes.</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register" style={{ marginLeft: "10px" }}>
            <button>Register</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default HomePage;
