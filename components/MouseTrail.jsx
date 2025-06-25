import { useEffect, useRef } from 'react';

export default function MouseTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    let trail = [];
    const MAX_TRAIL = 40;
    let mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    function lerp(a, b, n) {
      return (1 - n) * a + n * b;
    }

    let last = { x: mouse.x, y: mouse.y };

    function animate() {
      requestAnimationFrame(animate);

      last.x = lerp(last.x, mouse.x, 0.15);
      last.y = lerp(last.y, mouse.y, 0.15);

      trail.push({ x: last.x, y: last.y });

      if (trail.length > MAX_TRAIL) trail.shift();

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const opacity = i / trail.length;
        const size = 20 * (1 - i / trail.length); // уменьшается с затуханием

        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.5})`;
        ctx.ellipse(p.x, p.y, size * 1.4, size * 0.6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    document.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <canvas
      id="cursor-trail"
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
    />
  );
} 