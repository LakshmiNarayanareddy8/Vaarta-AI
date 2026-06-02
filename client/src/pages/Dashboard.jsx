import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import { CheckCircle2, AlertTriangle, FileText, BarChart2, Clock, Trash2 } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentDetections, setRecentDetections] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/history")
      .then(res => {
        const data = res.data;
        if (!data || data.length === 0) return;

        const totalFake = data.filter(i => i.result === "Fake").length;
        const totalReal = data.filter(i => i.result === "Real").length;
        const avgConfidence = data.reduce((a, c) => a + Number(c.confidence || 0), 0) / data.length;

        setStats({
          total: data.length,
          fake: totalFake,
          real: totalReal,
          confidence: avgConfidence.toFixed(1)
        });

        const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const weeklyMap = {
          Mon: { day: "Mon", Fake: 0, Real: 0 },
          Tue: { day: "Tue", Fake: 0, Real: 0 },
          Wed: { day: "Wed", Fake: 0, Real: 0 },
          Thu: { day: "Thu", Fake: 0, Real: 0 },
          Fri: { day: "Fri", Fake: 0, Real: 0 },
          Sat: { day: "Sat", Fake: 0, Real: 0 },
          Sun: { day: "Sun", Fake: 0, Real: 0 }
        };

        data.forEach(item => {
          const date = new Date(item.createdAt);
          const jsDay = date.getDay();
          const dayName = daysOrder[(jsDay + 6) % 7];
          if (item.result === "Fake") weeklyMap[dayName].Fake++;
          else if (item.result === "Real") weeklyMap[dayName].Real++;
        });

        setWeeklyData(daysOrder.map(d => weeklyMap[d]));
        setPieData([
          { name: "Fake", value: totalFake },
          { name: "Real", value: totalReal }
        ]);
        setRecentDetections(data.slice(0, 3));
      })
      .catch(console.error);
  }, []);

  const PIE_COLORS = ["var(--accent-red)", "var(--accent-green)"];

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " • " + date.toLocaleDateString();
  };

  return (
    <div style={{ padding: "0 24px", paddingBottom: "32px" }}>
      <div className="flex flex-wrap justify-between align-center gap-4 mb-4" style={{ marginTop: "16px" }}>
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome Back 👋</h1>
          <h3 className="text-gray-500 text-sm mb-1">Track misinformation detection results, analyze verification trends, and monitor system performance.</h3>
          {stats && <p className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>Last Update: Today • {stats.total} checks completed</p>}
        </div>
        <button onClick={() => navigate("/detect")} className="premium-btn flex align-center gap-2" style={{ backgroundColor: 'var(--accent-blue)', padding: '8px 16px', fontSize: '0.9rem' }}>
          ✦ New Detection
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-4">
          <StatCard title="Total Checks" value={stats.total} icon={<FileText size={16} />} color="var(--accent-blue)" />
          <StatCard title="Fake Detected" value={stats.fake} icon={<AlertTriangle size={16} />} color="var(--accent-red)" />
          <StatCard title="Real Verified" value={stats.real} icon={<CheckCircle2 size={16} />} color="var(--accent-green)" />
          <StatCard title="Avg Confidence" value={`${stats.confidence}%`} icon={<BarChart2 size={16} />} color="var(--text-primary)" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '320px', padding: '20px' }}>
          <h3 className="mb-2 text-base font-bold">📈 Weekly Detection Trend</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-secondary)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} fontSize={12} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-tertiary)" }} />
                <Bar dataKey="Fake" fill="var(--accent-red)" radius={[4, 4, 0, 0]} barSize={20}>
                  <LabelList dataKey="Fake" position="top" fill="var(--text-secondary)" fontSize={11} />
                </Bar>
                <Bar dataKey="Real" fill="var(--accent-green)" radius={[4, 4, 0, 0]} barSize={20}>
                  <LabelList dataKey="Real" position="top" fill="var(--text-secondary)" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '320px', padding: '20px' }}>
          <h3 className="mb-4 text-base font-bold">🛡 Fake vs Real Ratio</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
            <div style={{ width: '200px', height: '200px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={85} stroke="none">
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
                <p className="text-xs text-gray-500 font-semibold">Checks</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div className="flex align-center gap-2 mb-1">
                  <div style={{ backgroundColor: 'var(--accent-red)', width: '8px', height: '8px', borderRadius: '50%' }} />
                  <span className="text-sm font-semibold text-gray-500">Fake</span>
                </div>
                <p className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{stats?.fake} <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>({stats?.total ? ((stats.fake/stats.total)*100).toFixed(0) : 0}%)</span></p>
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div className="flex align-center gap-2 mb-1">
                  <div style={{ backgroundColor: 'var(--accent-green)', width: '8px', height: '8px', borderRadius: '50%' }} />
                  <span className="text-sm font-semibold text-gray-500">Real</span>
                </div>
                <p className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{stats?.real} <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>({stats?.total ? ((stats.real/stats.total)*100).toFixed(0) : 0}%)</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {recentDetections.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div className="flex flex-wrap justify-between align-center mb-4">
            <h3 className="text-lg font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} /> Latest Detections
            </h3>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate("/history"); }}
              style={{
                color: '#2563EB',
                fontWeight: 500,
                fontSize: '14px',
                background: 'transparent',
                border: 'none',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s, text-decoration 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1D4ED8';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#2563EB';
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              View All →
            </a>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentDetections.map((item, idx) => {
              const isFake = item.result === "Fake";
              const displayText = item.newsTitle || item.text || "Image Detection";
              const shortText = displayText.length > 100 ? displayText.substring(0, 100) + "..." : displayText;

              return (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '16px', 
                    padding: '20px 24px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 250ms ease',
                  }}
                >
                  {/* Top Row: Query + Label */}
                  <div style={{ marginBottom: '8px' }}>
                    <div className="flex align-center gap-2" style={{ marginBottom: '6px' }}>
                      <FileText size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Query</span>
                    </div>
                    <p style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {shortText}
                    </p>
                  </div>
                  
                  {/* Bottom Row: Badge + Confidence + Timestamp */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: isFake ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                      color: isFake ? '#DC2626' : '#16A34A',
                    }}>
                      {item.result}
                    </span>
                    
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isFake ? '#DC2626' : '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      🎯 {Number(item.confidence).toFixed(1)}% Confidence
                    </span>
                    
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {formatTime(item.createdAt)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="premium-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="flex align-center gap-2 mb-2">
        <div style={{ color: "var(--text-tertiary)" }}>{icon}</div>
        <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', boxShadow: 'var(--shadow-md)' }}>
        {label && <p className="text-gray-500 text-xs mb-2 font-semibold uppercase">{label}</p>}
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-bold mb-1">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};