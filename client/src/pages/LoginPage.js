import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    const success = await login(username, password);
    if (success) {
      navigate("/notes");
    } else {
      alert("Login failed. Invalid credentials.");
    }
  };

  return (
    <div>
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
