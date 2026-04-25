/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useMemo, useRef } from 'react';

export const ShoeViewer = () => {
  const modelRef = useRef<HTMLElement>(null);

  const modelStyle = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      cursor: 'none',
    }),
    []
  );

  useEffect(() => {
    const loadModelViewer = async () => {
      await import('@google/model-viewer');

      if (modelRef.current?.shadowRoot) {
        const style = document.createElement('style');
        style.textContent = `
          :host, #interaction-canvas, canvas, .interaction-canvas, * {
            cursor: none !important;
          }
        `;
        modelRef.current.shadowRoot.appendChild(style);
      }
    };

    loadModelViewer();
  }, []);

  // Ép kiểu thẻ thành 'any' để bỏ qua kiểm tra thuộc tính
  const ModelViewerTag = 'model-viewer' as any;

  return (
    <div className="w-full h-full bg-none rounded-2xl overflow-hidden" style={{ cursor: 'none' }}>
      <ModelViewerTag
        ref={modelRef}
        src="/sneaker-3d-model.glb"
        alt="3D Sneaker"
        auto-rotate=""
        camera-controls=""
        style={modelStyle}
        shadow-intensity="1.5"
        shadow-softness="1"
        exposure="1"
        environment-image="neutral"
      />
    </div>
  );
};

export default ShoeViewer;
