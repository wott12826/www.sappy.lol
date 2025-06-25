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
    const MAX_TRAIL = 80; // Очень длинный след
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

    // Функция для создания кистевого мазка с заостренным концом
    function drawBrushStroke(x, y, size, opacity, angle, isEnd = false) {
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
      
      // Рисуем эллиптический мазок - делаем заостренным к концу
      ctx.beginPath();
      if (isEnd) {
        // Заостренный конец следа
        ctx.ellipse(0, 0, size * 0.8, size * 0.2, 0, 0, Math.PI * 2);
      } else {
        // Обычный мазок
        ctx.ellipse(0, 0, size * 2.2, size * 0.6, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      
      // Добавляем текстуру кисти (несколько маленьких мазков)
      const textureCount = isEnd ? 2 : 4;
      for (let i = 0; i < textureCount; i++) {
        const offsetX = (Math.random() - 0.5) * size * (isEnd ? 0.6 : 1.2);
        const offsetY = (Math.random() - 0.5) * size * (isEnd ? 0.2 : 0.4);
        const smallSize = size * (isEnd ? 0.2 + Math.random() * 0.3 : 0.4 + Math.random() * 0.6);
        
        ctx.beginPath();
        ctx.ellipse(offsetX, offsetY, smallSize, smallSize * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.4})`;
        ctx.fill();
      }
      
      ctx.restore();
    }

    let last = { x: mouse.x, y: mouse.y };

    function animate() {
      requestAnimationFrame(animate);

      const now = Date.now();
      idleTime = now - lastMouseMove;

      // Хаотичное движение при бездействии
      if (idleTime > 1000) { // После 1 секунды бездействия
        const chaos = Math.sin(now * 0.003) * 50 + Math.cos(now * 0.002) * 30;
        const chaos2 = Math.sin(now * 0.004) * 40 + Math.cos(now * 0.001) * 25;
        
        mouse.x += chaos * 0.01;
        mouse.y += chaos2 * 0.01;
        
        // Ограничиваем движение в пределах экрана
        mouse.x = Math.max(0, Math.min(width, mouse.x));
        mouse.y = Math.max(0, Math.min(height, mouse.y));
      }

      last.x = lerp(last.x, mouse.x, 0.08); // Более плавное движение
      last.y = lerp(last.y, mouse.y, 0.08);

      // Добавляем случайный угол для каждого мазка
      const angle = Math.atan2(mouse.y - last.y, mouse.x - last.x) + (Math.random() - 0.5) * 0.8;
      
      trail.push({ 
        x: last.x, 
        y: last.y, 
        angle: angle,
        size: 25 + Math.random() * 15,
        time: now
      });

      if (trail.length > MAX_TRAIL) trail.shift();

      ctx.clearRect(0, 0, width, height);

      // Рисуем след кисти с заостренным концом
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const progress = i / trail.length;
        const opacity = progress * 0.8; // Максимальная прозрачность 80%
        
        // Размер уменьшается к концу следа
        const sizeMultiplier = 1 - progress * 0.7; // Сохраняем 30% размера в конце
        const size = p.size * sizeMultiplier;
        
        // Определяем, является ли это концом следа
        const isEnd = i === trail.length - 1;
        
        if (opacity > 0.01 && size > 1) { // Рисуем только видимые мазки
          drawBrushStroke(p.x, p.y, size, opacity, p.angle, isEnd);
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