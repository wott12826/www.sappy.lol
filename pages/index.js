import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import CursorTrail from '../components/CursorTrail'

const lerp = (a, b, t) => a + (b - a) * t;

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <link rel="icon" href="/images/seals/Monkz_logo.png" />
        <meta property="og:image" content="/images/seals/Monkz_logo.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="824" />
        <meta property="og:image:height" content="609" />
        <meta property="og:image:alt" content="Monkz logo" />
        <meta name="twitter:image" content="/images/seals/Monkz_logo.png" />
        <meta name="twitter:image:alt" content="Monkz logo" />
      </Head>
      
      <div className="min-h-screen bg-[#f5f5f5] text-black overflow-hidden">
        <CursorTrail />
        
        {/* Мобильная навигация */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#f5f5f5]/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <img src="/images/seals/mokz_logo.png" alt="Mokz Logo" className="h-8 w-auto" />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-black p-2"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
              </svg>
            </button>
          </div>
          
          {/* Мобильное меню */}
          {mobileMenuOpen && (
            <div className="bg-[#f5f5f5]/95 backdrop-blur-sm border-t border-black/20">
              <nav className="px-4 py-3">
                <ul className="flex flex-col space-y-3">
                  <li>
                    <Link href="/" className="block text-lg font-semibold hover:underline underline">Home</Link>
                  </li>
                  <li>
                    <Link href="/seals" className="block text-lg font-semibold hover:underline">About</Link>
                  </li>
                  <li>
                    <Link href="/seals/staking/" className="block text-lg font-semibold hover:underline">Dashboard</Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
        
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

        {/* Fixed Footer Navigation - только для десктопа */}
        <footer className="hidden lg:block fixed bottom-0 left-0 right-0 bg-[#f5f5f5] px-4 py-3 z-40">
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