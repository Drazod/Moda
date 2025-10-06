import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  const isAdmin = user?.role === "ADMIN" || user?.roles?.includes?.("ADMIN") || user?.role === "HOST" || user?.roles?.includes?.("HOST");
  return user ? <Navigate to={isAdmin ? "/dash-board" : "/"} replace /> : children;
}
