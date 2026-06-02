import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import { Search, Database, AlertTriangle, CheckCircle, FileText, Clock, Info, Shield, Inbox, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnalysisModal from "../components/AnalysisModal";

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

/* ─── Animated Confidence Bar ─── */
function ConfidenceBar({ value, isFake }) {
  const color = isFake ? "#EF4444" : "#22C55E";
  const bgColor = isFake ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 120 }}>
      <span style={{
        fontSize: "0.82rem",
        fontWeight: 700,
        color,
        minWidth: "42px",
        fontVariantNumeric: "tabular-nums"
      }}>
        {Number(value).toFixed(1)}%
      </span>
      <div style={{
        flex: 1,
        height: "6px",
        borderRadius: "3px",
        backgroundColor: bgColor,
        overflow: "hidden",
        maxWidth: "140px"
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Number(value), 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          style={{
            height: "100%",
            borderRadius: "3px",
            background: `linear-gradient(90deg, ${color}CC, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

export default function AdminHistory() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get("/history/all")
      .then(res => {
        const safeData = (res.data || []).map(item => ({
          ...item,
          text: typeof item.text === "string" ? item.text : "",
          result: item.result || "Unknown",
          confidence: item.confidence ?? 0,
          createdAt: item.createdAt || new Date()
        }));
        setData(safeData);
      })
      .catch(console.error);
  }, []);

  const filteredData = useMemo(() => {
    const safeSearch = (search || "").toLowerCase();
    return data
      .filter(item => filter === "All" ? true : item?.result === filter)
      .filter(item => {
        const text = (item?.text || "").toLowerCase();
        const title = (item?.newsTitle || "").toLowerCase();
        return text.includes(safeSearch) || title.includes(safeSearch);
      });
  }, [data, filter, search]);

  const total = data.length;
  const fakeCount = data.filter(i => i.result === "Fake").length;
  const realCount = data.filter(i => i.result === "Real").length;

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${time} • ${day}/${month}/${year}`;
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="layout-container"
      style={{ paddingTop: '40px', paddingBottom: '60px', position: "relative", minHeight: "100vh" }}
    >
      <AdminNavbar />

      {/* ─── Floating Background Particles ─── */}
      <FloatingParticle size="200px" x="5%" y="10%" duration={18} delay={0} color="radial-gradient(circle, rgba(17,17,17,0.04), transparent)" />
      <FloatingParticle size="160px" x="80%" y="5%" duration={22} delay={2} color="radial-gradient(circle, rgba(34,197,94,0.05), transparent)" />
      <FloatingParticle size="180px" x="60%" y="60%" duration={20} delay={4} color="radial-gradient(circle, rgba(239,68,68,0.04), transparent)" />
      
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
                Admin Query Monitoring
              </h1>
              <p style={{
                fontSize: "0.88rem",
                color: "var(--text-tertiary)",
                fontWeight: 500,
                marginTop: "2px"
              }}>
                {total} Total Queries • {fakeCount} Fake • {realCount} Real
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
            title="Total Queries"
            value={total}
            icon={<Database size={22} />}
            accentColor="#111111"
            gradientBg="linear-gradient(135deg, rgba(17,17,17,0.04), transparent)"
          />
          <StatCard
            title="Fake News"
            value={fakeCount}
            icon={<AlertTriangle size={22} />}
            accentColor="#EF4444"
            gradientBg="linear-gradient(135deg, rgba(239,68,68,0.04), transparent)"
          />
          <StatCard
            title="Real News"
            value={realCount}
            icon={<CheckCircle size={22} />}
            accentColor="#22C55E"
            gradientBg="linear-gradient(135deg, rgba(34,197,94,0.04), transparent)"
          />
        </motion.div>

        {/* ─── Search + Filters ─── */}
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
          {/* Search Bar */}
          <SearchBar search={search} setSearch={setSearch} />

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <FilterPill label="All" count={total} active={filter === "All"} onClick={() => setFilter("All")} />
            <FilterPill label="Fake" count={fakeCount} active={filter === "Fake"} onClick={() => setFilter("Fake")} />
            <FilterPill label="Real" count={realCount} active={filter === "Real"} onClick={() => setFilter("Real")} />
          </div>
        </motion.div>

        {/* ─── History Cards ─── */}
        <motion.div
          variants={cardVariants}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {filteredData.map((item, idx) => {
            const displayText = item.newsTitle || item.text || "Image Detection";
            const isFake = item.result === "Fake";

            return (
              <motion.div
                custom={idx}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                key={item._id}
                whileHover={{
                  y: -3,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                  transition: { duration: 0.2 }
                }}
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  borderLeft: `4px solid ${isFake ? "#EF4444" : "#22C55E"}`,
                  borderRadius: "14px",
                  padding: "18px 22px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  cursor: "default",
                  position: "relative",
                }}
              >
                {/* Top Row */}
                <div style={{ marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <FileText size={12} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em"
                    }}>Query</span>
                    
                    {/* User Badge */}
                    <span style={{
                      marginLeft: "10px",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      👤 {item.userId?.email || "Unknown User"}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                    <p style={{
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      flex: 1,
                      minWidth: 0,
                      margin: 0
                    }}>
                      {displayText}
                    </p>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <ActionButton
                        onClick={() => setSelected(item)}
                        icon={<Info size={13} />}
                        label="Details"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid var(--border-color)", margin: "12px 0" }} />

                {/* Bottom Row */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
                  <span style={{
                    padding: "3px 12px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    backgroundColor: isFake ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                    color: isFake ? "#DC2626" : "#16A34A",
                    lineHeight: "1.6",
                    letterSpacing: "0.02em"
                  }}>
                    {item.result}
                  </span>

                  <ConfidenceBar value={item.confidence} isFake={isFake} />

                  <span style={{
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    fontWeight: 500,
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}>
                    <Clock size={12} /> {formatTime(item.createdAt)}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* ─── Empty State ─── */}
          {filteredData.length === 0 && (
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
                No records found
              </p>
              <p style={{
                fontSize: "0.88rem",
                color: "var(--text-tertiary)",
                maxWidth: "320px",
                margin: "0 auto",
                lineHeight: 1.6
              }}>
                Try adjusting your search query or changing the active filter to find what you're looking for.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ─── Details Modal ─── */}
        <AnalysisModal isOpen={!!selected} onClose={() => setSelected(null)} data={selected} />

      </div>
    </motion.div>
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
        placeholder="Search user queries..."
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

/* ─── Filter Pill Component ─── */
function FilterPill({ label, count, active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        padding: "8px 18px",
        borderRadius: "9999px",
        fontWeight: 600,
        fontSize: "0.82rem",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor: active ? "#111111" : "var(--bg-primary)",
        color: active ? "#FFFFFF" : "var(--text-secondary)",
        border: active ? "1px solid #111111" : "1px solid var(--border-color)",
        boxShadow: active ? "0 2px 8px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.03)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap"
      }}
    >
      {label}
      <span style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        opacity: active ? 0.8 : 0.6,
        backgroundColor: active ? "rgba(255,255,255,0.15)" : "var(--bg-secondary)",
        padding: "1px 7px",
        borderRadius: "9999px"
      }}>
        {count}
      </span>
    </motion.button>
  );
}

/* ─── Action Button Component ─── */
function ActionButton({ onClick, icon, label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: label ? "6px 14px" : "6px 10px",
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-secondary)",
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        whiteSpace: "nowrap",
        height: "32px",
        display: "flex",
        alignItems: "center",
        gap: "5px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
        e.currentTarget.style.borderColor = "#C4C7CC";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-primary)";
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
}