import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/profile" replace />;
};

export default ProtectedRoute;
