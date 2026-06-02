import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AnalysisModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const isFake = data.result === "Fake";
  const isReal = data.result === "Real";
  const color = isFake ? '#EF4444' : (isReal ? '#22C55E' : '#FACC15');
  const icon = isFake ? "⚠" : (isReal ? "✓" : "?");

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      <div onClick={handleBackdropClick} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ width: '100%', maxWidth: '720px', maxHeight: '88vh', overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
        >
          {/* Header */}
          <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Detection Details</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px', display: 'flex' }}>
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Prediction + Confidence Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '1.05rem', fontWeight: 700, color }}>
                {icon} {data.result}
              </span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>{Number(data.confidence || 0).toFixed(1)}%</span>
                <span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginLeft: '6px', fontWeight: 500 }}>Confidence</span>
              </div>
            </div>

            {/* Explanation */}
            {(data.explanation || data.explanation_summary) && (
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>Why was this prediction made?</p>
                <div style={{ backgroundColor: '#FAFAF9', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{data.explanation || data.explanation_summary}</p>
                </div>
              </div>
            )}

            {/* Analyzed Content (text, no news) */}
            {data.text && !(data.newsTitle || data.news_title) && (
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>Analyzed Content</p>
                <div style={{ backgroundColor: '#FAFAF9', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{data.text}</p>
                </div>
              </div>
            )}

            {/* News Article */}
            {(data.newsTitle || data.news_title) && (
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>News Information</p>
                <div style={{ backgroundColor: '#FAFAF9', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '14px 16px' }}>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{data.newsTitle || data.news_title}</h4>
                  {(data.newsPreview || data.news_preview) && (
                    <p style={{ fontSize: '0.825rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{data.newsPreview || data.news_preview}</p>
                  )}
                </div>
              </div>
            )}

            {/* Original query below news when both exist */}
            {data.text && (data.newsTitle || data.news_title) && (
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>Analyzed Content</p>
                <div style={{ backgroundColor: '#FAFAF9', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.65, margin: 0 }}>{data.text}</p>
                </div>
              </div>
            )}

            {/* News Image (standalone, no heatmap) */}
            {(data.newsImage || data.news_image) && !data.attention_heatmap && (
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>News Image</p>
                <img src={data.newsImage || data.news_image} alt="News" style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E5E7EB' }} />
              </div>
            )}

            {/* Heatmap / Image Comparison */}
            {data.attention_heatmap && (
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>AI Attention Map</p>
                <div style={{ display: 'grid', gridTemplateColumns: (data.newsImage || data.news_image) ? '1fr 1fr' : '1fr', gap: '12px' }}>
                  {(data.newsImage || data.news_image) && (
                    <div>
                      <p style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 600, marginBottom: '6px' }}>Original Image</p>
                      <img src={data.newsImage || data.news_image} alt="Original" style={{ width: '100%', borderRadius: '10px', border: '1px solid #E5E7EB' }} />
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 600, marginBottom: '6px' }}>Grad-CAM</p>
                    <img src={`data:image/jpeg;base64,${data.attention_heatmap}`} alt="Heatmap" style={{ width: '100%', borderRadius: '10px', border: '1px solid #E5E7EB' }} />
                  </div>
                </div>
                <p style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '8px' }}>Highlighted areas indicate regions that influenced the model's decision.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #D1D5DB', backgroundColor: '#fff', fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
