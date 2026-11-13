import { motion } from 'framer-motion';
import { DAILY, bandOf } from '../model';
import { BAND_COLOR } from './ui';

// 24 segmentů semaforu s markerem „teď“
export function SemaforStrip({ hour, nowLabel = 'teď' }: { hour: number; nowLabel?: string }) {
  return (
    <div>
      <div className="flex gap-1">
        {DAILY.map((_, h) => (
          <div key={h} className="flex-1 flex flex-col items-center gap-1">
            <div className="text-[11px] font-bold h-4" style={{ color: h === hour ? '#FFC531' : 'transparent' }}>{nowLabel}</div>
            <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: h * 0.02 }}
              className="w-full rounded-md"
              style={{ height: 34, background: BAND_COLOR[bandOf(h)], opacity: h === hour ? 1 : 0.55, outline: h === hour ? '3px solid #fff' : 'none' }} />
            <div className="text-[11px] text-muted">{h % 3 === 0 ? h : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Denní diagram zatížení obarvený podle pásem
export function DailyBars({ hour, labels }: { hour: number; labels: { noc: string; poledne: string; spicka: string; now: string } }) {
  const W = 960, H = 320, pad = 30, bw = (W - pad * 2) / 24;
  const y = (v: number) => H - 40 - (v / 100) * (H - 80);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {[25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={pad} x2={W - pad} y1={y(g)} y2={y(g)} stroke="rgba(255,255,255,0.06)" />
          <text x={pad - 6} y={y(g) + 4} fill="#71717a" fontSize="11" textAnchor="end">{g}</text>
        </g>
      ))}
      {DAILY.map((v, h) => (
        <g key={h}>
          <motion.rect initial={{ height: 0, y: y(0) }} animate={{ height: y(0) - y(v), y: y(v) }} transition={{ delay: h * 0.025, duration: 0.5 }}
            x={pad + h * bw + 3} width={bw - 6} rx={6} fill={BAND_COLOR[bandOf(h)]} opacity={h === hour ? 1 : 0.8}
            stroke={h === hour ? '#fff' : 'none'} strokeWidth={3} />
          <text x={pad + h * bw + bw / 2} y={H - 22} fill="#a1a1aa" fontSize="12" textAnchor="middle">{h}</text>
        </g>
      ))}
      {hour >= 0 && <text x={pad + hour * bw + bw / 2} y={y(DAILY[hour]) - 10} fill="#FFC531" fontSize="14" fontWeight="800" textAnchor="middle">{labels.now}</text>}
      <text x={pad + 3 * bw} y={H - 4} fill="#22C55E" fontSize="14" fontWeight="700" textAnchor="middle">{labels.noc}</text>
      <text x={pad + 13 * bw} y={H - 4} fill="#22C55E" fontSize="14" fontWeight="700" textAnchor="middle">{labels.poledne}</text>
      <text x={pad + 19 * bw} y={H - 4} fill="#EF4444" fontSize="14" fontWeight="700" textAnchor="middle">{labels.spicka}</text>
    </svg>
  );
}

// Čárový graf 2 řad (dnešní tarif vs FÉRSÍŤ)
export function LineChart({ a, b, upTo, labels, years, fmt }: { a: number[]; b: number[]; upTo: number; labels: [string, string]; years: number[]; fmt: (n: number) => string }) {
  const W = 960, H = 380, pl = 70, pr = 30, pt = 30, pb = 40;
  const all = [...a, ...b];
  const min = Math.min(...all) * 0.9, max = Math.max(...all) * 1.05;
  const x = (i: number) => pl + (i / (a.length - 1)) * (W - pl - pr);
  const y = (v: number) => pt + (1 - (v - min) / (max - min)) * (H - pt - pb);
  const path = (s: number[]) => s.slice(0, upTo + 1).map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.06)" />
          <text x={pl - 10} y={y(t) + 4} fill="#71717a" fontSize="12" textAnchor="end">{fmt(t)}</text>
        </g>
      ))}
      {years.map((yr, i) => (
        <text key={yr} x={x(i)} y={H - 12} fill={i === upTo ? '#fff' : '#71717a'} fontSize="13" fontWeight={i === upTo ? 800 : 400} textAnchor="middle">{yr}</text>
      ))}
      <path d={path(a)} fill="none" stroke="#EF4444" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={path(b)} fill="none" stroke="#FFC531" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(upTo)} cy={y(a[upTo])} r={8} fill="#EF4444" />
      <circle cx={x(upTo)} cy={y(b[upTo])} r={8} fill="#FFC531" />
      <text x={x(upTo) + (upTo > 7 ? -14 : 14)} y={y(a[upTo]) - 12} fill="#EF4444" fontSize="18" fontWeight="800" textAnchor={upTo > 7 ? 'end' : 'start'}>{fmt(a[upTo])}</text>
      <text x={x(upTo) + (upTo > 7 ? -14 : 14)} y={y(b[upTo]) + 40} fill="#FFC531" fontSize="18" fontWeight="800" textAnchor={upTo > 7 ? 'end' : 'start'}>{fmt(b[upTo])}</text>
      <g transform={`translate(${pl + 10},${pt})`}>
        <rect width="14" height="14" rx="4" fill="#EF4444" /><text x="20" y="12" fill="#fff" fontSize="14" fontWeight="600">{labels[0]}</text>
        <rect x="150" width="14" height="14" rx="4" fill="#FFC531" /><text x="170" y="12" fill="#fff" fontSize="14" fontWeight="600">{labels[1]}</text>
      </g>
    </svg>
  );
}

// Radar trilematu (2 polygony)
export function Radar({ dims, a, b, labels }: { dims: string[]; a: number[]; b: number[]; labels: [string, string] }) {
  const S = 420, c = S / 2, R = 150;
  const pt = (i: number, v: number) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / dims.length;
    return [c + Math.cos(ang) * (R * v) / 5, c + Math.sin(ang) * (R * v) / 5];
  };
  const poly = (s: number[]) => s.map((v, i) => pt(i, v).join(',')).join(' ');
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-auto max-w-[460px] mx-auto">
      {[1, 2, 3, 4, 5].map((r) => <polygon key={r} points={poly(dims.map(() => r))} fill="none" stroke="rgba(255,255,255,0.08)" />)}
      {dims.map((_, i) => { const [x, y] = pt(i, 5); return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />; })}
      <motion.polygon initial={{ opacity: 0 }} animate={{ opacity: 1 }} points={poly(a)} fill="rgba(161,161,170,0.18)" stroke="#a1a1aa" strokeWidth={3} />
      <motion.polygon initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} style={{ transformOrigin: `${c}px ${c}px` }}
        points={poly(b)} fill="rgba(255,197,49,0.22)" stroke="#FFC531" strokeWidth={4} />
      {dims.map((d, i) => {
        const [x, y] = pt(i, 6.1);
        return (
          <g key={d}>
            <text x={x} y={y} fill="#fff" fontSize="15" fontWeight="800" textAnchor="middle">{d}</text>
            <text x={x} y={y + 18} fontSize="13" textAnchor="middle"><tspan fill="#a1a1aa">{a[i].toFixed(1).replace('.', ',')}</tspan><tspan fill="#71717a"> → </tspan><tspan fill="#FFC531" fontWeight="800">{b[i].toFixed(1).replace('.', ',')}</tspan></text>
          </g>
        );
      })}
      <g transform={`translate(10,${S - 20})`}>
        <rect width="12" height="12" rx="3" fill="#a1a1aa" /><text x="18" y="11" fill="#a1a1aa" fontSize="13">{labels[0]}</text>
        <rect x="80" width="12" height="12" rx="3" fill="#FFC531" /><text x="98" y="11" fill="#FFC531" fontSize="13" fontWeight="700">{labels[1]}</text>
      </g>
    </svg>
  );
}
