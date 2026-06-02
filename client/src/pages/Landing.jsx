import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MatteOrb from "../components/MatteOrb";
import {
  ShieldCheck, Zap, Brain, Search, ImageIcon, Link2, Layers,
  ChevronRight, Star, BarChart2, Lock
} from "lucide-react";

/* ─── Fade-in on scroll helper ─── */
const FadeIn = ({ children, delay = 0, y = 24 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-secondary)", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2l7 3v5c0 5-3.8 9.7-7 12-3.2-2.3-7-7-7-12V5l7-3z"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>Vaarta AI</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/login" className="landing-nav-btn landing-nav-btn--outline">Login</Link>
          <Link to="/register" className="landing-nav-btn landing-nav-btn--filled">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <motion.div className="landing-hero__text" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 9999, border: "1px solid var(--border-color)", backgroundColor: "var(--bg-primary)", marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "var(--accent-green)", display: "inline-block" }}></span>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)" }}>AI-Powered Detection — Live</span>
          </div>

          <h1 className="landing-hero__title">
            Verify the truth<br />in milliseconds.
          </h1>
          <p className="landing-hero__subtitle">
            vaarta AI uses state-of-the-art multimodal neural architectures to instantly detect misinformation across articles, URLs, and images — built for modern newsrooms and critical thinkers.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link to="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 10, fontWeight: 700, backgroundColor: "var(--accent-blue)", color: "white", fontSize: "1.05rem", textDecoration: "none" }}>
              Start for free <ChevronRight size={18} />
            </Link>
            <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 10, fontWeight: 600, border: "1px solid var(--border-color)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "1.05rem", textDecoration: "none" }}>
              Sign in
            </Link>
          </div>

          <div className="landing-hero__stats">
            {[["99.2%", "Accuracy"], ["<500ms", "Response time"], ["3 Modes", "Text · Image · URL"]].map(([val, lbl]) => (
              <div key={lbl}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)" }}>{val}</p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500, marginTop: 2 }}>{lbl}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="landing-hero__orb" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1 }}>
          <MatteOrb />
        </motion.div>
      </section>

      {/* ── Detection Modes ── */}
      <section style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-blue)", marginBottom: 12 }}>What we detect</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>Three ways to verify any claim</h2>
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto" }}>Submit any form of media and receive a confidence-scored verdict in under a second.</p>
            </div>
          </FadeIn>

          <div className="landing-modes-grid">
            {[
              { icon: <Search size={28} />, accent: "var(--accent-blue)", bg: "rgba(37,99,235,0.08)", title: "Text Analysis", desc: "Paste any article, headline, or social media post. Our NLP model evaluates linguistic patterns, factual inconsistencies, and sensationalism cues." },
              { icon: <ImageIcon size={28} />, accent: "var(--accent-orange)", bg: "rgba(251,146,60,0.08)", title: "Image Verification", desc: "Upload photos to detect AI-generated images, deepfakes, or manipulated visuals using gradient-class activation maps (GradCAM)." },
              { icon: <Link2 size={28} />, accent: "var(--accent-green)", bg: "rgba(34,197,94,0.08)", title: "URL Scraping", desc: "Drop any news URL and we automatically scrape, parse, and run full content analysis — no copy-pasting required." },
              { icon: <Layers size={28} />, accent: "#8B5CF6", bg: "rgba(139,92,246,0.08)", title: "Multimodal Fusion", desc: "Combine text and image inputs for our most powerful detection mode. Cross-modal reasoning catches subtle inconsistencies both models miss alone." },
            ].map(({ icon, accent, bg, title, desc }) => (
              <FadeIn key={title} delay={0.1}>
                <motion.div whileHover={{ y: -4 }} style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 24, boxShadow: "var(--shadow-sm)", height: "100%", boxSizing: "border-box" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: bg, color: accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{icon}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", marginBottom: 12, letterSpacing: "-0.02em" }}>{title}</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, fontSize: "0.9rem" }}>{desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

     {/* ── Why it matters ── */}
<section style={{ padding: "100px 24px" }}>
  <div style={{ maxWidth: 1200, margin: "0 auto" }}>

    <FadeIn>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--accent-orange)",
            marginBottom: 12,
          }}
        >
          Why it matters
        </p>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: 20,
          }}
        >
          Misinformation is an engineering problem.
        </h2>

        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            maxWidth: 750,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          In 2024, over 60% of shared online content contained misleading claims.
          Vaarta AI treats this as a data problem — applying rigorous ML pipelines
          to restore trust in information at scale.
        </p>
      </div>
    </FadeIn>

    <div className="landing-modes-grid">
      {[
        {
          icon: <Brain size={24} />,
          accent: "var(--accent-blue)",
          bg: "rgba(37,99,235,0.08)",
          title: "Neural Confidence Scoring",
          desc: "Every verdict includes a confidence percentage so you understand the model's certainty, not just the label."
        },
        {
          icon: <BarChart2 size={24} />,
          accent: "var(--accent-green)",
          bg: "rgba(34,197,94,0.08)",
          title: "Personal Analytics Dashboard",
          desc: "Track detection patterns over time with weekly trend charts, fake vs real ratios, and historical records."
        },
        {
          icon: <Lock size={24} />,
          accent: "var(--accent-red)",
          bg: "rgba(239,68,68,0.08)",
          title: "Private & Secure",
          desc: "Your detections are stored securely in your private workspace. Admins get a birds-eye view with full access controls."
        },
        {
          icon: <Star size={24} />,
          accent: "#8B5CF6",
          bg: "rgba(139,92,246,0.08)",
          title: "Explainable AI",
          desc: "See GradCAM heatmaps and model score breakdowns — not just a verdict, but the reasoning behind it."
        },
      ].map(({ icon, accent, bg, title, desc }) => (
        <FadeIn key={title} delay={0.1}>
          <motion.div
            whileHover={{ y: -4 }}
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: 16,
              padding: 24,
              boxShadow: "var(--shadow-sm)",
              height: "100%",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: bg,
                color: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              {icon}
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.1rem",
                marginBottom: 10,
              }}
            >
              {title}
            </h3>

            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                fontSize: "0.92rem",
              }}
            >
              {desc}
            </p>
          </motion.div>
        </FadeIn>
      ))}
    </div>

  </div>
</section>
      {/* ── CTA Banner ── */}
      <section style={{ backgroundColor: "var(--text-primary)", padding: "24px 24px" }}>
        <FadeIn>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, color: "white", letterSpacing: "-0.03em", marginBottom: 16 }}>
              Stop guessing. Start knowing.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.1rem", marginBottom: 40, lineHeight: 1.6 }}>
              Join thousands of researchers, journalists, and analysts who use Vaarta AI to protect themselves from misinformation every day.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/register" style={{ padding: "16px 36px", borderRadius: 10, fontWeight: 700, backgroundColor: "white", color: "var(--text-primary)", fontSize: "1.05rem", textDecoration: "none" }}>
                Create a free account
              </Link>
              <Link to="/login" style={{ padding: "16px 36px", borderRadius: 10, fontWeight: 600, border: "1px solid rgba(255,255,255,0.3)", color: "white", fontSize: "1.05rem", textDecoration: "none" }}>
                Sign in
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2l7 3v5c0 5-3.8 9.7-7 12-3.2-2.3-7-7-7-12V5l7-3z"/></svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Vaarta AI</span>
        </div>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem" }}>© 2026 Vaarta AI. All rights reserved.</p>
        <div style={{ display: "flex", gap: 24 }}>
          <Link to="/login" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none", fontWeight: 500 }}>Login</Link>
          <Link to="/register" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none", fontWeight: 500 }}>Sign Up</Link>
        </div>
      </footer>

    </div>
  );
}
