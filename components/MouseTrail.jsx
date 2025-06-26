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
    const MAX_TRAIL = 100; // Увеличиваем для более длинной полосы
    let mouse = { x: width / 2, y: height / 2 };
    let lastMouseMove = Date.now();
    let idleTime = 0;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMouseMove = Date.now();
      idleTime = 0;
    };

    function lerp(a, b, n) {
      return (1 - n) * a + n * b;
    }

    // Функция для рисования непрерывной полосы
    function drawContinuousStripe() {
      if (trail.length < 2) return;

      ctx.save();
      
      // Рисуем основную полосу
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      
      // Используем кривую Безье для плавности
      for (let i = 1; i < trail.length - 1; i++) {
        const current = trail[i];
        const next = trail[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      
      // Завершаем путь
      if (trail.length > 1) {
        ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      }
      
      // Убираем градиент, используем сплошной цвет
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      // Добавляем внутреннюю полосу для объема
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      
      for (let i = 1; i < trail.length - 1; i++) {
        const current = trail[i];
        const next = trail[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      
      if (trail.length > 1) {
        ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      }
      
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      ctx.restore();
    }

    let last = { x: mouse.x, y: mouse.y };

    function animate() {
      requestAnimationFrame(animate);

      const now = Date.now();
      idleTime = now - lastMouseMove;

      // Хаотичное движение при бездействии по всему экрану
      if (idleTime > 1000) { // После 1 секунды бездействия
        // Создаем более активное движение по всему экрану
        const time = now * 0.001;
        
        // Комбинируем несколько синусоид для более сложного движения
        const chaosX = Math.sin(time * 0.5) * width * 0.4 + 
                      Math.cos(time * 0.3) * width * 0.2 + 
                      Math.sin(time * 0.7) * width * 0.1;
        const chaosY = Math.cos(time * 0.4) * height * 0.4 + 
                      Math.sin(time * 0.6) * height * 0.2 + 
                      Math.cos(time * 0.2) * height * 0.1;
        
        // Плавно перемещаем к целевой точке
        const targetX = width * 0.5 + chaosX;
        const targetY = height * 0.5 + chaosY;
        
        mouse.x = lerp(mouse.x, targetX, 0.02);
        mouse.y = lerp(mouse.y, targetY, 0.02);
        
        // Добавляем небольшую случайность для более естественного движения
        mouse.x += (Math.random() - 0.5) * 2;
        mouse.y += (Math.random() - 0.5) * 2;
        
        // Ограничиваем движение в пределах экрана с небольшим отступом
        const margin = 50;
        mouse.x = Math.max(margin, Math.min(width - margin, mouse.x));
        mouse.y = Math.max(margin, Math.min(height - margin, mouse.y));
      }

      last.x = lerp(last.x, mouse.x, 0.1); // Более плавное движение
      last.y = lerp(last.y, mouse.y, 0.1);
      
      trail.push({ 
        x: last.x, 
        y: last.y,
        time: now
      });

      if (trail.length > MAX_TRAIL) trail.shift();

      ctx.clearRect(0, 0, width, height);

      // Рисуем непрерывную полосу
      drawContinuousStripe();
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
      className="pointer-events-none fixed top-0 left-0 z-[1]"
    />
  );
} 