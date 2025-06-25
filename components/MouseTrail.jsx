import { useEffect, useRef } from 'react';

export default function MouseTrail() {
  const canvasRef = useRef(null);
  const points = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const trailLength = 30;
    let mouse = { x: width / 2, y: height / 2 };

    const addPoint = (x, y) => {
      points.current.push({ x, y, alpha: 1 });
      if (points.current.length > trailLength) points.current.shift();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i <points.current.length; i++) {
        const p = points.current[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(0, 0, 0, ${p.alpha})`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 10;
        ctx.fill();

        // уменьшаем альфу
        p.alpha *= 0.9;
      }

      requestAnimationFrame(animate);
    };

    const followMouse = (e) => {
      mouse.x += (e.clientX - mouse.x) * 0.2;
      mouse.y += (e.clientY - mouse.y) * 0.2;
      addPoint(mouse.x, mouse.y);
    };

    window.addEventListener('mousemove', followMouse);
    animate();

    return () => {
      window.removeEventListener('mousemove', followMouse);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
    />
  );
} 