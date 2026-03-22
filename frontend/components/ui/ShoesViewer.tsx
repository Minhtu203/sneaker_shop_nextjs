'use client';
import React, { useEffect, useMemo, useRef } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean | string;
        'camera-controls'?: boolean | string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        exposure?: string;
        'environment-image'?: string;
      };
    }
  }
}

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
    import('@google/model-viewer');

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

  return (
    <div className="w-full h-full bg-none rounded-2xl overflow-hidden" style={{ cursor: 'none' }}>
      <model-viewer
        ref={modelRef}
        src="/sneaker-3d-model.glb"
        alt="3D Sneaker"
        auto-rotate
        camera-controls
        style={modelStyle}
        shadow-intensity="1.5"
        shadow-softness="1"
        exposure="1"
        environment-image="neutral"
      ></model-viewer>
    </div>
  );
};
