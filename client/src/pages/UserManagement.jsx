import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import { Search, Users, Database, Activity, X, Clock, Inbox, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Animation Variants ─── */
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const listItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" }
  })
};

/* ─── Floating Gradient Particle ─── */
function FloatingParticle({ size, x, y, duration, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.15, 0.08, 0.15, 0],
        scale: [0.5, 1, 0.8, 1, 0.5],
        x: [0, 30, -20, 10, 0],
        y: [0, -40, 20, -30, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: `blur(${parseInt(size) / 2}px)`,
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    API.get("/admin/users")
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalUsers = users.length;
  const totalQueries = users.reduce((sum, u) => sum + (u.queries || 0), 0);
  const avgQueries = totalUsers ? Math.round(totalQueries / totalUsers) : 0;

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setUserHistory([]);
    setHistoryLoading(true);
    try {
      const res = await API.get(`/admin/users/${user._id}/history`);
      setUserHistory(res.data);
    } catch {
      setUserHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="layout-container"
      style={{ paddingTop: "40px", paddingBottom: "60px", position: "relative", minHeight: "100vh" }}
    >
      <AdminNavbar />

      {/* ─── Floating Background Particles ─── */}
      <FloatingParticle size="200px" x="5%" y="10%" duration={18} delay={0} color="radial-gradient(circle, rgba(17,17,17,0.04), transparent)" />
      <FloatingParticle size="160px" x="80%" y="5%" duration={22} delay={2} color="radial-gradient(circle, rgba(59,130,246,0.05), transparent)" />
      <FloatingParticle size="180px" x="60%" y="60%" duration={20} delay={4} color="radial-gradient(circle, rgba(245,158,11,0.04), transparent)" />

      <div style={{ marginTop: '100px', position: "relative", zIndex: 1, maxWidth: "1100px", margin: "100px auto 0" }}>
        
        {/* ─── Header ─── */}
        <motion.div variants={cardVariants} style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "6px" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #111 0%, #333 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}>
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                margin: 0
              }}>
                User Monitoring
              </h1>
              <p style={{
                fontSize: "0.88rem",
                color: "var(--text-tertiary)",
                fontWeight: 500,
                marginTop: "2px"
              }}>
                {totalUsers} registered users
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── Premium Stat Cards ─── */}
        <motion.div
          variants={cardVariants}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<Users size={22} />}
            accentColor="#3B82F6"
            gradientBg="linear-gradient(135deg, rgba(59,130,246,0.04), transparent)"
          />
          <StatCard
            title="Total Queries"
            value={totalQueries}
            icon={<Database size={22} />}
            accentColor="#F59E0B"
            gradientBg="linear-gradient(135deg, rgba(245,158,11,0.04), transparent)"
          />
          <StatCard
            title="Avg Queries/User"
            value={avgQueries}
            icon={<Activity size={22} />}
            accentColor="#22C55E"
            gradientBg="linear-gradient(135deg, rgba(34,197,94,0.04), transparent)"
          />
        </motion.div>

        {/* ─── Search Bar ─── */}
        <motion.div
          variants={cardVariants}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            marginBottom: "28px",
            alignItems: "center",
          }}
        >
          <SearchBar search={search} setSearch={setSearch} />
        </motion.div>

        {/* ─── User Cards List ─── */}
        <motion.div
          variants={cardVariants}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {filteredUsers.map((user, idx) => (
            <motion.div
              key={user._id}
              custom={idx}
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                y: -3,
                boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                transition: { duration: 0.2 }
              }}
              onClick={() => handleUserClick(user)}
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderLeft: `4px solid ${user.role === "admin" ? "#3B82F6" : "var(--text-tertiary)"}`,
                borderRadius: "14px",
                padding: "18px 22px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0, flex: 1 }}>
                <UserAvatar name={user.name} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    margin: "0 0 4px 0"
                  }}>
                    {user.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
                      {user.email}
                    </span>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: user.role === "admin" ? "rgba(59,130,246,0.08)" : "var(--bg-secondary)",
                      color: user.role === "admin" ? "#3B82F6" : "var(--text-secondary)",
                      border: `1px solid ${user.role === "admin" ? "#3B82F6" : "var(--border-color)"}`,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase"
                    }}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  lineHeight: 1,
                  margin: "0 0 2px 0"
                }}>
                  {user.queries || 0}
                </p>
                <p style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0
                }}>
                  detections
                </p>
                <p style={{
                  fontSize: "0.78rem",
                  color: "#3B82F6",
                  fontWeight: 600,
                  marginTop: "6px",
                  marginBottom: 0
                }}>
                  View history →
                </p>
              </div>
            </motion.div>
          ))}

          {/* ─── Empty State ─── */}
          {filteredUsers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                textAlign: "center",
                padding: "72px 24px",
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
              }}
            >
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                backgroundColor: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px"
              }}>
                <Inbox size={28} style={{ color: "var(--text-tertiary)" }} />
              </div>
              <p style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "8px",
                fontFamily: "var(--font-display)"
              }}>
                No users found
              </p>
              <p style={{
                fontSize: "0.88rem",
                color: "var(--text-tertiary)",
                maxWidth: "320px",
                margin: "0 auto",
                lineHeight: 1.6
              }}>
                Try adjusting your search query to find the registered user you are looking for.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── User History Modal ── */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 200, padding: 24,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedUser(null); }}
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                width: "100%", maxWidth: 700,
                maxHeight: "85vh", overflowY: "auto",
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                position: "relative",
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  position: "absolute", top: 20, right: 20,
                  width: 32, height: 32, borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "var(--text-secondary)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = "var(--bg-primary)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <X size={14} />
              </button>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <UserAvatar name={selectedUser.name} size={60} />
                <div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 4px 0", color: "var(--text-primary)" }}>{selectedUser.name}</h2>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-tertiary)", fontWeight: 500, margin: 0 }}>{selectedUser.email}</p>
                  <span style={{
                    display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 9999,
                    fontSize: "0.72rem", fontWeight: 600,
                    backgroundColor: selectedUser.role === "admin" ? "rgba(59,130,246,0.08)" : "var(--bg-secondary)",
                    color: selectedUser.role === "admin" ? "#3B82F6" : "var(--text-secondary)",
                    border: `1px solid ${selectedUser.role === "admin" ? "#3B82F6" : "var(--border-color)"}`,
                  }}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              {/* History count badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Clock size={16} style={{ color: "var(--text-secondary)" }} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 600 }}>
                  {historyLoading ? "Loading history..." : `${userHistory.length} detection${userHistory.length !== 1 ? "s" : ""} found`}
                </span>
              </div>

              {/* History Items */}
              {historyLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 32, height: 32, border: "3px solid var(--border-color)", borderTopColor: "#3B82F6", borderRadius: "50%", margin: "0 auto 12px" }}
                  />
                  <p style={{ color: "var(--text-tertiary)", fontWeight: 600 }}>Fetching history…</p>
                </div>
              ) : userHistory.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <p style={{ color: "var(--text-tertiary)", fontSize: "1rem", fontWeight: 600 }}>No history found for this user.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {userHistory.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: 12, padding: "18px 20px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <span style={{
                          padding: "3px 12px", borderRadius: 9999, fontSize: "0.75rem", fontWeight: 700,
                          backgroundColor: item.result === "Fake" ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                          color: item.result === "Fake" ? "#DC2626" : "#16A34A",
                          border: `1px solid ${item.result === "Fake" ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                        }}>
                          {item.result === "Fake" ? "⚠ Fake" : "✓ Real"}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600 }}>{new Date(item.createdAt).toLocaleString()}</span>
                      </div>

                      <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 10px 0" }}>
                        {item.newsTitle || (item.text ? (item.text.length > 100 ? item.text.substring(0, 100) + "…" : item.text) : "Image Detection")}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontWeight: 600 }}>
                          Confidence: <span style={{ color: item.result === "Fake" ? "#DC2626" : "#16A34A", fontWeight: 700 }}>
                            {Number(item.confidence).toFixed(2)}%
                          </span>
                        </span>
                        {item.analysisType && (
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px", borderRadius: 6, backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                            {item.analysisType}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function UserAvatar({ name, size = 52 }) {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2, flexShrink: 0,
      backgroundColor: "#111111", color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.42, fontWeight: 700,
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}>
      {initial}
    </div>
  );
}

/* ─── Stat Card Component ─── */
function StatCard({ title, value, icon, accentColor, gradientBg }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        overflow: "hidden",
        cursor: "default",
        position: "relative",
      }}
    >
      <div style={{ height: "3px", background: accentColor, borderRadius: "0" }} />
      <div style={{ padding: "22px 24px 20px", background: gradientBg }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "8px"
            }}>
              {title}
            </p>
            <p style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1,
              fontFamily: "var(--font-display)",
              fontVariantNumeric: "tabular-nums"
            }}>
              {value}
            </p>
          </div>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "var(--bg-secondary)",
            color: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Search Bar Component ─── */
function SearchBar({ search, setSearch }) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        flex: "1 1 280px",
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",
        backgroundColor: "var(--bg-primary)",
        border: `1px solid ${focused ? "#111" : "var(--border-color)"}`,
        borderRadius: "12px",
        boxShadow: focused
          ? "0 0 0 3px rgba(17,17,17,0.06), 0 2px 8px rgba(0,0,0,0.04)"
          : "0 1px 4px rgba(0,0,0,0.03)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        gap: "10px"
      }}
    >
      <Search
        size={16}
        style={{
          color: focused ? "var(--text-primary)" : "var(--text-tertiary)",
          transition: "color 0.2s",
          flexShrink: 0
        }}
      />
      <input
        type="text"
        placeholder="Search users by name or email..."
        style={{
          border: "none",
          background: "transparent",
          outline: "none",
          width: "100%",
          color: "var(--text-primary)",
          fontSize: "0.88rem",
          fontWeight: 500
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <AnimatePresence>
        {search && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSearch("")}
            style={{
              background: "var(--bg-secondary)",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--text-tertiary)",
              transition: "all 0.15s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
              e.currentTarget.style.color = "var(--text-tertiary)";
            }}
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}