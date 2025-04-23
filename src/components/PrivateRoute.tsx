import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // Temporarily bypass authentication check
  // Comment this line and uncomment the code below when you want to enable auth again
  return children;

  /*
  // If still loading, you might want to render a loading indicator
  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children
  return children;
  */
};

export default PrivateRoute;
