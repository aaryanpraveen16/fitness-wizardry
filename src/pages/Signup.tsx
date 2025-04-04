
import React from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
