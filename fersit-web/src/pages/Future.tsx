import { useEffect, useState } from 'react';
import { T } from '../content.cs';
import { fersit, statusQuo, years, inputs, START_YEAR } from '../model';
import { Page, H1, PersonaSwitch, usePersona, Icon, CountUp, eur, num } from '../components/ui';
import { LineChart } from '../components/charts';

export default function Future() {
  const { persona } = usePersona();
  const [t, setT] = useState(10);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setT((x) => { if (x >= 10) { setPlay(false); return 10; } return x + 1; }), 650);
    return () => clearInterval(id);
  }, [play]);
  const key = persona === 'marie' ? 'A' : persona === 'novakovi' ? 'B' : 'F';
  const a = years.map((y) => statusQuo(y)[key]);
  const b = years.map((y) => fersit(y)[key]);
  const d = inputs(t);

  return (
    <Page>
      <H1 icon="spirala">{T.future.h1}</H1>
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <PersonaSwitch />
      </div>
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={() => { if (t >= 10) setT(0); setPlay(true); }} className="w-14 h-14 rounded-full bg-yellow text-black text-2xl font-extrabold grid place-items-center shrink-0">{play ? '❚❚' : '▶'}</button>
          <input type="range" min={0} max={10} step={1} value={t} onChange={(e) => { setPlay(false); setT(parseInt(e.target.value)); }} />
          <div className="text-3xl font-extrabold w-24 text-right">{START_YEAR + t}</div>
        </div>
        <LineChart a={a} b={b} upTo={t} years={years.map((y) => START_YEAR + y)} labels={[T.future.old, T.future.neu]} fmt={(n) => eur(n)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="card p-6"><div className="text-muted font-semibold">{T.future.c1}</div><CountUp value={(d.NB / 4e6) * 100} suffix=" %" duration={0.4} className="text-5xl font-extrabold text-yellow" /></div>
        <div className="card p-6"><div className="text-muted font-semibold">{T.future.c2}</div><CountUp value={statusQuo(t).rate / 10} d={1} suffix=" c" duration={0.4} className="text-5xl font-extrabold text-sred" /><div className="text-muted text-sm font-semibold mt-1">+34 % za 10 let: +24 % růst nákladů sítě, <span className="text-sred">+8 % jen proto, že lidé s FVE přestávají platit</span></div></div>
        <div className="card p-6"><div className="text-muted font-semibold">{T.future.c3}</div><CountUp value={d.cost / 1e9} d={2} suffix=" mld. €" duration={0.4} className="text-5xl font-extrabold" /></div>
      </div>
      <div className="card p-6 flex items-center gap-5">
        <Icon name="spirala" size={80} />
        <div>
          <div className="text-2xl font-extrabold">{T.future.spiral}</div>
          <div className="text-muted font-semibold mt-1">
            {START_YEAR + t}: {T.future.old} {eur(a[t])} · FÉRSÍŤ {eur(b[t])} → <span className={b[t] <= a[t] ? 'text-sgreen' : 'text-white'}>{b[t] <= a[t] ? '−' : '+'}{num(Math.abs((b[t] / a[t] - 1) * 100), 0)} %</span>
          </div>
        </div>
      </div>
    </Page>
  );
}
