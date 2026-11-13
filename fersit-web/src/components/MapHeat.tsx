// Živá mapa sítě: zatížení měst na skutečné mapě ostrova ENERGIA podle měsíce a hodiny.
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DAILY, YEARLY, PV_MONTHLY, PEAK_GW, bandOf } from '../model';
import { BAND_COLOR, Dot, Icon, num } from './ui';

type Prof = 'res' | 'steel' | 'chem' | 'dc' | 'agro' | 'tour';
// souřadnice v pixelech mapy (2048×1448), podíl na špičce soustavy (%), typ odběru – z podkladů ČEPS (města ostrova)
const CITIES: { n: string; x: number; y: number; w: number; p: Prof; d: string; below?: boolean }[] = [
  { n: 'Energiapolis', x: 1331, y: 873, w: 30, p: 'res', below: true, d: 'hlavní město · služby a domácnosti' },
  { n: 'Ferrum', x: 867, y: 746, w: 14, p: 'steel', d: 'ocelárny · stabilní odběr' },
  { n: 'Petrovia', x: 1097, y: 562, w: 14, p: 'chem', d: 'chemie · flexibilní během dne' },
  { n: 'Port Energia', x: 1361, y: 825, w: 10, p: 'res', d: 'přístav' },
  { n: 'Nexus', x: 1398, y: 445, w: 8, p: 'dc', d: 'datacentra · konstantní odběr' },
  { n: 'Agroville', x: 1007, y: 842, w: 6, p: 'agro', d: 'zemědělství · léto' },
  { n: 'Azuro', x: 1236, y: 1004, w: 5, p: 'tour', d: 'turismus · léto' },
  { n: 'Nordport', x: 402, y: 673, w: 4, p: 'res', d: 'rybářské město' },
  { n: 'Elektra', x: 1157, y: 786, w: 1.8, p: 'res', d: '' },
  { n: 'Soustavia', x: 930, y: 911, w: 1.8, p: 'res', d: '' },
  { n: 'Stoford', x: 906, y: 566, w: 1.5, p: 'res', d: '' },
  { n: 'Indukta', x: 1278, y: 980, w: 1.5, p: 'tour', d: '' },
  { n: 'Větrov', x: 502, y: 868, w: 1.2, p: 'res', d: '' },
  { n: 'Eru', x: 828, y: 640, w: 1.2, p: 'res', d: '' },
];
const SUMMER = [0.6, 0.6, 0.75, 0.95, 1.15, 1.35, 1.5, 1.5, 1.2, 0.9, 0.7, 0.6];
const TOUR = [0.5, 0.5, 0.65, 0.85, 1.1, 1.45, 1.7, 1.7, 1.2, 0.8, 0.55, 0.55];
const WIND = [1.3, 1.25, 1.15, 1, 0.85, 0.75, 0.7, 0.75, 0.9, 1.1, 1.25, 1.3];
const MONTHS = ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'];
const HALF = [4, 5, 6, 7, 8, 8.5, 8.5, 7.5, 6.5, 5.5, 4.5, 4];

function factor(p: Prof, m: number, h: number, fer: boolean) {
  const b = bandOf(h);
  const res = (DAILY[h] / 100) * (YEARLY[m] / 100);
  const night = h >= 23 || h <= 5;
  // přesun spotřeby z červené (a večera) do noci – energie se zachová (−47 % bodů → +11 % v 7 nočních hodinách)
  const flexRes = fer ? (b === 'red' ? 0.9 : h === 21 || h === 22 ? 0.95 : night ? 1.11 : 1) : 1; // EV, baterie, pračky mimo červenou
  switch (p) {
    case 'res': return res * flexRes;
    case 'steel': return 0.95;
    case 'chem': return fer ? (b === 'red' ? 0.45 : night ? 1.15 : 0.9) : 0.9; // chemie přesouvá výrobu
    case 'dc': return 0.95 + 0.05 * (SUMMER[m] - 1);
    case 'agro': return (DAILY[h] / 100) * SUMMER[m] * 0.75 * flexRes;
    case 'tour': return (DAILY[h] / 100) * TOUR[m] * 0.7 * flexRes;
  }
}
const rawTotal = (m: number, h: number, fer: boolean) => CITIES.reduce((s, c) => s + c.w * factor(c.p, m, h, fer), 0);
const SCALE = PEAK_GW / Math.max(...Array.from({ length: 24 }, (_, h) => rawTotal(0, h, false)));
const solar = (m: number, h: number) => (PV_MONTHLY[m] / 14.5) * Math.max(0, Math.cos(((h + 0.5 - 13) / HALF[m]) * (Math.PI / 2)));
const wind = (m: number, h: number) => WIND[m] * (0.85 + 0.15 * Math.sin((h / 24) * Math.PI * 2 + 1));

export default function MapHeat() {
  const [m, setM] = useState(0);
  const [h, setH] = useState(20);
  const [fer, setFer] = useState(false);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setH((x) => (x + 1) % 24), 380);
    return () => clearInterval(id);
  }, [play]);

  const total = rawTotal(m, h, fer) * SCALE;
  const totalToday = rawTotal(m, h, false) * SCALE;
  const peakToday = rawTotal(0, 20, false) * SCALE;
  const peakFer = rawTotal(0, 20, true) * SCALE;
  const util = total / PEAK_GW;
  const band = bandOf(h);
  const sol = solar(m, h), wi = wind(m, h);
  const greenGen = sol * 0.55 + wi * 0.35; // orientačně
  const color = (u: number) => (u > 0.86 ? '#EF4444' : u > 0.66 ? '#FACC15' : '#22C55E');
  const cityMax = useMemo(() => Object.fromEntries(CITIES.map((c) => [c.n, Math.max(...Array.from({ length: 12 * 24 }, (_, i) => factor(c.p, Math.floor(i / 24), i % 24, false)))])), []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <div className="text-2xl md:text-3xl font-extrabold">Živá mapa sítě</div>
          <div className="text-muted font-semibold">Zatížení měst ostrova ENERGIA v čase · orientační model z dat ČEPS a diagramů zatížení</div>
        </div>
        <div className="flex bg-card2 rounded-full p-1 font-extrabold">
          {[{ v: false, l: 'Dnes' }, { v: true, l: 'S FÉRSÍŤ' }].map((o) => (
            <button key={o.l} onClick={() => setFer(o.v)} className={`px-5 py-2 rounded-full transition ${fer === o.v ? 'bg-yellow text-black' : 'text-muted'}`}>{o.l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-3 relative rounded-3xl overflow-hidden bg-[#0b1220] self-start">
          <svg viewBox="300 300 1650 900" className="w-full h-auto block">
            <defs>
              {CITIES.map((c, i) => {
                const u = factor(c.p, m, h, fer) / cityMax[c.n];
                return (
                  <radialGradient key={c.n} id={`gc${i}`}>
                    <stop offset="0%" stopColor={color(u)} stopOpacity="0.95" />
                    <stop offset="45%" stopColor={color(u)} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color(u)} stopOpacity="0" />
                  </radialGradient>
                );
              })}
              <radialGradient id="g-sun"><stop offset="0%" stopColor="#FFC531" stopOpacity="0.85" /><stop offset="100%" stopColor="#FFC531" stopOpacity="0" /></radialGradient>
              <radialGradient id="g-wind"><stop offset="0%" stopColor="#38BDF8" stopOpacity="0.75" /><stop offset="100%" stopColor="#38BDF8" stopOpacity="0" /></radialGradient>
              <filter id="dark"><feColorMatrix type="matrix" values="0.62 0 0 0 0  0 0.66 0 0 0  0 0 0.74 0 0  0 0 0 1 0" /></filter>
            </defs>
            <image href="mapa_ostrova_ENERGIA.jpg" x="0" y="0" width="2048" height="1448" filter="url(#dark)" />
            {/* zdroje na západě: vítr (pobřeží) a slunce (jih) */}
            <circle cx={360} cy={760} r={90 + 110 * wi} fill="url(#g-wind)" />
            <circle cx={470} cy={960} r={60 + 90 * wi} fill="url(#g-wind)" />
            <circle cx={760} cy={1010} r={20 + 220 * sol} fill="url(#g-sun)" />
            {/* tok energie západ → východ */}
            <motion.path d="M 420 820 C 700 700, 1000 720, 1310 860" fill="none" stroke="#FFC531" strokeLinecap="round"
              strokeDasharray="22 26" animate={{ strokeDashoffset: [0, -96] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              strokeWidth={6 + 26 * Math.min(1, greenGen)} opacity={0.85} />
            {CITIES.map((c, i) => {
              const v = c.w * factor(c.p, m, h, fer);
              const r = 26 + Math.sqrt(v) * 34;
              return (
                <g key={c.n}>
                  <motion.circle cx={c.x} cy={c.y} fill={`url(#gc${i})`} animate={{ r: [r, r * 1.08, r] }} transition={{ repeat: Infinity, duration: 2.4 }} />
                  {c.w >= 4 && (
                    <text x={c.below ? c.x + 40 : c.x} y={c.below ? c.y + 10 : c.y - r * 0.55} fill="#fff" fontSize="26" fontWeight="800" textAnchor={c.below ? 'start' : 'middle'} style={{ paintOrder: 'stroke', stroke: '#000', strokeWidth: 6 }}>
                      {c.n} {num(v * SCALE, 1)} GW
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="chip !bg-black/70"><Icon name="priroda" size={24} /> Vítr {num(wi * 100 / 1.3, 0)} %</span>
            <span className="chip !bg-black/70"><Icon name="novakovi" size={24} /> Slunce {num(sol * 100, 0)} %</span>
          </div>
          <div className="absolute right-4 top-4 chip !bg-black/70 !text-base"><Dot band={band} glow /> {MONTHS[m]} · {h}:00</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card !bg-card2 p-5">
            <div className="text-muted font-semibold">Zatížení sítě teď</div>
            <div className="text-5xl font-extrabold" style={{ color: color(util) }}>{num(total, 1)} GW</div>
            <div className="h-3 bg-black/40 rounded-full mt-3 overflow-hidden"><motion.div className="h-full rounded-full" animate={{ width: `${Math.min(100, util * 100)}%`, background: color(util) }} /></div>
            <div className="text-muted text-sm font-semibold mt-1">{num(util * 100, 0)} % roční špičky ({num(PEAK_GW, 1)} GW)</div>
            {fer && totalToday - total > 0.05 && <div className="text-sgreen font-extrabold mt-2">−{num(totalToday - total, 2)} GW díky semaforu</div>}
          </div>
          <div className="card !bg-card2 p-5">
            <div className="text-muted font-semibold">Večerní špička (leden 20:00)</div>
            <div className="text-xl font-extrabold">Dnes {num(peakToday, 1)} GW → <span className="text-yellow">S FÉRSÍŤ {num(peakFer, 1)} GW</span></div>
            <div className="text-sgreen font-extrabold text-2xl">−{num(Math.max(0, peakToday - peakFer), 1)} GW</div>
            <div className="text-muted text-sm font-semibold">Elektroauta a baterie mimo červenou, chemie v Petrovii přesouvá výrobu do noci. Když se špička posune, regulátor každý rok překalibruje semafor z dat elektroměrů.</div>
          </div>
          <div className="card !bg-card2 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setPlay((p) => !p)} className="w-12 h-12 rounded-full bg-yellow text-black font-extrabold grid place-items-center shrink-0">{play ? '❚❚' : '▶'}</button>
              <input type="range" min={0} max={23} value={h} onChange={(e) => { setPlay(false); setH(+e.target.value); }} />
              <div className="font-extrabold w-14 text-right">{h}:00</div>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {MONTHS.map((n, i) => (
                <button key={n} onClick={() => setM(i)} className={`py-1.5 rounded-xl text-sm font-bold ${m === i ? 'bg-yellow text-black' : 'bg-black/30 text-muted hover:text-white'}`}>{n}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 text-sm font-semibold text-muted">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: BAND_COLOR.green }} /> město pod 66 % své špičky</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: BAND_COLOR.yellow }} /> 66–86 %</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: BAND_COLOR.red }} /> nad 86 % – síť na maximu</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#38BDF8]" /> vítr</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow" /> slunce · tok energie západ → východ</span>
      </div>
    </div>
  );
}
