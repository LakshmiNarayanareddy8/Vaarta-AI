import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import MatteOrb from "../components/MatteOrb";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password) return setError("Fill all fields");
    if (password.length < 6) return setError("Password must be 6+ characters");

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      setError("");
      navigate("/login");
    } catch (err) {
      if (err.response) {
        const msg = err.response.data.message;
        if (msg === "User already exists") setError("Email already registered");
        else setError("Registration failed");
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
              Join Vaarta AI
            </h1>
            <p className="text-gray-500 text-lg">
              Unlock the power of advanced neural models to detect misinformation with confidence.
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
              <h2 className="text-2xl font-bold mb-2">Create Account</h2>
              <p className="text-gray-400 text-sm">Sign up for vaarta AI</p>
            </div>

            <div className="mb-4">
              <label className="premium-label">Name</label>
              <input
                className="premium-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              onClick={handleRegister}
              disabled={loading}
              className="premium-btn"
              style={{ width: '100%', backgroundColor: 'var(--accent-blue)' }}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>

            <p className="text-center text-gray-500 mt-6 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue font-semibold">
                Login &rarr;
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
