import { useEffect, useRef, useState, createContext, useContext, type ReactNode } from 'react';
import { animate, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { bandOf, type Band, type Persona } from '../model';

// ---------- formátování ----------
export const eur = (n: number, d = 0) =>
  n.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' €';
export const num = (n: number, d = 0) => n.toLocaleString('cs-CZ', { minimumFractionDigits: d, maximumFractionDigits: d });

export const BAND_COLOR: Record<Band, string> = { green: '#22C55E', yellow: '#FACC15', red: '#EF4444' };

// ---------- persona context ----------
const Ctx = createContext<{ persona: Persona; setPersona: (p: Persona) => void }>({ persona: 'marie', setPersona: () => {} });
export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>('marie');
  return <Ctx.Provider value={{ persona, setPersona }}>{children}</Ctx.Provider>;
}
export const usePersona = () => useContext(Ctx);

// ---------- aktuální hodina (demo override ?hour=19) ----------
export function useHour() {
  const loc = useLocation();
  const q = new URLSearchParams(loc.search || window.location.search).get('hour');
  const [h, setH] = useState(new Date().getHours());
  useEffect(() => { const id = setInterval(() => setH(new Date().getHours()), 60000); return () => clearInterval(id); }, []);
  const o = q !== null ? parseInt(q, 10) : NaN;
  return Number.isFinite(o) ? ((o % 24) + 24) % 24 : h;
}

// ---------- vlastní 3D ikony (public/icons/*.png) ----------
export type IconName = 'marie' | 'novakovi' | 'firma' | 'semafor' | 'jistic' | 'pripojeni' | 'ostrov' | 'stat' | 'obyvatele' | 'prumysl' | 'priroda' | 'spirala' | 'elektromer';
export function Icon({ name, size = 56, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <img src={`icons/${name}.png`} alt="" draggable={false} width={size} height={size}
      className={`shrink-0 select-none ${className}`}
      style={{ width: size, height: size, objectFit: 'contain', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.35))' }} />
  );
}

// barevná tečka semaforu (místo emoji)
export function Dot({ band, size = 12, glow = false }: { band: Band; size?: number; glow?: boolean }) {
  return <span className="inline-block rounded-full shrink-0" style={{ width: size, height: size, background: BAND_COLOR[band], boxShadow: glow ? `0 0 ${size}px ${BAND_COLOR[band]}` : 'none' }} />;
}

// ✓ / ! / ✕ značky (SVG)
export function Mark({ kind, size = 34 }: { kind: 'ok' | 'warn' | 'no'; size?: number }) {
  const c = kind === 'ok' ? '#22C55E' : kind === 'warn' ? '#FACC15' : '#EF4444';
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" className="inline-block">
      <circle cx="17" cy="17" r="16" fill={c} opacity="0.18" />
      <circle cx="17" cy="17" r="16" fill="none" stroke={c} strokeWidth="2" />
      {kind === 'ok' && <path d="M10 17.5l4.6 4.5L24 12.5" fill="none" stroke={c} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />}
      {kind === 'warn' && <><path d="M17 9.5v9" stroke={c} strokeWidth="3.2" strokeLinecap="round" /><circle cx="17" cy="24" r="2" fill={c} /></>}
      {kind === 'no' && <path d="M11.5 11.5l11 11M22.5 11.5l-11 11" stroke={c} strokeWidth="3.2" strokeLinecap="round" />}
    </svg>
  );
}

// ---------- count-up ----------
export function CountUp({ value, d = 0, suffix = ' €', duration = 0.8, className }: { value: number; d?: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);
  useEffect(() => {
    const c = animate(prev.current, value, {
      duration, ease: 'easeOut',
      onUpdate: (v) => { if (ref.current) ref.current.textContent = num(v, d) + suffix; },
    });
    prev.current = value;
    return () => c.stop();
  }, [value, d, suffix, duration]);
  return <span ref={ref} className={className}>{num(0, d) + suffix}</span>;
}

// ---------- layout ----------
export const Page = ({ children }: { children: ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-5 md:p-8 max-w-[1400px] mx-auto w-full pb-28">
    {children}
  </motion.div>
);
export const H1 = ({ children, icon }: { children: ReactNode; icon?: IconName }) => (
  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 flex items-center gap-4">
    {icon && <Icon name={icon} size={64} />}{children}
  </h1>
);

export function ArrowBtn({ to, dark }: { to?: string; dark?: boolean }) {
  const cls = `grid place-items-center w-11 h-11 rounded-full text-xl font-bold shrink-0 ${dark ? 'bg-black/25 text-white' : 'bg-yellow text-black'}`;
  return to ? <Link to={to} className={cls}>→</Link> : <span className={cls}>→</span>;
}

export function GradCard({ to, title, line, grad, icon }: { to: string; title: string; line: string; grad: string; icon: IconName }) {
  return (
    <Link to={to}>
      <motion.div whileHover={{ y: -4, scale: 1.01 }} className={`${grad} rounded-[30px] p-6 h-full flex flex-col justify-between min-h-[190px] relative overflow-hidden`}>
        <div className="flex justify-between items-start">
          <Icon name={icon} size={84} className="-ml-1 -mt-1" />
          <ArrowBtn dark />
        </div>
        <div>
          <div className="text-2xl font-extrabold">{title}</div>
          <div className="text-white/85 font-semibold">{line}</div>
        </div>
      </motion.div>
    </Link>
  );
}

// ---------- přepínač persony ----------
export function PersonaSwitch({ onChange }: { onChange?: (p: Persona) => void }) {
  const { persona, setPersona } = usePersona();
  const items: { id: Persona; label: string }[] = [
    { id: 'marie', label: 'Marie' }, { id: 'novakovi', label: 'Novákovi' }, { id: 'firma', label: 'Firma Kovář' },
  ];
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map((i) => (
        <button key={i.id} onClick={() => { setPersona(i.id); onChange?.(i.id); }}
          className={`flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full font-semibold transition ${persona === i.id ? 'bg-yellow text-black' : 'bg-card text-white border border-white/10 hover:bg-card2'}`}>
          <Icon name={i.id} size={36} />
          {i.label}
        </button>
      ))}
    </div>
  );
}
