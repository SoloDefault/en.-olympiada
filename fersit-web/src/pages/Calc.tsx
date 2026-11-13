import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { T } from '../content.cs';
import { calc, PERSONAS, SHARES, type Persona } from '../model';
import { Page, H1, Icon, CountUp, eur, num, usePersona, type IconName } from '../components/ui';
import { aiProfile, aiAdvice, type AiProfile } from '../ai';

function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt: (v: number) => string }) {
  return (
    <div>
      <div className="flex justify-between mb-2 font-semibold"><span className="text-muted">{label}</span><span className="text-yellow font-extrabold text-lg">{fmt(value)}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
  );
}
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const EXAMPLES = [
  'Byt v Energiapolis, elektroauto nabíjím večer po práci',
  'Rodinný dům s fotovoltaikou, baterií a tepelným čerpadlem',
  'Malá truhlářská dílna, jedeme od 7 do 15 h',
];

export default function Calc() {
  const { persona, setPersona } = usePersona();
  const [kw, setKw] = useState(PERSONAS[persona].kw);
  const [mwh, setMwh] = useState(PERSONAS[persona].mwh);
  const [red, setRed] = useState(Math.round(SHARES.red * 100));
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<'' | 'profile' | 'advice'>('');
  const [prof, setProf] = useState<(AiProfile & { ai: boolean }) | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);

  const pick = (p: Persona) => { setPersona(p); setKw(PERSONAS[p].kw); setMwh(PERSONAS[p].mwh); setRed(Math.round(SHARES.red * 100)); setProf(null); setAdvice(null); };

  const firm = persona === 'firma';
  const r = calc({ persona, kw, mwh, redShare: red / 100 });
  const parts = [
    { k: 'pripojeni', l: T.calc.parts.pripojeni, v: r.parts.pripojeni, c: '#3B82F6', i: 'pripojeni' as IconName },
    { k: 'jistic', l: T.calc.parts.jistic, v: r.parts.jistic, c: '#8B5CF6', i: 'jistic' as IconName },
    { k: 'semafor', l: T.calc.parts.semafor, v: r.parts.semafor, c: '#FFC531', i: 'semafor' as IconName },
  ];
  // přesně spočítané možnosti úspor (model)
  const optFor = (p: Persona, k: number, m: number, rd: number, pr?: AiProfile | null) => {
    const base = calc({ persona: p, kw: k, mwh: m, redShare: rd }).total;
    const save = (r2: number) => Math.max(0, base - calc({ persona: p, kw: k, mwh: m, redShare: Math.max(0, r2) }).total);
    const shift =
      p === 'firma' ? { t: 'Přesuňte 10 % provozu mimo 17–21 h', r: rd - 0.1 }
      : pr?.hasEV ? { t: 'Nabíjejte auto po 23. hodině', r: rd - 0.12 }
      : pr?.heatPump ? { t: 'Předtopte dům před 17. hodinou', r: rd - 0.08 }
      : { t: T.calc.s1, r: rd - 0.1 };
    const smart = pr?.hasBattery || p === 'novakovi'
      ? { t: 'Baterii vybíjejte v červené 17–21 h', icon: 'novakovi' as IconName }
      : p === 'firma' ? { t: 'Řízení spotřeby: červená jen 5 %', icon: 'prumysl' as IconName }
      : { t: 'Chytrá zásuvka/časovač: červená jen 5 %', icon: 'elektromer' as IconName };
    return [
      { id: 'green', icon: 'semafor' as IconName, t: shift.t, v: save(shift.r) },
      ...(p === 'firma' || k > 4 ? [{ id: 'jistic', icon: 'jistic' as IconName, t: p === 'firma' ? 'Snižte rezervovaný příkon o 10 kW' : 'Zmenšete jistič o 2 kW', v: (p === 'firma' ? 10 : 2) * calc({ persona: p, kw: k, mwh: m, redShare: rd }).K }] : []),
      { id: 'smart', icon: smart.icon, t: smart.t, v: save(0.05) },
    ].filter((o) => o.v > 0.05).sort((a, b) => b.v - a.v);
  };
  const opts = optFor(persona, kw, mwh, red / 100, prof);

  const runAI = async (text: string) => {
    if (!text.trim()) return;
    setQ(text); setBusy('profile'); setAdvice(null);
    const { p, ai } = await aiProfile(text);
    const per: Persona = p.persona === 'firma' ? 'firma' : p.persona === 'novakovi' ? 'novakovi' : 'marie';
    const k = per === 'firma' ? clamp(Math.round(p.kw), 20, 300) : clamp(Math.round(p.kw), 3, 25);
    const m = per === 'firma' ? clamp(Math.round(p.kwh / 1000 / 10) * 10, 20, 1000) : clamp(Math.round(p.kwh / 100) / 10, 0.5, 10);
    const rd = clamp(Math.round(p.redShare * 100), 0, 40);
    setPersona(per); setKw(k); setMwh(m); setRed(rd); setProf({ ...p, ai });
    const res = calc({ persona: per, kw: k, mwh: m, redShare: rd / 100 });
    setBusy('advice');
    const options = optFor(per, k, m, rd / 100, p).map((o) => ({ akce: o.t, uspora_eur_rok: Math.round(o.v * 100) / 100 }));
    const text2 = ai ? await aiAdvice({ popis: text, profil: p, ucet_dnes_eur: Math.round(res.today), ucet_fersit_eur: Math.round(res.total), moznosti: options }) : null;
    setAdvice((text2 ?? `Váš účet za síť s FÉRSÍŤ: ${eur(res.total)} ročně (dnes ${eur(res.today)}).\n` + options.map((o) => `• ${o.akce}: −${eur(o.uspora_eur_rok, 2)} ročně`).join('\n')).replace(/\s+•\s/g, '\n• ').trim());
    setBusy('');
  };

  const tags = prof ? [prof.hasPV && 'FVE', prof.hasBattery && 'Baterie', prof.heatPump && 'Tepelné čerpadlo', prof.hasEV && 'Elektroauto'].filter(Boolean) as string[] : [];

  return (
    <Page>
      <H1 icon="elektromer">{T.calc.h1}</H1>

      {/* AI poradce */}
      <div className="card p-6 mb-5 relative overflow-hidden">
        <div className="absolute -left-20 -bottom-24 w-80 h-80 rounded-full bg-yellow/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row gap-5 lg:items-center">
          <div className="flex items-center gap-3 lg:w-72 shrink-0">
            <Icon name="marie" size={64} />
            <div><div className="font-extrabold text-xl">Popište svou domácnost</div><div className="text-muted text-sm font-semibold">AI odhadne spotřebu a spočítá účet</div></div>
          </div>
          <form className="flex-1 flex gap-2" onSubmit={(e) => { e.preventDefault(); runAI(q); }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Např. „Bydlím v domě, mám elektroauto a nabíjím ho večer“"
              className="flex-1 bg-card2 rounded-full px-5 py-4 outline-none focus:ring-2 ring-yellow/60 font-semibold" />
            <button disabled={!!busy} className="bg-yellow text-black font-extrabold rounded-full px-6 disabled:opacity-60 whitespace-nowrap">{busy === 'profile' ? 'Počítám…' : 'Spočítat →'}</button>
          </form>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-4">
          {EXAMPLES.map((e) => <button key={e} onClick={() => runAI(e)} className="chip !text-sm hover:!bg-card2">{e}</button>)}
        </div>
        <AnimatePresence>
          {(prof || busy) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative mt-5 bg-card2 rounded-3xl p-5">
              {prof && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-muted font-semibold">{prof.ai ? 'AI rozpoznala:' : 'Odhad:'}</span>
                  <span className="font-extrabold">{prof.label}</span>
                  {tags.map((t) => <span key={t} className="chip !py-1 !text-sm !bg-yellow/15 !text-yellow !border-0">{t}</span>)}
                  <span className="chip !py-1 !text-sm">{firm ? `${num(mwh)} MWh` : `${num(mwh * 1000)} kWh`} · {kw} kW · {red} % v červené</span>
                </div>
              )}
              {busy ? (
                <div className="flex items-center gap-3 text-muted font-semibold">
                  <motion.span className="w-3 h-3 rounded-full bg-yellow" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.9 }} />
                  {busy === 'profile' ? 'Analyzuji popis…' : 'Připravuji osobní plán úspor…'}
                </div>
              ) : advice && (
                <div className="whitespace-pre-wrap text-[17px] leading-relaxed font-semibold">{advice}</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {(Object.keys(PERSONAS) as Persona[]).map((p) => (
          <button key={p} onClick={() => pick(p)} className={`card p-4 flex items-center gap-4 text-left transition ${persona === p && !prof ? '!border-yellow !border-2' : 'hover:bg-card2'}`}>
            <Icon name={p} size={64} />
            <div><div className="font-extrabold text-lg">{PERSONAS[p].name}</div><div className="text-muted text-sm">{PERSONAS[p].place}</div></div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="card p-7 lg:col-span-2 flex flex-col gap-7">
          <Slider label={T.calc.jistic} value={kw} min={firm ? 20 : 3} max={firm ? 300 : 25} step={1} onChange={setKw} fmt={(v) => `${v} kW`} />
          {firm
            ? <Slider label={T.calc.spotrebaF} value={mwh} min={20} max={1000} step={10} onChange={setMwh} fmt={(v) => `${num(v)} MWh`} />
            : <Slider label={T.calc.spotreba} value={mwh * 1000} min={500} max={10000} step={100} onChange={(v) => setMwh(v / 1000)} fmt={(v) => `${num(v)} kWh`} />}
          <Slider label={T.calc.red} value={red} min={0} max={40} step={1} onChange={setRed} fmt={(v) => `${v} %`} />
          <div className="mt-auto flex items-center gap-3 bg-card2 rounded-2xl p-4">
            <Icon name="semafor" size={44} />
            <div className="text-sm text-muted font-semibold">Červená 17–21 h je 6× dražší než zelená. Přesun spotřeby = úspora pro vás i pro síť.</div>
          </div>
        </div>

        <div className="card p-7 lg:col-span-3">
          <div className="flex items-end flex-wrap gap-x-5 gap-y-2">
            <div>
              <div className="text-muted font-semibold">{T.calc.dnes}</div>
              <div className="text-4xl font-extrabold text-muted line-through">{eur(r.today)}</div>
            </div>
            <div className="text-4xl text-muted mb-1">→</div>
            <div>
              <div className="text-yellow font-semibold">FÉRSÍŤ</div>
              <CountUp value={r.total} duration={0.4} className="text-6xl md:text-7xl font-extrabold text-yellow leading-none" />
            </div>
            <span className={`chip !border-0 mb-2 ${r.diff < -0.5 ? 'bg-sgreen/20 text-sgreen' : r.diff > 0.5 ? 'bg-sred/20 text-sred' : 'bg-white/10'}`}>
              {r.diff < 0 ? '−' : '+'}{eur(Math.abs(r.diff))} / rok
            </span>
          </div>

          <div className="mt-7 h-12 flex rounded-2xl overflow-hidden">
            {parts.map((p) => (
              <motion.div key={p.k} animate={{ flexGrow: Math.max(p.v, 0.01) }} transition={{ duration: 0.4 }}
                style={{ background: p.c, flexBasis: 0 }} className="grid place-items-center text-black font-extrabold text-sm overflow-hidden whitespace-nowrap">
                {p.v / r.total > 0.12 ? eur(p.v) : ''}
              </motion.div>
            ))}
          </div>
          <div className="flex gap-5 mt-3 flex-wrap">
            {parts.map((p) => (
              <div key={p.k} className="flex items-center gap-2 font-semibold"><Icon name={p.i} size={28} /><span className="w-3 h-3 rounded" style={{ background: p.c }} />{p.l} <span className="text-muted">{eur(p.v, firm ? 0 : 2)}</span></div>
            ))}
          </div>

          <div className="mt-8">
            <div className="font-extrabold text-xl mb-3">{T.calc.save}</div>
            <div className="flex flex-col gap-2">
              {opts.map((x) => (
                <div key={x.id} className="flex justify-between items-center bg-card2 rounded-2xl px-4 py-2.5 font-semibold">
                  <span className="flex items-center gap-3"><Icon name={x.icon} size={36} />{x.t}</span><span className="text-sgreen font-extrabold">−{eur(x.v, x.v < 100 ? 2 : 0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
