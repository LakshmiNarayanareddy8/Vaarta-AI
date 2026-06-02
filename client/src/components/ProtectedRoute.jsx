import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, adminOnly }) {
  const { token } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly) {
    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}