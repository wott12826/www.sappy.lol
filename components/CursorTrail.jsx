import { useEffect } from "react";

export default function CursorTrail() {
  useEffect(() => {
    const trailLength = 20;
    const dots = [];
    let hasMoved = false;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Генерация точек
    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement("div");
      dot.classList.add("cursor-dot");
      document.body.appendChild(dot);
      dots.push({
        el: dot,
        x: mouse.x,
        y: mouse.y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
      });
    }

    // Обновление позиции мыши
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      hasMoved = true;
    };
    window.addEventListener("mousemove", onMove);

    // Анимация
    let running = true;
    function animate() {
      let x = mouse.x;
      let y = mouse.y;

      dots.forEach((dot) => {
        if (hasMoved) {
          dot.x += (x - dot.x) * 0.3;
          dot.y += (y - dot.y) * 0.3;
          x = dot.x;
          y = dot.y;
        } else {
          dot.x += dot.vx;
          dot.y += dot.vy;
          if (dot.x < 0 || dot.x > window.innerWidth) dot.vx *= -1;
          if (dot.y < 0 || dot.y > window.innerHeight) dot.vy *= -1;
        }
        dot.el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
      });

      if (running) requestAnimationFrame(animate);
    }
    animate();

    // Очистка
    return () => {
      running = false;
      window.removeEventListener("mousemove", onMove);
      dots.forEach((dot) => dot.el.remove());
    };
  }, []);

  return null;
} 