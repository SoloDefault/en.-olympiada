import { AbsoluteFill, interpolate, useCurrentFrame, Easing, Img, staticFile } from 'remotion';
import { C, FONT, T, Rise, Pop, Count, Backdrop, Chip, Icon, Browser, SceneWrap, lin, useSp, fmt } from './kit';
import { fersit, statusQuo, DAILY, bandOf } from '../src/model';

const f0 = fersit(0), s0 = statusQuo(0);
const MARIE_OLD = s0.A, NOV_OLD = s0.B, MARIE_NEW = f0.A, NOV_NEW = f0.B;
const BC = { green: C.grn, yellow: '#FACC15', red: C.red } as const;
type P = { dur: number };

// 1 — Marie
export function S01({ dur }: P) {
  return (
    <SceneWrap dur={dur}>
      <Backdrop glow={C.orange} x={30} y={50} />
      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 110 }}>
        <Pop d={4}><Icon name="marie" size={520} /></Pop>
        <div>
          <Rise d={14}><T size={46} w={600} color={C.mut}>Panelák · bez fotovoltaiky</T></Rise>
          <Rise d={20}><T size={110}>Paní Marie</T></Rise>
          <Rise d={50} style={{ marginTop: 40 }}><T size={40} w={600} color={C.mut}>platí za síť ročně</T></Rise>
          <Rise d={56}><T size={200} color={C.y}><Count to={MARIE_OLD} a={60} b={120} /></T></Rise>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
}

// 2 — Novákovi + srovnání sloupců
export function S02({ dur }: P) {
  const f = useCurrentFrame();
  const bar = (v: number, d: number, color: string) => <div style={{ width: 230, height: lin(f, d, d + 30) * v * 1.8, background: color, borderRadius: 26 }} />;
  return (
    <SceneWrap dur={dur}>
      <Backdrop glow={C.teal} x={70} y={50} />
      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 160, paddingBottom: 270 }}>
        {[{ n: 'Marie', i: 'marie', v: MARIE_OLD, d: 6, c: C.orange }, { n: 'Novákovi', i: 'novakovi', v: NOV_OLD, d: 30, c: C.teal }].map((x) => (
          <Rise key={x.n} d={x.d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
            <Icon name={x.i} size={190} />
            <T size={100} color={C.y} style={{ whiteSpace: 'nowrap' }}><Count to={x.v} a={x.d + 6} b={x.d + 40} /></T>
            {bar(x.v, x.d + 4, x.c)}
            <T size={48} w={700}>{x.n}</T>
          </Rise>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150 }}>
        <Rise d={48}><Chip color={C.teal}>Fotovoltaika na střeše = za síť platí o 57 % méně</Chip></Rise>
      </AbsoluteFill>
    </SceneWrap>
  );
}

// 3 — zimní večer: síť potřebují oba stejně
export function S03({ dur }: P) {
  const f = useCurrentFrame();
  const snow = Array.from({ length: 70 }, (_, i) => ({ x: (i * 271) % 1920, y: ((i * 113 + f * (1.2 + (i % 5) * 0.5)) % 1140) - 30, r: 2 + (i % 4) }));
  return (
    <SceneWrap dur={dur} bg="linear-gradient(180deg,#081022,#0B0B0D)">
      {snow.map((s, i) => <div key={i} style={{ position: 'absolute', left: s.x, top: s.y, width: s.r * 2, height: s.r * 2, borderRadius: 9, background: 'rgba(255,255,255,0.55)' }} />)}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Rise d={2}><T size={44} w={700} color="#93C5FD" style={{ letterSpacing: '0.3em', textAlign: 'center' }}>LEDEN</T></Rise>
        <Pop d={8}><T size={250} style={{ textAlign: 'center' }}>20:00</T></Pop>
        <div style={{ display: 'flex', gap: 90, marginTop: 40, alignItems: 'center' }}>
          <Rise d={40} style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: 1 }}>
            <Icon name="novakovi" size={150} style={{ filter: 'grayscale(0.7) brightness(0.55) drop-shadow(0 20px 30px #000)' }} />
            <div><T size={36} w={600} color={C.mut}>Slunce</T><T size={86} color={C.mut}>0 %</T></div>
          </Rise>
          <Rise d={60} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[{ n: 'Marie', v: 1.1 }, { n: 'Novákovi', v: 1.0 }].map((x, k) => (
              <div key={x.n} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <T size={36} w={700} style={{ width: 220 }}>{x.n}</T>
                <div style={{ width: lin(f, 66 + k * 6, 110 + k * 6) * x.v * 520, height: 54, borderRadius: 16, background: `linear-gradient(90deg, ${C.y}, ${C.red})` }} />
                <T size={40} color={C.y}>{fmt(x.v, 1)} kW</T>
              </div>
            ))}
            <T size={30} w={600} color={C.mut}>odběr ze sítě ve špičce</T>
          </Rise>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
}

// 4 — skrytá dotace a spirála
export function S04({ dur }: P) {
  const f = useCurrentFrame();
  const coins = Array.from({ length: 9 }, (_, i) => {
    const p = lin(f - 8 - i * 7, 0, 34, 0, 1, Easing.inOut(Easing.cubic));
    return p > 0 && p < 1 ? { x: 420 + p * 1080, y: 330 - Math.sin(p * Math.PI) * 190, o: Math.sin(p * Math.PI) } : null;
  });
  const sw = 150; // přepnutí na 73 mil.
  const years = Array.from({ length: 11 }, (_, t) => statusQuo(t).rate);
  const dp = lin(f, sw + 60, sw + 140);
  const W = 720, H = 280, x = (i: number) => (i / 10) * W, y = (v: number) => H - ((v - 44) / 24) * H;
  const n = dp * 10, pts: string[] = [];
  for (let i = 0; i <= Math.floor(n); i++) pts.push(`${x(i)},${y(years[i])}`);
  if (Math.floor(n) < 10) { const fr = n - Math.floor(n), i = Math.floor(n); pts.push(`${x(i + fr)},${y(years[i] + (years[i + 1] - years[i]) * fr)}`); }
  return (
    <SceneWrap dur={dur}>
      <Backdrop glow={C.red} x={50} y={40} />
      <AbsoluteFill style={{ opacity: lin(f, sw - 10, sw, 1, 0) }}>
        <div style={{ position: 'absolute', left: 260, top: 230 }}><Icon name="marie" size={230} /></div>
        <div style={{ position: 'absolute', right: 260, top: 230 }}><Icon name="novakovi" size={230} /></div>
        {coins.map((c, i) => c && <div key={i} style={{ position: 'absolute', left: c.x, top: c.y, opacity: c.o, width: 92, height: 92, borderRadius: 46, background: `radial-gradient(circle at 35% 30%, #FFE08A, ${C.y} 55%, #C98A00)`, boxShadow: '0 12px 30px rgba(255,197,49,0.45)', display: 'grid', placeItems: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#5a3d00' }}>€</div>)}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 200 }}>
          <Rise d={20}><T size={96} color={C.red} style={{ textAlign: 'center' }}>Marie doplácí Novákovým.</T></Rise>
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: lin(f, sw, sw + 12), alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 100 }}>
        <div>
          <T size={40} w={600} color={C.mut}>Skrytá dotace na celém ostrově</T>
          <T size={150} color={C.red} style={{ whiteSpace: 'nowrap' }}><Count to={73} a={sw + 4} b={sw + 50} suffix="" /> mil. €</T>
          <T size={46} w={700}>každý rok</T>
        </div>
        <div style={{ opacity: lin(f, sw + 50, sw + 64) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}><Icon name="spirala" size={110} /><T size={44} w={700}>Cena sítě za kWh</T></div>
          <svg width={W + 40} height={H + 40} viewBox={`-20 -20 ${W + 40} ${H + 40}`}>
            <polyline points={pts.join(' ')} fill="none" stroke={C.red} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: W }}><T size={30} w={600} color={C.mut}>2027</T><T size={56} color={C.red} style={{ opacity: lin(f, sw + 130, sw + 145) }}>+34 %</T><T size={30} w={600} color={C.mut}>2037</T></div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
}

// 5 — reveal FÉRSÍŤ
export function S05({ dur }: P) {
  const f = useCurrentFrame();
  const letters = 'FÉRSÍŤ'.split('');
  const flash = lin(f, 0, 6, 0.9, 0) ;
  const ring = lin(f, 2, 40);
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill style={{ background: C.bg }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 300 + ring * 1700, height: 300 + ring * 1700, borderRadius: '50%', border: `${4 + (1 - ring) * 20}px solid ${C.y}`, opacity: (1 - ring) * 0.6 }} />
        <div style={{ position: 'absolute', width: 1200, height: 1200, borderRadius: '50%', background: `radial-gradient(circle, ${C.y}30, transparent 60%)`, opacity: lin(f, 0, 20) }} />
        <div style={{ display: 'flex' }}>
          {letters.map((l, i) => <LetterIn key={i} l={l} i={i} yellow={i < 3} />)}
        </div>
        <Rise d={34}><T size={68} w={600} color="#E4E4E7" style={{ marginTop: 24 }}>Síť platí ti, kdo ji <span style={{ color: C.y, fontWeight: 800 }}>opravdu potřebují.</span></T></Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
    </SceneWrap>
  );
}
function LetterIn({ l, i, yellow }: { l: string; i: number; yellow: boolean }) {
  const p = useSp(4 + i * 3, { damping: 12, stiffness: 160 });
  return <T size={300} w={900} color={yellow ? C.y : '#fff'} style={{ transform: `translateY(${(1 - p) * 140}px) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 1.5), textShadow: `0 0 80px ${C.y}55`, letterSpacing: '-0.04em' }}>{l}</T>;
}

// 6 — tarif jako u mobilu + semafor
export function S06({ dur }: P) {
  const f = useCurrentFrame();
  const cards = [
    { i: 'pripojeni', t: 'Připojení', s: '4,80 € měsíčně', g: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' },
    { i: 'jistic', t: 'Jistič', s: '0,50 € za kW', g: 'linear-gradient(135deg,#A78BFA,#7C3AED)' },
    { i: 'semafor', t: 'Semafor', s: 'cena podle času', g: 'linear-gradient(135deg,#FB923C,#EA580C)' },
  ];
  const sw = 150;
  return (
    <SceneWrap dur={dur}>
      <Backdrop glow={C.y} x={50} y={30} />
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 110, opacity: lin(f, sw, sw + 12, 1, 0) }}>
        <Rise d={2}><T size={86}>Tarif jako u mobilu.</T></Rise>
        <div style={{ display: 'flex', gap: 50, marginTop: 80 }}>
          {cards.map((c, k) => (
            <Rise key={c.t} d={20 + k * 18} y={120} style={{ width: 470, height: 520, borderRadius: 44, background: c.g, padding: 46, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 40px 90px rgba(0,0,0,0.5)' }}>
              <Icon name={c.i} size={200} />
              <div><T size={70}>{c.t}</T><T size={36} w={600} color="rgba(255,255,255,0.9)">{c.s}</T></div>
            </Rise>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: lin(f, sw + 4, sw + 16) }}>
        <T size={70} style={{ marginBottom: 50 }}>Síťový semafor</T>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 380 }}>
          {DAILY.map((v, h) => {
            const b = bandOf(h);
            return <div key={h} style={{ width: 54, height: lin(f, sw + 10 + h * 1.5, sw + 40 + h * 1.5) * v * 3.6, borderRadius: 12, background: BC[b], boxShadow: b === 'red' ? `0 0 40px ${C.red}88` : 'none' }} />;
          })}
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 50 }}>
          {[{ b: 'green' as const, t: 'Noc a poledne', p: '0,6 c/kWh' }, { b: 'yellow' as const, t: 'Běžný den', p: '1,2 c/kWh' }, { b: 'red' as const, t: 'Večer 17–21 h', p: '3,6 c/kWh' }].map((x, k) => (
            <Rise key={x.b} d={sw + 50 + k * 12} style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.card, borderRadius: 30, padding: '22px 34px', border: `2px solid ${BC[x.b]}66` }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: BC[x.b], boxShadow: `0 0 30px ${BC[x.b]}` }} />
              <div><T size={30} w={600} color={C.mut}>{x.t}</T><T size={50} color={BC[x.b]}>{x.p}</T></div>
            </Rise>
          ))}
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
}

// 7 — výsledek: stejná potřeba = stejná cena
export function S07({ dur }: P) {
  const f = useCurrentFrame();
  const people = [
    { n: 'Marie', i: 'marie', a: MARIE_OLD, b: MARIE_NEW, d: 4, chip: '−24 € ročně', cc: C.grn },
    { n: 'Novákovi', i: 'novakovi', a: NOV_OLD, b: NOV_NEW, d: 40, chip: 'stejně jako Marie', cc: C.y },
  ];
  return (
    <SceneWrap dur={dur}>
      <Backdrop glow={C.grn} x={50} y={40} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 70 }}>
          {people.map((p) => (
            <Rise key={p.n} d={p.d} style={{ width: 760, background: C.card, borderRadius: 48, padding: 54, display: 'flex', alignItems: 'center', gap: 44, border: '1px solid rgba(255,255,255,0.07)' }}>
              <Icon name={p.i} size={200} />
              <div>
                <T size={50}>{p.n}</T>
                <T size={52} w={700} color={C.mut} style={{ textDecoration: 'line-through' }}>{fmt(p.a)} €</T>
                <T size={130} color={C.y} style={{ whiteSpace: 'nowrap' }}><Count from={p.a} to={p.b} a={p.d + 16} b={p.d + 60} /></T>
                <div style={{ opacity: lin(f, p.d + 58, p.d + 70) }}><Chip color={p.cc}>{p.chip}</Chip></div>
              </div>
            </Rise>
          ))}
        </div>
        <Rise d={150} style={{ marginTop: 80 }}><T size={92}>Stejná potřeba = <span style={{ color: C.y }}>stejná cena.</span></T></Rise>
      </AbsoluteFill>
    </SceneWrap>
  );
}

// 8 — web + AI poradce
export function S08({ dur }: P) {
  const f = useCurrentFrame();
  const prompt = 'Byt v Energiapolis, elektroauto nabíjím večer po práci';
  const typed = prompt.slice(0, Math.floor(lin(f, 24, 90, 0, prompt.length, Easing.linear)));
  const zoom = interpolate(f, [120, 175], [1, 1.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const typingBox = lin(f, 100, 118, 1, 0);
  return (
    <SceneWrap dur={dur}>
      <Backdrop glow={C.y} x={50} y={0} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Rise d={0} y={120}>
          <Browser src="shots/calc.png" w={1460} h={800} zoom={zoom} fx={0.5} fy={0.42} url="fersit.energia/kalkulacka" />
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: typingBox * lin(f, 8, 20) }}>
        <div style={{ background: 'rgba(11,11,13,0.72)', position: 'absolute', inset: 0 }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 28 }}>
          <Icon name="marie" size={170} />
          <div>
            <T size={40} w={700} color={C.y}>Popište svou domácnost</T>
            <div style={{ marginTop: 18, width: 1150, background: '#232327', borderRadius: 999, padding: '30px 44px', fontFamily: FONT, fontSize: 44, fontWeight: 600, color: '#fff', boxShadow: `0 0 0 3px ${C.y}88` }}>
              {typed}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.y }}>|</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 22, opacity: lin(f, 160, 175) }}>
        <Chip>AI odhadne spotřebu · spočítá účet · poradí, jak ušetřit</Chip>
      </AbsoluteFill>
    </SceneWrap>
  );
}

// 9 — živá mapa
export function S09({ dur }: P) {
  const f = useCurrentFrame();
  const cross = lin(f, 95, 120);
  return (
    <SceneWrap dur={dur}>
      <Backdrop glow={C.blue} x={50} y={50} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Rise d={0} y={100} style={{ position: 'relative' }}>
          <div style={{ position: 'relative', width: 1640, height: 997, borderRadius: 34, overflow: 'hidden', boxShadow: '0 60px 140px rgba(0,0,0,0.7)' }}>
            <ImgFull src="shots/map_dnes.png" />
            <div style={{ position: 'absolute', inset: 0, opacity: cross }}><ImgFull src="shots/map_fer.png" /></div>
          </div>
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0 0 150px 170px' }}>
        <div style={{ opacity: lin(f, 125, 140) }}>
          <Pop d={125}><div style={{ background: C.grn, color: '#04210f', borderRadius: 40, padding: '26px 46px', boxShadow: `0 20px 60px ${C.grn}66` }}><T size={34} w={700} color="#04210f">Večerní špička</T><T size={110} color="#04210f">−1,2 GW</T></div></Pop>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
}
function ImgFull({ src }: { src: string }) {
  return <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
}

// 10 — každý rok pokryto, bez dotací
export function S10({ dur }: P) {
  const f = useCurrentFrame();
  const ys = Array.from({ length: 11 }, (_, t) => t);
  return (
    <SceneWrap dur={dur}>
      <Backdrop glow={C.y} x={30} y={60} />
      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 110 }}>
        <div>
          <Rise d={0}><T size={44} w={600} color={C.mut}>Náklady sítě vs. vybráno</T></Rise>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 470, marginTop: 30 }}>
            {ys.map((t) => {
              const h = (fersit(t).total / 3100e6) * 400 * lin(f, 8 + t * 4, 34 + t * 4);
              return (
                <div key={t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" style={{ opacity: lin(f, 34 + t * 4, 40 + t * 4) }}><circle cx="20" cy="20" r="18" fill={`${C.grn}33`} stroke={C.grn} strokeWidth="2" /><path d="M12 20.5l5.5 5.5L28.5 14" fill="none" stroke={C.grn} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div style={{ width: 58, height: h, borderRadius: 14, background: `linear-gradient(180deg, ${C.y}, #B8860B)` }} />
                  <T size={22} w={600} color={C.mut}>{String(2027 + t).slice(2)}</T>
                </div>
              );
            })}
          </div>
          <Rise d={60}><T size={40} w={700} style={{ marginTop: 20 }}>2,5 → 3,1 mld. € · <span style={{ color: C.grn }}>100 % každý rok</span></T></Rise>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          <Rise d={70} style={{ display: 'flex', alignItems: 'center', gap: 28 }}><Icon name="stat" size={150} /><div><T size={110} color={C.y}>0 €</T><T size={40} w={600} color={C.mut}>dotací ze státního rozpočtu</T></div></Rise>
          <Rise d={110} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ position: 'relative' }}>
              <Icon name="spirala" size={150} style={{ filter: 'grayscale(0.4) drop-shadow(0 20px 30px #000)' }} />
              <svg width="150" height="150" style={{ position: 'absolute', inset: 0 }}><line x1="20" y1="20" x2={20 + 110 * lin(f, 130, 145)} y2={20 + 110 * lin(f, 130, 145)} stroke={C.y} strokeWidth="12" strokeLinecap="round" /></svg>
            </div>
            <div><T size={70}>Konec spirály</T><T size={40} w={600} color={C.mut}>zdražování</T></div>
          </Rise>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
}

// 11 — všichni vyhrávají
export function S11({ dur }: P) {
  const items = [
    { i: 'stat', n: 'Stát', b: '0 € dotací', g: 'linear-gradient(160deg,#3B82F6,#1D4ED8)' },
    { i: 'obyvatele', n: 'Obyvatelé', b: '−24 € ročně', g: 'linear-gradient(160deg,#14B8A6,#0F766E)' },
    { i: 'prumysl', n: 'Průmysl', b: '−9 %', g: 'linear-gradient(160deg,#FB923C,#C2410C)' },
    { i: 'priroda', n: 'Příroda', b: '−1 GW', g: 'linear-gradient(160deg,#F472B6,#BE185D)' },
  ];
  return (
    <SceneWrap dur={dur}>
      <Backdrop glow={C.y} x={50} y={50} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 36 }}>
        {items.map((x, k) => (
          <Pop key={x.n} d={2 + k * 9} style={{ width: 400, height: 560, borderRadius: 44, background: x.g, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 40px 90px rgba(0,0,0,0.5)' }}>
            <Icon name={x.i} size={210} />
            <div><T size={44} w={700}>{x.n}</T><T size={80}>{x.b}</T></div>
          </Pop>
        ))}
      </AbsoluteFill>
    </SceneWrap>
  );
}

// 12 — finál
export function S12({ dur }: P) {
  const f = useCurrentFrame();
  return (
    <SceneWrap dur={dur}>
      <AbsoluteFill style={{ background: C.bg }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 1300, height: 1300, borderRadius: '50%', background: `radial-gradient(circle, ${C.y}28, transparent 60%)`, transform: `scale(${1 + Math.sin(f / 10) * 0.03})` }} />
        <Pop d={0}><Icon name="ostrov" size={330} /></Pop>
        <Pop d={8}><T size={210} w={900} style={{ letterSpacing: '-0.04em' }}><span style={{ color: C.y }}>FÉR</span>SÍŤ</T></Pop>
        <Rise d={20}><T size={70} w={700}>Síť pro všechny.</T></Rise>
        <Rise d={34} style={{ display: 'flex', gap: 22, marginTop: 40 }}>{[C.grn, '#FACC15', C.red].map((c) => <div key={c} style={{ width: 40, height: 40, borderRadius: 20, background: c, boxShadow: `0 0 26px ${c}` }} />)}</Rise>
        <Rise d={44}><T size={30} w={700} color={C.mut} style={{ marginTop: 34, letterSpacing: '0.35em' }}>OSTROV ENERGIA · ENERGETICKÁ OLYMPIÁDA 2026</T></Rise>
      </AbsoluteFill>
    </SceneWrap>
  );
}
