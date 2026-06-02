import { useEffect, useRef } from 'react';

// Very subtle animated particle network background (grayscale, low opacity)
// Inspired by simple canvas algorithms – no heavy libraries.
const AIBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.offsetWidth;
    const height = canvas.parentElement.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    const particles = [];
    const particleCount = Math.min(80, Math.floor((width * height) / 12000));
    
    const hubs = [];
    const numHubs = Math.max(5, Math.floor(particleCount / 8));
    for (let i = 0; i < numHubs; i++) {
      hubs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
      });
    }

    for (let i = 0; i < particleCount; i++) {
      const hubIndex = i % numHubs;
      const hub = hubs[hubIndex];
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 120;
      particles.push({
        x: hub.x + Math.cos(angle) * dist,
        y: hub.y + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: i < numHubs ? 2.5 : 1 + Math.random() * 1.5,
        hubIndex: hubIndex
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 0.8;

      // draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          // Only draw connections if they are close, or if they belong to the same hub
          if (dist < 100 || (dist < 160 && a.hubIndex === b.hubIndex)) {
            const lineOpacity = 0.5 * (1 - dist / (a.hubIndex === b.hubIndex ? 160 : 100));
            if (lineOpacity > 0) {
              ctx.strokeStyle = `rgba(0,0,0,${lineOpacity})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    const update = () => {
      hubs.forEach(h => {
        h.x += h.vx;
        h.y += h.vy;
        if (h.x < 0 || h.x > width) h.vx *= -1;
        if (h.y < 0 || h.y > height) h.vy *= -1;
      });

      particles.forEach((p, i) => {
        if (i < numHubs) {
          // Hubs follow their dedicated path
          p.x = hubs[i].x;
          p.y = hubs[i].y;
        } else {
          // Dendrites/Nodes spring towards their hub
          const h = hubs[p.hubIndex];
          const dx = h.x - p.x;
          const dy = h.y - p.y;
          p.vx += dx * 0.0002;
          p.vy += dy * 0.0002;
          p.vx *= 0.98; // smooth friction
          p.vy *= 0.98;
          
          p.x += p.vx;
          p.y += p.vy;
        }
      });
      draw();
    };

    const interval = setInterval(update, 30);
    return () => clearInterval(interval);
  }, []);

  // Position absolute, full size, behind content
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.18,
        zIndex: -1,
      }}
    />
  );
};

export default AIBackground;
