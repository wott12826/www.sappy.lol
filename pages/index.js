import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

const lerp = (a, b, t) => a + (b - a) * t;

const CursorTrail = () => {
  const points = useRef(Array(20).fill({ x: 0, y: 0 }));
  const svgRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const update = () => {
      const mousePos = points.current[0];
      for (let i = 1; i < points.current.length; i++) {
        points.current[i] = {
          x: lerp(points.current[i].x, points.current[i-1].x, 0.25),
          y: lerp(points.current[i].y, points.current[i-1].y, 0.25)
        };
      }
      
      if (svgRef.current) {
        const path = svgRef.current.querySelector('path');
        if (path) {
          let d = `M ${points.current[0].x},${points.current[0].y}`;
          for (let i = 1; i < points.current.length - 1; i++) {
            const p1 = points.current[i];
            const p2 = points.current[i + 1];
            d += ` Q ${p1.x},${p1.y} ${(p1.x + p2.x) / 2},${(p1.y + p2.y) / 2}`;
          }
          path.setAttribute('d', d);
        }
      }
      
      animationFrameId = requestAnimationFrame(update);
    };

    const handleMouseMove = (e) => {
      points.current[0] = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 999}}>
      <path d="" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Компонент для загрузки и отображения glb-модели
function Model({ rotation = [0, 0, 0], ...props }) {
  const { scene } = useGLTF('/base_basic_shaded.glb')
  return <primitive object={scene} rotation={rotation} {...props} />
}

// Хук для drag-and-drop позиции
function useDraggable(initial = { x: 0, y: 0 }) {
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
  };
  const onMouseMove = (e) => {
    if (dragging) {
      setPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y
      });
    }
  };
  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  return { pos, onMouseDown };
}

export default function Home() {
  // Центрируем по умолчанию
  const center = { x: typeof window !== 'undefined' ? window.innerWidth/2 - 200 : 0, y: typeof window !== 'undefined' ? window.innerHeight/2 - 200 : 0 };
  const { pos, onMouseDown: onDragMouseDown } = useDraggable(center);
  const [angle, setAngle] = useState({ x: 0, y: 0 });
  const [rotating, setRotating] = useState(false);
  const last = useRef({ x: 0, y: 0 });

  // Отключаем контекстное меню
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // Начало вращения по левой кнопке
  const handleMouseDown = (e) => {
    if (e.button === 0) { // левая кнопка
      setRotating(true);
      last.current = { x: e.clientX, y: e.clientY };
    } else {
      onDragMouseDown(e);
    }
  };

  // Вращение по движению мыши
  const handleMouseMove = (e) => {
    if (rotating) {
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      setAngle(a => ({ x: a.x + dy * 0.01, y: a.y + dx * 0.01 }));
      last.current = { x: e.clientX, y: e.clientY };
    }
  };

  // Завершение вращения
  const handleMouseUp = (e) => {
    if (rotating) setRotating(false);
  };

  // Touch события для мобильных устройств
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) { // только один палец
      setRotating(true);
      last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (rotating && e.touches.length === 1) {
      e.preventDefault(); // предотвращаем скролл страницы
      const dx = e.touches[0].clientX - last.current.x;
      const dy = e.touches[0].clientY - last.current.y;
      setAngle(a => ({ x: a.x + dy * 0.01, y: a.y + dx * 0.01 }));
      last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e) => {
    if (rotating) setRotating(false);
  };

  useEffect(() => {
    if (rotating) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [rotating]);

  return (
    <>
      <Head>
        <title>Sappy</title>
        <meta name="description" content="Shaping the future of the internet." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-[#f5f5f5] text-black overflow-hidden">
        <CursorTrail />
        
        <div className="relative w-full h-screen flex items-center justify-center">
          {/* <img src="/seal.png" alt="Sappy Seal" className="w-48 h-auto" /> удалено по запросу */}
          {/* 3D модель с drag-and-drop */}
          <div
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              cursor: rotating ? 'grabbing' : 'grab',
              userSelect: 'none',
              overflow: 'visible',
              pointerEvents: 'auto',
            }}
          >
            <div style={{ width: 600, height: 600, overflow: 'visible', pointerEvents: 'auto' }}>
              <Canvas camera={{ position: [0, 0, 3.5] }} style={{ width: '100%', height: '100%', overflow: 'visible', background: 'transparent' }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={0.7} />
                <Model scale={1.0} rotation={[angle.x, angle.y, 0]} />
              </Canvas>
            </div>
          </div>
        </div>

        {/* Fixed Footer Navigation */}
        <footer className="fixed bottom-0 left-0 right-0 bg-[#f5f5f5] px-4 py-3">
          <div className="border-t border-black w-full"></div>
          <div className="max-w-screen-xl mx-auto flex justify-between items-center pt-3">
            <img src="/images/seals/mokz_logo.png" alt="Mokz Logo" className="h-6 w-auto" />
            <nav>
              <ul className="flex space-x-6 text-lg">
                <li>
                  <Link href="/" className="hover:underline underline">Home</Link>
                </li>
                <li>
                  <Link href="/seals" className="hover:underline">About</Link>
                </li>
                <li>
                  <Link href="/seals/staking/" className="hover:underline">Dashboard</Link>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </div>
    </>
  )
} 