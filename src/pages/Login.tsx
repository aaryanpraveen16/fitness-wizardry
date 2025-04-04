
import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/30 to-background">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
