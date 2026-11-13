// Sdílené prvky videa: barvy, animace, typografie, rámeček prohlížeče
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

export const C = { bg: '#0B0B0D', card: '#17171A', card2: '#202024', y: '#FFC531', mut: '#A1A1AA', red: '#EF4444', grn: '#22C55E', blue: '#3B82F6', purple: '#8B5CF6', teal: '#14B8A6', orange: '#F97316' };
export const FONT = '"Montserrat", sans-serif';

export const useF = () => useCurrentFrame();
export function useSp(delay = 0, cfg: { damping?: number; mass?: number; stiffness?: number } = {}) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 15, mass: 0.9, stiffness: 120, ...cfg } });
}
export const lin = (f: number, a: number, b: number, from = 0, to = 1, ease = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

// vstup/výstup celé scény
export function SceneWrap({ dur, children, bg }: { dur: number; children: ReactNode; bg?: string }) {
  const f = useCurrentFrame();
  const o = Math.min(lin(f, 0, 10), lin(f, dur - 10, dur, 1, 0, Easing.in(Easing.cubic)));
  const s = interpolate(f, [0, dur], [1.0, 1.035]);
  return (
    <AbsoluteFill style={{ opacity: o, background: bg }}>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
}

export function Icon({ name, size, style }: { name: string; size: number; style?: CSSProperties }) {
  return <Img src={staticFile(`icons/${name}.png`)} style={{ width: size, height: size, objectFit: 'contain', filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.55))', ...style }} />;
}

export const T = (p: { children: ReactNode; size?: number; w?: number; color?: string; style?: CSSProperties }) => (
  <div style={{ fontFamily: FONT, fontSize: p.size ?? 80, fontWeight: p.w ?? 800, color: p.color ?? '#fff', letterSpacing: '-0.025em', lineHeight: 1.08, ...p.style }}>{p.children}</div>
);

// vyjetí zdola
export function Rise({ d = 0, children, style, y = 60 }: { d?: number; children: ReactNode; style?: CSSProperties; y?: number }) {
  const p = useSp(d, { damping: 18 });
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * y}px)`, ...style }}>{children}</div>;
}
export function Pop({ d = 0, children, style }: { d?: number; children: ReactNode; style?: CSSProperties }) {
  const p = useSp(d, { damping: 11, stiffness: 140 });
  return <div style={{ opacity: Math.min(1, p * 2), transform: `scale(${0.3 + 0.7 * p})`, ...style }}>{children}</div>;
}

export const fmt = (n: number, d = 0) => n.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });
export function Count({ from = 0, to, a, b, d = 0, suffix = ' €', style }: { from?: number; to: number; a: number; b: number; d?: number; suffix?: string; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const v = interpolate(f, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{fmt(v, d)}{suffix}</span>;
}

// jemné pozadí: mřížka + záře
export function Backdrop({ glow = C.y, x = 70, y = 20 }: { glow?: string; x?: number; y?: number }) {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }} />
      <div style={{ position: 'absolute', width: 1400, height: 1400, borderRadius: '50%', left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) translate(${Math.sin(f / 60) * 40}px, ${Math.cos(f / 70) * 30}px)`, background: `radial-gradient(circle, ${glow}22, transparent 60%)` }} />
    </AbsoluteFill>
  );
}

export function Chip({ children, color = C.y, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return <div style={{ fontFamily: FONT, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '14px 28px', borderRadius: 999, background: `${color}22`, color, fontWeight: 700, fontSize: 34, border: `2px solid ${color}55`, ...style }}>{children}</div>;
}

// rámeček prohlížeče se screenshotem a „kamerou“ (zoom na bod)
export function Browser({ src, w, h, zoom = 1, fx = 0.5, fy = 0.5, url = 'fersit.energia', children, style }: { src: string; w: number; h: number; zoom?: number; fx?: number; fy?: number; url?: string; children?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ width: w, borderRadius: 28, overflow: 'hidden', background: '#1c1c20', boxShadow: '0 60px 140px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)', ...style }}>
      <div style={{ height: 54, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', background: '#232327' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{ width: 15, height: 15, borderRadius: 8, background: c }} />)}
        <div style={{ marginLeft: 24, flex: 1, maxWidth: 520, height: 32, borderRadius: 10, background: '#151518', color: C.mut, fontFamily: FONT, fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
          <svg width="14" height="16" viewBox="0 0 14 16"><rect x="1" y="7" width="12" height="9" rx="2" fill="#A1A1AA" /><path d="M4 7V5a3 3 0 0 1 6 0v2" stroke="#A1A1AA" strokeWidth="2" fill="none" /></svg>{url}</div>
      </div>
      <div style={{ position: 'relative', height: h, overflow: 'hidden' }}>
        <Img src={staticFile(src)} style={{ position: 'absolute', width: '100%', transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${zoom})` }} />
        {children}
      </div>
    </div>
  );
}
