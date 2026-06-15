import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  // Get authentication state from context
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading)
    return <div style={{ color: "#fff", padding: "20px" }}>Loading...</div>;

  // Allow access if user is logged in, otherwise redirect to login page
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
