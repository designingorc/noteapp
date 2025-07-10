import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (username, password) => {
    const success = await register(username, password);
    if (success) {
      navigate("/notes");
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <AuthForm type="register" onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;
