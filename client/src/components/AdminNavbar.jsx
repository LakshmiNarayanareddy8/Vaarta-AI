import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, History, LogOut } from "lucide-react";
import "./Navbar.css"; // Reuse the standard Navbar CSS

export default function AdminNavbar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const navClass = (path) =>
    `nav-link ${location.pathname === path ? "active" : ""}`;

  return (
    <nav className="navbar-container">
      <div className="navbar-brand">
        <div style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--text-primary)' }}></div>
        <span>Admin Panel</span>
      </div>

      <div className="navbar-links">
        <Link to="/admin/dashboard" className={navClass("/admin/dashboard")}>
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        <Link to="/admin/users" className={navClass("/admin/users")}>
          <Users size={16} />
          Users
        </Link>

        <Link to="/admin/history" className={navClass("/admin/history")}>
          <History size={16} />
          History
        </Link>

        <button onClick={logout} className="nav-link-logout">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}