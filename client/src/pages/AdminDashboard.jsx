import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell, CartesianGrid, Legend, LabelList } from "recharts";
import { Users, Brain, AlertTriangle, CheckCircle, Shield, ArrowRight, Activity, PieChart as PieChartIcon, BarChart3, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
    transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" }
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalPredictions: 0, fakeCount: 0, realCount: 0 });
  const [latest, setLatest] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    API.get("/admin/analytics").then(res => setStats(res.data)).catch(console.error);

    API.get("/history/all").then(res => {
      const data = res.data;
      setLatest(data.slice(0, 3));
      const fakeCount = data.filter(d => d.result === "Fake").length;
      const realCount = data.filter(d => d.result === "Real").length;
      setPieData([{ name: "Fake", value: fakeCount }, { name: "Real", value: realCount }]);

      const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const weeklyMap = {
        Mon: { day: "Mon", count: 0 }, Tue: { day: "Tue", count: 0 }, Wed: { day: "Wed", count: 0 },
        Thu: { day: "Thu", count: 0 }, Fri: { day: "Fri", count: 0 }, Sat: { day: "Sat", count: 0 }, Sun: { day: "Sun", count: 0 }
      };

      data.forEach(item => {
        if (!item.createdAt) return;
        const date = new Date(item.createdAt);
        const jsDay = date.getDay();
        const dayName = daysOrder[(jsDay + 6) % 7];
        weeklyMap[dayName].count++;
      });
      setWeeklyData(daysOrder.map(d => weeklyMap[d]));
    }).catch(console.error);
  }, []);

  const COLORS = ["#EF4444", "#22C55E"];

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
      <FloatingParticle size="250px" x="-5%" y="5%" duration={18} delay={0} color="radial-gradient(circle, rgba(17,17,17,0.03), transparent)" />
      <FloatingParticle size="200px" x="85%" y="15%" duration={22} delay={2} color="radial-gradient(circle, rgba(59,130,246,0.04), transparent)" />
      <FloatingParticle size="150px" x="70%" y="70%" duration={20} delay={4} color="radial-gradient(circle, rgba(17,17,17,0.03), transparent)" />

      <div style={{ marginTop: '100px', position: "relative", zIndex: 1, maxWidth: "1100px", margin: "100px auto 0" }}>
        
        {/* ─── Header ─── */}
        <motion.div variants={cardVariants} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
              <Activity size={20} color="#fff" />
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
                Admin Dashboard
              </h1>
              <p style={{
                fontSize: "0.88rem",
                color: "var(--text-tertiary)",
                fontWeight: 500,
                marginTop: "2px"
              }}>
                Monitor platform activity and global user metrics
              </p>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin/history")} 
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              background: "#111",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            View All Queries <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        {/* ─── Stat Cards ─── */}
        <motion.div variants={cardVariants} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={22} />} accentColor="#3B82F6" gradientBg="linear-gradient(135deg, rgba(59,130,246,0.04), transparent)" />
          <StatCard title="Predictions" value={stats.totalPredictions} icon={<Brain size={22} />} accentColor="#F59E0B" gradientBg="linear-gradient(135deg, rgba(245,158,11,0.04), transparent)" />
          <StatCard title="Fake News" value={stats.fakeCount} icon={<AlertTriangle size={22} />} accentColor="#EF4444" gradientBg="linear-gradient(135deg, rgba(239,68,68,0.04), transparent)" />
          <StatCard title="Real News" value={stats.realCount} icon={<CheckCircle size={22} />} accentColor="#22C55E" gradientBg="linear-gradient(135deg, rgba(34,197,94,0.04), transparent)" />
        </motion.div>

        {/* ─── Charts ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", marginBottom: "32px" }}>
          <motion.div variants={cardVariants} style={{
            background: "var(--bg-primary)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            border: "1px solid var(--border-color)",
          }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <PieChartIcon size={18} color="var(--text-tertiary)" /> Fake vs Real Ratio
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', height: 200 }}>
              <div style={{ width: '180px', height: '180px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={80} innerRadius={55} stroke="none" paddingAngle={2}>
                      {pieData.map((e, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                  <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{stats?.totalPredictions || 0}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase", marginTop: "2px" }}>Queries</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '14px 20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ backgroundColor: '#EF4444', width: '10px', height: '10px', borderRadius: '50%' }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Fake</span>
                  </div>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {stats?.fakeCount} <span style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 500 }}>({stats?.totalPredictions ? ((stats.fakeCount/stats.totalPredictions)*100).toFixed(0) : 0}%)</span>
                  </p>
                </div>
                <div style={{ padding: '14px 20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ backgroundColor: '#22C55E', width: '10px', height: '10px', borderRadius: '50%' }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Real</span>
                  </div>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {stats?.realCount} <span style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 500 }}>({stats?.totalPredictions ? ((stats.realCount/stats.totalPredictions)*100).toFixed(0) : 0}%)</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} style={{
            background: "var(--bg-primary)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            border: "1px solid var(--border-color)",
          }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <BarChart3 size={18} color="var(--text-tertiary)" /> Weekly Queries
            </h3>
            <div style={{ width: "100%", height: 220, overflow: "visible" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 25, right: 10, left: -20, bottom: 0 }} style={{ overflow: "visible" }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="var(--text-secondary)" tick={{ fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} stroke="var(--text-secondary)" tick={{ fontSize: 12, fontWeight: 600 }} domain={[0, dataMax => dataMax === 0 ? 5 : Math.ceil(dataMax * 1.2)]} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-secondary)" }} />
                  <Bar dataKey="count" fill="#111" radius={[4, 4, 0, 0]} barSize={28}>
                    <LabelList dataKey="count" position="top" fill="var(--text-secondary)" fontSize={12} fontWeight={600} offset={8} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* ─── Latest Queries ─── */}
        <motion.div variants={cardVariants} style={{
          background: "var(--bg-primary)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          border: "1px solid var(--border-color)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={18} color="var(--text-tertiary)" /> Latest Queries
            </h3>
            <span 
              onClick={() => navigate("/admin/history")} 
              style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 600, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-tertiary)"}
            >
              View All
            </span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {latest.map((item, idx) => {
              const isFake = item.result === "Fake";
              return (
                <motion.div 
                  key={item._id} 
                  custom={idx}
                  variants={listItemVariants}
                  whileHover={{ x: 4 }}
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    padding: '16px 20px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)',
                    borderLeft: `4px solid ${isFake ? "#EF4444" : "#22C55E"}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px"
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>User</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", background: "var(--bg-primary)", padding: "2px 8px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>{item.userId?.email || "Unknown"}</span>
                    </div>
                    <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.text || item.newsTitle || "Image Detection"}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: isFake ? "#DC2626" : "#16A34A", background: isFake ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", padding: "4px 10px", borderRadius: "8px" }}>
                      {item.result}
                    </span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>
                      {Number(item.confidence || 0).toFixed(1)}% Confidence
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Shared Components ─── */
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
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px"
            }}>
              {title}
            </p>
            <p style={{
              fontSize: "1.75rem",
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
            width: "40px",
            height: "40px",
            borderRadius: "10px",
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: 'var(--bg-primary)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '12px', 
        padding: '12px 16px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)' 
      }}>
        {label && <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "8px" }}>{label}</p>}
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: "0.9rem", fontWeight: 600, margin: "4px 0" }}>
            {entry.name || "Queries"}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
      {payload.map((entry, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ backgroundColor: entry.color, width: '10px', height: '10px', borderRadius: '50%' }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};