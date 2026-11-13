// Promo-video FÉRSÍŤ: čistá funkce času t (s) → stejné pro web (/promo) i pro Remotion (MP4).
import type { CSSProperties, ReactNode } from 'react';
import { fersit, statusQuo, years, PV_MONTHLY } from '../model';

export const PROMO_LEN = 48; // s
const Y = '#FFC531', BG = '#0E0E10', MUT = '#A1A1AA', RED = '#EF4444', GRN = '#22C55E';

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const back = (x: number) => { const c = 1.70158, p = clamp(x) - 1; return 1 + (c + 1) * p * p * p + c * p * p; };
const prog = (t: number, s: number, d = 0.6) => ease((t - s) / d);
const fmt = (n: number) => Math.round(n).toLocaleString('cs-CZ');

const f0 = fersit(0), s0 = statusQuo(0);
const MARIE_OLD = s0.A, NOV_OLD = s0.B, MARIE_NEW = f0.A, NOV_NEW = f0.B;
const FIRM_10 = (1 - fersit(10).F / statusQuo(10).F) * 100;

function Scene({ t, from, to, children, style }: { t: number; from: number; to: number; children: ReactNode; style?: CSSProperties }) {
  if (t < from - 0.01 || t > to + 0.01) return null;
  const o = Math.min(clamp((t - from) / 0.45), clamp((to - t) / 0.45));
  return <div style={{ position: 'absolute', inset: 0, opacity: o, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...style }}>{children}</div>;
}
const rise = (t: number, s: number, d = 0.7): CSSProperties => ({ opacity: prog(t, s, d), transform: `translateY(${(1 - prog(t, s, d)) * 50}px)` });
const pop = (t: number, s: number, d = 0.6): CSSProperties => ({ opacity: clamp((t - s) / 0.25), transform: `scale(${0.4 + 0.6 * back((t - s) / d)})` });

function Badge({ e, grad, size = 220 }: { e: string; grad: string; size?: number }) {
  return <div style={{ width: size, height: size, borderRadius: size * 0.3, background: grad, display: 'grid', placeItems: 'center', fontSize: size * 0.55 }}>{e}</div>;
}
const H = (p: { children: ReactNode; size?: number; color?: string; style?: CSSProperties }) =>
  <div style={{ fontSize: p.size ?? 88, fontWeight: 800, color: p.color ?? '#fff', letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.1, ...p.style }}>{p.children}</div>;

function Logo({ size = 200, glow = 1 }: { size?: number; glow?: number }) {
  return <div style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', textShadow: `0 0 ${80 * glow}px rgba(255,197,49,${0.55 * glow})` }}><span style={{ color: Y }}>FÉR</span>SÍŤ</div>;
}

export function PromoStage({ t }: { t: number }) {
  const g = fersit; void g;
  // ----- data pro 10 let -----
  const a = years.map((y) => statusQuo(y).F), b = years.map((y) => fersit(y).F);
  const minV = 18500, maxV = 25000, W = 1300, Hh = 460;
  const px = (i: number) => (i / 10) * W, py = (v: number) => Hh - ((v - minV) / (maxV - minV)) * Hh;
  const drawP = clamp((t - 34) / 3.5);
  const line = (s: number[]) => { const n = drawP * 10; const pts: string[] = []; for (let i = 0; i <= Math.floor(n); i++) pts.push(`${px(i)},${py(s[i])}`); const fi = Math.floor(n); if (fi < 10) { const fr = n - fi; pts.push(`${px(fi + fr)},${py(s[fi] + (s[fi + 1] - s[fi]) * fr)}`); } return pts.join(' '); };

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: 'relative', overflow: 'hidden', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: '#fff' }}>
      {/* jemná záře v pozadí */}
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', left: 1300 - Math.sin(t / 6) * 200, top: -350, background: 'radial-gradient(circle, rgba(255,197,49,0.10), transparent 65%)' }} />

      {/* 0–4 Marie */}
      <Scene t={t} from={0} to={4}>
        <div style={pop(t, 0.1)}><Badge e="👵" grad="linear-gradient(135deg,#FB923C,#F97316)" /></div>
        <H style={{ ...rise(t, 0.5), marginTop: 50 }}>Paní Marie platí za síť</H>
        <H size={190} color={Y} style={rise(t, 0.9)}>{fmt(MARIE_OLD * prog(t, 0.9, 1.6))} €</H>
        <div style={{ ...rise(t, 1.3), fontSize: 34, color: MUT, fontWeight: 600 }}>panelák · bez fotovoltaiky</div>
      </Scene>

      {/* 4–8 Novákovi */}
      <Scene t={t} from={4} to={8}>
        <div style={pop(t, 4.1)}><Badge e="🏡" grad="linear-gradient(135deg,#14B8A6,#0D9488)" /></div>
        <H style={{ ...rise(t, 4.5), marginTop: 50 }}>Novákovi s fotovoltaikou</H>
        <H size={190} color={Y} style={rise(t, 4.9)}>{fmt(NOV_OLD * prog(t, 4.9, 1.6))} €</H>
        <div style={{ ...rise(t, 5.3), fontSize: 34, color: MUT, fontWeight: 600 }}>rodinný dům · FVE + baterie</div>
      </Scene>

      {/* 8–12 Zima */}
      <Scene t={t} from={8} to={12} style={{ background: 'linear-gradient(180deg,#0b1220,#0E0E10)' }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: (i * 137) % 1920, top: ((i * 89 + (t - 8) * (60 + (i % 5) * 20)) % 1100) - 20, width: 8, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.6)' }} />
        ))}
        <div style={{ ...rise(t, 8.2), fontSize: 46, color: MUT, fontWeight: 700, marginBottom: 20 }}>❄️ leden · 20:00</div>
        <H size={96} style={rise(t, 8.5)}>V lednu ve 20:00<br />potřebují síť oba stejně.</H>
        <div style={{ display: 'flex', gap: 140, marginTop: 60, alignItems: 'flex-end', height: 330 }}>
          {[{ l: 'Síť', v: 100, c: RED }, { l: 'Slunce', v: PV_MONTHLY[0] * 0, c: Y }].map((x, i) => (
            <div key={x.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: x.c }}>{Math.round(x.v * prog(t, 9 + i * 0.2, 1))} %</div>
              <div style={{ width: 150, height: Math.max(6, 200 * (x.v / 100) * prog(t, 9 + i * 0.2, 1)), background: x.c, borderRadius: 18 }} />
              <div style={{ fontSize: 36, fontWeight: 700 }}>{x.l}</div>
            </div>
          ))}
        </div>
      </Scene>

      {/* 12–15 Nespravedlnost */}
      <Scene t={t} from={12} to={15}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 900, position: 'relative' }}>
          <Badge e="👵" grad="linear-gradient(135deg,#FB923C,#F97316)" size={180} />
          <Badge e="🏡" grad="linear-gradient(135deg,#14B8A6,#0D9488)" size={180} />
          {Array.from({ length: 7 }, (_, i) => {
            const p = clamp((t - 12.3 - i * 0.22) / 1.0);
            if (p <= 0 || p >= 1) return null;
            return <div key={i} style={{ position: 'absolute', left: 190 + p * 840, top: 60 - Math.sin(p * Math.PI) * 160, width: 70, height: 70, borderRadius: 35, background: Y, color: '#000', fontWeight: 800, fontSize: 40, display: 'grid', placeItems: 'center' }}>€</div>;
          })}
        </div>
        <H size={120} color={RED} style={{ ...rise(t, 12.6), marginTop: 90 }}>Marie doplácí Novákovým.</H>
      </Scene>

      {/* 15–19 Reveal */}
      <Scene t={t} from={15} to={19}>
        <div style={pop(t, 15.2, 0.9)}><Logo size={260} glow={0.5 + 0.5 * Math.sin((t - 15) * 2)} /></div>
        <H size={64} color={MUT} style={{ ...rise(t, 16.2), marginTop: 20 }}>„Síť platí ti, kdo ji potřebují.“</H>
      </Scene>

      {/* 19–27 Tři položky */}
      <Scene t={t} from={19} to={27}>
        <H size={70} style={{ ...rise(t, 19.2), marginBottom: 70 }}>Tarif jako u mobilu. <span style={{ color: Y }}>3 položky.</span></H>
        <div style={{ display: 'flex', gap: 50 }}>
          {[
            { e: '🔌', t: 'Připojení', s: '4,80 € / měsíc', grad: 'linear-gradient(135deg,#3B82F6,#2563EB)' },
            { e: '⚡', t: 'Jistič', s: '0,50 € / kW / měsíc', grad: 'linear-gradient(135deg,#A78BFA,#8B5CF6)' },
            { e: '🚦', t: 'Semafor', s: '0,6 · 1,2 · 3,6 c/kWh', grad: 'linear-gradient(135deg,#FB923C,#F97316)' },
          ].map((c, i) => {
            const s = 20 + i * 1.6;
            return (
              <div key={c.t} style={{ ...rise(t, s, 0.8), width: 470, height: 440, borderRadius: 40, background: c.grad, padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 110 }}>{c.e}</div>
                <div>
                  <div style={{ fontSize: 64, fontWeight: 800 }}>{c.t}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, opacity: 0.9 }}>{c.s}</div>
                  {i === 2 && (
                    <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
                      {[GRN, Y, RED].map((col, k) => <div key={col} style={{ width: 56, height: 56, borderRadius: 28, background: col, opacity: t > 24 + k * 0.5 ? 1 : 0.2, boxShadow: t > 24 + k * 0.5 ? `0 0 30px ${col}` : 'none', border: '4px solid rgba(0,0,0,0.25)' }} />)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Scene>

      {/* 27–33 Účty */}
      <Scene t={t} from={27} to={33}>
        <div style={{ display: 'flex', gap: 60 }}>
          {[
            { e: '👵', n: 'Marie', old: MARIE_OLD, nw: MARIE_NEW, grad: 'linear-gradient(135deg,#FB923C,#F97316)', s: 27.3 },
            { e: '🏡', n: 'Novákovi', old: NOV_OLD, nw: NOV_NEW, grad: 'linear-gradient(135deg,#14B8A6,#0D9488)', s: 28.1 },
          ].map((p) => (
            <div key={p.n} style={{ ...rise(t, p.s), width: 720, background: '#18181B', borderRadius: 40, padding: 50, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 40 }}>
              <Badge e={p.e} grad={p.grad} size={150} />
              <div>
                <div style={{ fontSize: 46, fontWeight: 800 }}>{p.n}</div>
                <div style={{ fontSize: 44, color: MUT, textDecoration: 'line-through', fontWeight: 700 }}>{fmt(p.old)} €</div>
                <div style={{ fontSize: 130, color: Y, fontWeight: 800, lineHeight: 1 }}>{fmt(p.old + (p.nw - p.old) * prog(t, p.s + 0.8, 1.5))} €</div>
              </div>
            </div>
          ))}
        </div>
        <H size={84} style={{ ...rise(t, 30), marginTop: 80 }}>Stejná potřeba = <span style={{ color: Y }}>stejná cena</span></H>
      </Scene>

      {/* 33–39 10 let */}
      <Scene t={t} from={33} to={39}>
        <H size={64} style={{ ...rise(t, 33.2), marginBottom: 40 }}>Účet firmy Kovář <span style={{ color: MUT }}>2027 → 2037</span></H>
        <div style={{ position: 'relative' }}>
          <svg width={W + 300} height={Hh + 60} viewBox={`-40 -30 ${W + 300} ${Hh + 60}`}>
            <polyline points={line(a)} fill="none" stroke={RED} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={line(b)} fill="none" stroke={Y} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            {drawP >= 1 && <>
              <text x={W + 30} y={py(a[10]) + 14} fill={RED} fontSize={44} fontWeight={800}>{fmt(a[10])} €</text>
              <text x={W + 30} y={py(b[10]) + 40} fill={Y} fontSize={44} fontWeight={800}>{fmt(b[10])} €</text>
            </>}
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 80, marginTop: 30 }}>
          <H size={60} color={RED} style={rise(t, 35)}>Dnešní tarif: spirála smrti.</H>
          <H size={60} color={Y} style={rise(t, 36.2)}>FÉRSÍŤ: stabilní.</H>
        </div>
      </Scene>

      {/* 39–44 Přínosy */}
      <Scene t={t} from={39} to={44}>
        <div style={{ display: 'flex', gap: 50 }}>
          {[
            { big: '3 mil.', s: 'domácností ušetří', c: GRN, grad: 'linear-gradient(135deg,#14B8A6,#0D9488)' },
            { big: `−${Math.round(FIRM_10)} %`, s: 'průmysl za 10 let', c: '#fff', grad: 'linear-gradient(135deg,#FB923C,#F97316)' },
            { big: '0 €', s: 'síť bez dotací', c: '#fff', grad: 'linear-gradient(135deg,#3B82F6,#2563EB)' },
          ].map((x, i) => (
            <div key={x.s} style={{ ...pop(t, 39.3 + i * 1.1), width: 500, height: 420, borderRadius: 40, background: x.grad, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1 }}>{x.big}</div>
              <div style={{ fontSize: 44, fontWeight: 700, marginTop: 20 }}>{x.s}</div>
            </div>
          ))}
        </div>
      </Scene>

      {/* 44–48 Finál */}
      <Scene t={t} from={44} to={48}>
        <div style={pop(t, 44.2, 0.8)}><Logo size={240} /></div>
        <H size={76} style={{ ...rise(t, 44.9), marginTop: 10 }}>Síť pro všechny.</H>
        <div style={{ display: 'flex', gap: 20, marginTop: 50, ...rise(t, 45.4) }}>
          {[GRN, Y, RED].map((c) => <div key={c} style={{ width: 44, height: 44, borderRadius: 22, background: c, boxShadow: `0 0 26px ${c}` }} />)}
        </div>
        <div style={{ ...rise(t, 45.8), fontSize: 36, color: MUT, fontWeight: 700, marginTop: 30, letterSpacing: '0.3em' }}>OSTROV ENERGIA</div>
      </Scene>

      {/* zatmívačka na konci */}
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - 47.2) / 0.8), pointerEvents: 'none' }} />
    </div>
  );
}
