import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import MatteOrb from "../components/MatteOrb";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) return setError("Enter email and password");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password, role });
      login(res.data.token, res.data.role);

      if (res.data.role === "admin") navigate("/admin/dashboard");
      else navigate("/detect");
    } catch (err) {
      if (err.response) {
        const msg = err.response.data.message;
        if (msg === "Not an admin account") setError("You are not an admin");
        else if (msg === "Admin must login as admin") setError("Admin must use admin login");
        else setError("Invalid credentials");
      } else {
        setError("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        
        <motion.div 
          className="auth-hero" 
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h1 className="text-3xl font-bold mb-4" style={{ fontSize: '3rem', lineHeight: 1.2 }}>
              Vaarta AI
            </h1>
            <p className="text-gray-500 text-lg">
              Intelligent misinformation detection powered by advanced neural models.
            </p>
          </div>
          <MatteOrb />
        </motion.div>

        <motion.div 
          style={{ flex: 1 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="auth-card">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
              <p className="text-gray-400 text-sm">Sign in to your workspace</p>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setRole("user")}
                className={role === "user" ? "premium-btn" : "premium-btn premium-btn-secondary"}
                style={{ flex: 1 }}
              >
                User
              </button>
              <button
                onClick={() => setRole("admin")}
                className={role === "admin" ? "premium-btn" : "premium-btn premium-btn-secondary"}
                style={{ flex: 1 }}
              >
                Admin
              </button>
            </div>

            <div className="mb-4">
              <label className="premium-label">Email Address</label>
              <input
                className="premium-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="premium-label">Password</label>
              <input
                type="password"
                className="premium-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red text-sm text-center mb-4">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="premium-btn"
              style={{ width: '100%', backgroundColor: 'var(--accent-blue)' }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-gray-500 mt-6 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue font-semibold">
                Create one free &rarr;
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
