import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;

  const isAdmin = user?.role === "ADMIN" || user?.roles?.includes?.("ADMIN") || user?.role === "HOST" || user?.roles?.includes?.("HOST");
  return isAdmin
    ? children
    : <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
}
