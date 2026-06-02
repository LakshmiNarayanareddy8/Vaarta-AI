import { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { 
  FileText, Image as ImageIcon, Link2, Layers, Upload, 
  CheckCircle2, Sparkles, ArrowRight, Search, ShieldCheck,
  Zap, Lock, Activity, Database, BrainCircuit, Globe, RefreshCcw, ChevronRight, AlertTriangle, Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function FloatingParticle({ size, x, y, duration, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.1, 0.05, 0.1, 0],
        scale: [0.8, 1.2, 0.9, 1.1, 0.8],
        x: [0, 40, -30, 20, 0],
        y: [0, -50, 30, -20, 0],
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

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function Detect() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [recentDetections, setRecentDetections] = useState([]);
  
  const textareaRef = useRef(null);

  const fetchRecent = () => {
    API.get("/history")
      .then(res => {
        const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentDetections(sorted.slice(0, 4));
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  // Auto-grow textarea
  const handleTextChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current && text === "") {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    if (mode === "text" && !text) return setError("Please enter text.");
    if (mode === "image" && !image) return setError("Please upload an image.");
    if (mode === "url" && !url) return setError("Please enter a URL.");
    if (mode === "multimodal" && (!text || !image)) return setError("Please provide both text and image.");
    
    try {
      setLoading(true);
      const form = new FormData();
      if (mode === "text") form.append("text", text);
      if (mode === "image") form.append("image", image);
      if (mode === "url") form.append("text", url);
      if (mode === "multimodal") { form.append("text", text); form.append("image", image); }
      
      const res = await axios.post("http://localhost:5000/api/predict", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(res.data);
      fetchRecent(); // Refresh recent detections after new detection
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const pctUsed = Math.min(100, (text.length / 5000) * 100).toFixed(1);

  const renderTextArea = () => (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: "16px", width: "100%" }}>
      <div style={{ 
        position: "relative",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        borderRadius: "14px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02), 0 2px 8px rgba(0,0,0,0.02)",
        transition: "all 0.3s ease"
      }}>
        <Search size={16} style={{ position: "absolute", left: "16px", top: "16px", color: "var(--text-tertiary)" }} />
        <textarea 
          ref={textareaRef}
          placeholder="Paste an article, headline, claim, or news content..." 
          style={{ 
            width: "100%",
            padding: "16px 16px 16px 42px", 
            minHeight: "64px",
            maxHeight: "250px", 
            resize: "none",
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "0.95rem",
            color: "var(--text-primary)",
            lineHeight: 1.5,
            overflowY: "auto"
          }} 
          value={text} 
          onChange={handleTextChange} 
          maxLength={5000} 
        />
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          borderTop: "1px solid rgba(0,0,0,0.03)",
          background: "rgba(250,250,250,0.5)",
          borderBottomLeftRadius: "14px",
          borderBottomRightRadius: "14px",
        }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", fontWeight: 500 }}>Example: "Scientists discover water on Mars"</span>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: text.length > 4800 ? "var(--accent-red)" : "var(--text-secondary)" }}>
              {text.length} <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>/ 5000</span>
            </span>
            <div style={{ width: "48px", height: "4px", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ 
                height: "100%", 
                width: `${pctUsed}%`, 
                backgroundColor: text.length > 4800 ? "var(--accent-red)" : "#111",
                transition: "width 0.2s ease"
              }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderImageUpload = () => (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: "16px", width: "100%" }}>
      <label style={{ 
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "24px", minHeight: "100px",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        border: "1px dashed rgba(0,0,0,0.15)",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }} 
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.25)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.9)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.6)"; }}
      >
        <div style={{ 
          width: "36px", height: "36px", borderRadius: "10px", background: "var(--bg-secondary)", 
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}>
          <Upload size={18} style={{ color: "#111" }} />
        </div>
        <p style={{ color: "var(--text-primary)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "2px" }}>Drop image here or browse</p>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.75rem", fontWeight: 500 }}>Supports PNG, JPG, WEBP (Max 10MB)</p>
        <input type="file" style={{ display: "none" }} onChange={e => setImage(e.target.files[0])} />
        
        {image && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ 
            marginTop: "12px", padding: "6px 12px", background: "rgba(34,197,94,0.1)", 
            borderRadius: "99px", display: "flex", alignItems: "center", gap: "6px", color: "#16A34A"
          }}>
            <CheckCircle2 size={14} /> 
            <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{image.name}</span>
          </motion.div>
        )}
      </label>
    </motion.div>
  );

  const renderUrlInput = () => (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: "16px", width: "100%" }}>
      <div style={{ 
        position: "relative",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        borderRadius: "14px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02), 0 2px 6px rgba(0,0,0,0.02)",
        transition: "all 0.3s ease",
        padding: "2px"
      }}>
        <Link2 size={16} style={{ position: "absolute", left: "16px", top: "14px", color: "var(--text-tertiary)" }} />
        <input 
          type="text" 
          placeholder="Paste a news URL for verification..." 
          style={{ 
            width: "100%", padding: "12px 16px 12px 42px", border: "none", background: "transparent",
            outline: "none", fontSize: "0.9rem", color: "var(--text-primary)"
          }}
          value={url} 
          onChange={e => setUrl(e.target.value)} 
        />
      </div>
    </motion.div>
  );

  const modes = [
    { id: "text", title: "Text", desc: "Analyze article or claim", icon: FileText },
    { id: "image", title: "Image", desc: "Verify authenticity", icon: ImageIcon },
    { id: "url", title: "URL", desc: "Check a news link", icon: Link2 },
    { id: "multimodal", title: "Multimodal", desc: "Text + Image combined", icon: Layers }
  ];

  return (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ position: "relative", minHeight: "100vh", padding: "24px", overflowX: "hidden" }}
    >
      <FloatingParticle size="200px" x="-2%" y="5%" duration={20} delay={0} color="radial-gradient(circle, rgba(17,17,17,0.03), transparent)" />
      <FloatingParticle size="180px" x="80%" y="0%" duration={25} delay={2} color="radial-gradient(circle, rgba(17,17,17,0.02), transparent)" />
      
      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Hero Section */}
        <motion.div variants={itemVariants} style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ 
            display: "inline-flex", alignItems: "center", gap: "6px", 
            background: "rgba(17,17,17,0.04)", padding: "4px 12px", borderRadius: "99px",
            color: "var(--text-secondary)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
            marginBottom: "12px"
          }}>
            <Sparkles size={12} style={{ color: "#111" }} /> AI-Powered Verification
          </div>
          
          <h1 style={{ 
            fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, 
            color: "#111", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "12px",
            background: "linear-gradient(135deg, #000 0%, #444 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Detect Misinformation
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.5 }}>
            Cross-check claims, analyze images, and verify sources instantly.
          </p>
        </motion.div>

        {/* Central Layout Wrapper */}
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          
          {/* Detection Mode Cards */}
          <motion.div variants={itemVariants} style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "12px", 
            marginBottom: "16px",
            width: "100%"
          }}>
            {modes.map((m) => {
              const isActive = mode === m.id;
              return (
                <motion.div
                  key={m.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode(m.id)}
                  style={{
                    position: "relative",
                    background: "rgba(255,255,255,0.7)",
                    border: isActive ? "1px solid #111" : "1px solid var(--border-color)",
                    borderRadius: "14px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,1)" : "0 1px 4px rgba(0,0,0,0.02)",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  <div style={{ 
                    width: "32px", height: "32px", borderRadius: "8px", 
                    background: "var(--bg-secondary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <m.icon size={16} style={{ color: "#111" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {m.title}
                      {isActive && <CheckCircle2 size={14} color="#111" style={{ opacity: 0.9 }} />}
                    </h3>
                    <p style={{ fontSize: "0.7rem", color: isActive ? "var(--text-secondary)" : "var(--text-tertiary)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Input Workspace */}
          <motion.div variants={itemVariants} style={{ 
            background: "var(--bg-primary)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            border: "1px solid var(--border-color)",
            marginBottom: "24px",
            width: "100%"
          }}>
            
            <AnimatePresence mode="wait">
              {mode === "text" && renderTextArea()}
              {mode === "image" && renderImageUpload()}
              {mode === "url" && renderUrlInput()}
              {mode === "multimodal" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {renderTextArea()}
                  {renderImageUpload()}
                </motion.div>
              )}
            </AnimatePresence>
            
            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "10px 14px", background: "rgba(239,68,68,0.1)", borderRadius: "10px", color: "#DC2626", fontSize: "0.8rem", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={14} /> {error}
              </motion.div>
            )}

            {/* Feature Pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              {[
                { label: "Source Cross-Checking", icon: Globe },
                { label: "Explainable Results", icon: FileText },
                { label: "Secure & Private", icon: Lock }
              ].map((f, i) => (
                <div key={i} style={{ 
                  display: "flex", alignItems: "center", gap: "4px", 
                  padding: "6px 12px", borderRadius: "99px", background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                }}>
                  <f.icon size={12} /> {f.label}
                </div>
              ))}
            </div>
            
            {/* Analyze Button */}
            <motion.button 
              whileHover={{ scale: 1.01, boxShadow: "0 6px 16px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit} 
              disabled={loading} 
              style={{ 
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg, #111 0%, #27272A 100%)",
                color: "#fff", fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                opacity: loading ? 0.8 : 1, transition: "all 0.2s ease"
              }}
            >
              {loading ? (
                <><RefreshCcw size={16} className="spin" /> Processing Analysis...</>
              ) : (
                <><Sparkles size={16} /> Analyze Content <ArrowRight size={16} /></>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              style={{ 
                background: "var(--bg-primary)", borderRadius: "20px", padding: "28px", 
                boxShadow: "0 12px 32px rgba(0,0,0,0.06)", border: "1px solid var(--border-color)",
                marginBottom: "32px",
                maxWidth: "1100px",
                margin: "0 auto 32px"
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "0.9rem", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>AI Verdict</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.75rem", fontWeight: 800, color: result.prediction === "Fake" ? "#EF4444" : "#22C55E", lineHeight: 1 }}>{result.prediction}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", background: result.prediction === "Fake" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", padding: "4px 8px", borderRadius: "6px", color: result.prediction === "Fake" ? "#DC2626" : "#16A34A", fontSize: "0.8rem", fontWeight: 700 }}>
                      <Zap size={12} /> {result.confidence}% Confidence
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: "20px" }}>
                {result.explanation_summary && (
                  <div>
                    <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}><BrainCircuit size={14} /> Analysis Breakdown</h4>
                    <p style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "12px", fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.6 }}>{result.explanation_summary}</p>
                  </div>
                )}
                
                {result.text && (
                  <div>
                    <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}><FileText size={14} /> Source Content</h4>
                    <p style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "12px", fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.6, fontStyle: "italic", borderLeft: "3px solid var(--border-color)" }}>"{result.text}"</p>
                  </div>
                )}

                {(result.news_title || result.news_preview) && (
                  <div style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                    {result.news_title && <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "6px" }}>{result.news_title}</h4>}
                    {result.news_preview && <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{result.news_preview}</p>}
                  </div>
                )}

                {result.news_image && (
                  <div>
                    <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}><ImageIcon size={14} /> News Image</h4>
                    <img src={result.news_image} alt="news" style={{ width: "100%", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }} />
                  </div>
                )}

                {result.attention_heatmap && (
                  <div>
                    <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}><Activity size={14} /> AI Attention Map</h4>
                    <img src={`data:image/jpeg;base64,${result.attention_heatmap}`} alt="heatmap" style={{ width: "100%", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Recent Detections */}
        <motion.div variants={itemVariants} style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Recent Detections</h3>
            <span onClick={() => navigate("/history")} style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-tertiary)"}>
              View All <ChevronRight size={14} />
            </span>
          </div>
          
          {recentDetections.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
              {recentDetections.map((d, i) => {
                const isFake = d.result === "Fake";
                const color = isFake ? "#DC2626" : "#16A34A";
                const Icon = isFake ? AlertTriangle : CheckCircle2;
                const title = d.newsTitle || d.text || "Image Detection";
                
                return (
                  <div key={d._id || i} style={{ 
                    background: "var(--bg-primary)", padding: "14px 16px", borderRadius: "12px", 
                    border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "default"
                  }}>
                    <div style={{ background: `${color}15`, color: color, padding: "8px", borderRadius: "8px", flexShrink: 0 }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "3px" }} title={title}>{title}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ fontSize: "0.75rem", color: color, fontWeight: 700 }}>{d.result}</p>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", fontWeight: 600 }}>{Number(d.confidence || 0).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ 
              textAlign: "center", padding: "40px 20px", 
              background: "var(--bg-primary)", borderRadius: "16px", 
              border: "1px dashed var(--border-color)" 
            }}>
              <Inbox size={24} style={{ color: "var(--text-tertiary)", margin: "0 auto 12px", opacity: 0.5 }} />
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>No recent detections</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Your recent checks will appear here.</p>
            </div>
          )}
        </motion.div>
        
      </div>
    </motion.div>
  );
}