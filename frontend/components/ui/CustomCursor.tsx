'use client';
import { useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: PointerEvent) => {
      cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
    };

    const handlePointerOut = () => {
      if (cursor) cursor.style.opacity = '0'; // Ẩn đi khi ra ngoài
    };

    const handlePointerOver = () => {
      if (cursor) cursor.style.opacity = '1'; // Hiện lại khi quay vào
    };

    window.addEventListener('pointermove', moveCursor, { passive: true });
    document.addEventListener('pointerleave', handlePointerOut);
    document.addEventListener('pointerenter', handlePointerOver);

    return () => {
      window.removeEventListener('pointermove', moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-5 h-5 pointer-events-none z-[99999] rounded-full border border-black bg-white/10 backdrop-blur-[2px] shadow-sm"
      style={{
        willChange: 'transform',
        transition: 'none',
        backfaceVisibility: 'hidden',
      }}
    />
  );
};
