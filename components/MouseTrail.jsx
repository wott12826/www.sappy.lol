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
    const MAX_TRAIL = 35;
    let mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    function lerp(a, b, n) {
      return (1 - n) * a + n * b;
    }

    // Функция для создания кистевого мазка
    function drawBrushStroke(x, y, size, opacity, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Основной мазок кисти
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity * 0.8})`);
      gradient.addColorStop(0.3, `rgba(0, 0, 0, ${opacity * 0.6})`);
      gradient.addColorStop(0.7, `rgba(0, 0, 0, ${opacity * 0.3})`);
      gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
      
      ctx.fillStyle = gradient;
      
      // Рисуем эллиптический мазок
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.5, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Добавляем текстуру кисти (несколько маленьких мазков)
      for (let i = 0; i < 3; i++) {
        const offsetX = (Math.random() - 0.5) * size * 0.8;
        const offsetY = (Math.random() - 0.5) * size * 0.3;
        const smallSize = size * (0.3 + Math.random() * 0.4);
        
        ctx.beginPath();
        ctx.ellipse(offsetX, offsetY, smallSize, smallSize * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.4})`;
        ctx.fill();
      }
      
      ctx.restore();
    }

    let last = { x: mouse.x, y: mouse.y };

    function animate() {
      requestAnimationFrame(animate);

      last.x = lerp(last.x, mouse.x, 0.12);
      last.y = lerp(last.y, mouse.y, 0.12);

      // Добавляем случайный угол для каждого мазка
      const angle = Math.atan2(mouse.y - last.y, mouse.x - last.x) + (Math.random() - 0.5) * 0.5;
      
      trail.push({ 
        x: last.x, 
        y: last.y, 
        angle: angle,
        size: 15 + Math.random() * 10 // Случайный размер
      });

      if (trail.length > MAX_TRAIL) trail.shift();

      ctx.clearRect(0, 0, width, height);

      // Рисуем след кисти
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const opacity = (i / trail.length) * 0.7; // Максимальная прозрачность 70%
        const size = p.size * (1 - i / trail.length * 0.5); // Размер уменьшается медленнее
        
        if (opacity > 0.01) { // Рисуем только видимые мазки
          drawBrushStroke(p.x, p.y, size, opacity, p.angle);
        }
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