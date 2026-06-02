import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { role } = useContext(AuthContext);
  if (role !== "admin") return <Navigate to="/detect" />;
  return children;
}