import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { LayoutDashboard, Search, History, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import "./Navbar.css";

export default function Navbar() {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  let role = null;
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navClass = (path) =>
    `nav-link ${location.pathname === path ? "active" : ""}`;

  return (
    <motion.nav
      className="navbar-container"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
     <div className="navbar-brand">
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: 14,
      background: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
    >
      <path d="M12 2l7 3v5c0 5-3.8 9.7-7 12-3.2-2.3-7-7-7-12V5l7-3z" />
    </svg>
  </div>

  <span
    style={{
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "1.1rem",
    }}
  >
    Vaarta AI
  </span>
</div>
      {token && (
        <div className="navbar-links">
          <Link to="/dashboard" className={navClass("/dashboard")}>
            <LayoutDashboard size={14} />
            Dashboard
          </Link>

          <Link to="/detect" className={navClass("/detect")}>
            <Search size={14} />
            Detect
          </Link>

          <Link to="/history" className={navClass("/history")}>
            <History size={14} />
            History
          </Link>

          {role === "admin" && (
            <Link to="/admin/users" className={navClass("/admin/users")}>
              Users
            </Link>
          )}

          <button onClick={handleLogout} className="nav-link-logout">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      )}
    </motion.nav>
  );
}
