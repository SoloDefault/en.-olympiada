import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PromoStage, PROMO_LEN } from '../promo/PromoStage';

// /promo — přehraje video v prohlížeči (fallback pro záznam obrazovky). ?t=12 zastaví na čase.
export default function Promo() {
  const loc = useLocation();
  const fixed = new URLSearchParams(loc.search).get('t');
  const [t, setT] = useState(fixed ? parseFloat(fixed) : 0);
  const [scale, setScale] = useState(1);
  const start = useRef(performance.now());
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);
  useEffect(() => {
    if (fixed) return;
    let id = 0;
    const loop = (now: number) => { const s = (now - start.current) / 1000; setT(Math.min(s, PROMO_LEN)); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [fixed]);
  return (
    <div onClick={() => { start.current = performance.now(); }} style={{ position: 'fixed', inset: 0, background: '#000', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
      <div style={{ width: 1920 * scale, height: 1080 * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}><PromoStage t={fixed ? parseFloat(fixed) : t} /></div>
      </div>
    </div>
  );
}
