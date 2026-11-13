import { motion } from 'framer-motion';
import { DAILY, YEARLY, PV_MONTHLY } from '../model';

const MONTHS = ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'];
// zatížení sítě: % roční špičky
export const LOAD = YEARLY.map((m) => DAILY.map((d) => (d * m) / 100));
// výroba FVE: měsíční podíl × denní tvar (délka dne podle měsíce)
const HALF = [4, 5, 6, 7, 8, 8.5, 8.5, 7.5, 6.5, 5.5, 4.5, 4];
const pvRaw = PV_MONTHLY.map((p, m) => DAILY.map((_, h) => p * Math.max(0, Math.cos(((h + 0.5 - 13) / HALF[m]) * (Math.PI / 2)))));
const pvMax = Math.max(...pvRaw.flat());
export const PV = pvRaw.map((r) => r.map((v) => (v / pvMax) * 100));

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const mix = (c1: number[], c2: number[], t: number) => `rgb(${lerp(c1[0], c2[0], t)},${lerp(c1[1], c2[1], t)},${lerp(c1[2], c2[2], t)})`;
export const loadColor = (v: number) => {
  const t = Math.min(1, Math.max(0, (v - 30) / 70));
  return t < 0.5 ? mix([20, 83, 45], [250, 204, 21], t * 2) : mix([250, 204, 21], [239, 68, 68], (t - 0.5) * 2);
};
export const pvColor = (v: number) => mix([24, 24, 27], [255, 197, 49], Math.min(1, v / 100));

export function Heatmap({ data, color, title, sub, hi }: { data: number[][]; color: (v: number) => string; title: string; sub: string; hi?: { m: number; h: number; label: string } }) {
  const cw = 26, ch = 24, L = 38, T = 24;
  const W = L + 24 * cw, H = T + 12 * ch + 24;
  return (
    <div>
      <div className="font-extrabold text-xl">{title}</div>
      <div className="text-muted font-semibold text-sm mb-3">{sub}</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {data.map((row, m) => (
          <g key={m}>
            <text x={L - 6} y={T + m * ch + ch / 2 + 4} fill="#a1a1aa" fontSize="11" textAnchor="end">{MONTHS[m]}</text>
            {row.map((v, h) => (
              <motion.rect key={h} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (m * 24 + h) * 0.0015 }}
                x={L + h * cw + 1} y={T + m * ch + 1} width={cw - 2} height={ch - 2} rx={4} fill={color(v)} />
            ))}
          </g>
        ))}
        {[0, 6, 12, 18, 23].map((h) => <text key={h} x={L + h * cw + cw / 2} y={H - 6} fill="#a1a1aa" fontSize="11" textAnchor="middle">{h}</text>)}
        {hi && (
          <g>
            <rect x={L + hi.h * cw - 1} y={T + hi.m * ch - 1} width={cw + 2} height={ch + 2} rx={5} fill="none" stroke="#fff" strokeWidth={2.5} />
            <text x={L + hi.h * cw + cw / 2} y={T + hi.m * ch - 8} fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">{hi.label}</text>
          </g>
        )}
      </svg>
    </div>
  );
}
