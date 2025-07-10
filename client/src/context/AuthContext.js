import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To check initial token

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        // You could optionally verify the token with a backend endpoint
        // For simplicity, we'll assume a token means authenticated for now
        // A better approach would be to have a /api/auth/me endpoint
        try {
          // Example: Check if token is still valid by making a protected request
          await api.get("/notes"); // Any protected route
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Login failed:", err.response?.data?.msg || err.message);
      setIsAuthenticated(false);
      return false;
    }
  };

  const register = async (username, password) => {
    try {
      const res = await api.post("/auth/register", { username, password });
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error(
        "Registration failed:",
        err.response?.data?.msg || err.message
      );
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
