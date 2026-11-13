import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { T, TRILEMA, balance } from '../content.cs';
import { Page, H1, Icon, num, type IconName } from '../components/ui';
import { Radar } from '../components/charts';

export default function Rada() {
  const [votes, setVotes] = useState<string[]>([]);
  const [voting, setVoting] = useState(false);
  const done = votes.length === 4;
  const vote = (w: string) => setVotes((prev) => (prev.includes(w) ? prev : [...prev, w]));
  useEffect(() => {
    if (!done) return;
    const fire = (o: number) => confetti({ particleCount: 140, spread: 90, origin: { x: o, y: 0.7 }, colors: ['#FFC531', '#22C55E', '#ffffff', '#3B82F6'] });
    fire(0.25); fire(0.75); setTimeout(() => fire(0.5), 300);
  }, [done]);

  return (
    <Page>
      <H1 icon="stat">{T.rada.h1}</H1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        {T.rada.benefits.map((b, i) => (
          <motion.div key={b.who} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`${b.grad} rounded-[30px] p-6 min-h-[210px] flex flex-col justify-between`}>
            <div className="flex items-center gap-3"><Icon name={b.icon as IconName} size={76} className="-ml-1 -mt-1" /><div className="text-xl font-extrabold">{b.who}</div></div>
            <div><div className="text-4xl font-extrabold">{b.big}</div><div className="text-white/90 font-semibold mt-1 leading-snug">{b.line}</div></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card p-6">
          <div className="text-2xl font-extrabold mb-2">{T.rada.trilema}</div>
          <Radar dims={TRILEMA.dims} a={TRILEMA.dnes} b={TRILEMA.fersit} labels={['Dnes', 'FÉRSÍŤ']} />
          <div className="text-center font-extrabold text-xl mt-2">
            {T.rada.index}: <span className="text-muted">{num(balance(TRILEMA.dnes), 2)}</span> → <span className="text-yellow">{num(balance(TRILEMA.fersit), 2)}</span>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {[
              { d: 'Bezpečnost 3 → 4', s: 'Semafor snižuje večerní špičku o ~1 GW a síť má stabilní příjem na údržbu.' },
              { d: 'Dostupnost 2,3 → 4,7', s: 'Marie platí méně hned, konec skrytých dotací a spirály smrti, sociální pojistka státu.' },
              { d: 'Udržitelnost 3,7 → 4', s: 'FVE se vyplatí dál, zelené poledne využije OZE ze západu, méně nových vedení přes krajinu.' },
            ].map((x) => (
              <div key={x.d} className="bg-card2 rounded-2xl px-4 py-3"><span className="font-extrabold text-yellow">{x.d}</span> <span className="text-muted font-semibold">– {x.s}</span></div>
            ))}
            <div className="text-sm text-muted font-semibold">Proč ne 5/5 všude? Tarif nestaví nové zdroje – bezpečnost a emise ovlivní hlavně investice státu a trhu.</div>
          </div>
        </div>
        <div className="card p-6">
          <div className="text-2xl font-extrabold mb-4">{T.rada.nevyresi}</div>
          <div className="flex flex-col gap-2.5">
            {T.rada.rows.map((r) => (
              <div key={r.p} className="bg-card2 rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
                <div><div className="font-bold text-lg">{r.p}</div>{r.s && <div className="text-muted text-sm font-semibold">{r.s}</div>}</div>
                <span className="chip !bg-yellow !text-black !border-0 shrink-0">{r.who}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6 md:p-8 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <Icon name="elektromer" size={110} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 text-2xl md:text-3xl font-extrabold">
              <span className="text-yellow">{T.rada.inv[0]}</span><span className="text-muted">→</span><span>{T.rada.inv[1]}</span><span className="text-muted">→</span><span className="text-sgreen">{T.rada.inv[2]}</span>
            </div>
            <div className="text-muted font-semibold mt-2">{T.rada.ask}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          {T.rada.timeline.map((s, i) => (
            <div key={s.y} className="bg-card2 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow text-black font-extrabold grid place-items-center">{i + 1}</div>
              <div><div className="font-extrabold text-lg">{s.y}</div><div className="text-muted font-semibold">{s.t}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 md:p-8 text-center">
        {!voting && !done && (
          <button onClick={() => setVoting(true)} className="bg-yellow text-black font-extrabold rounded-full px-10 py-5 text-2xl hover:brightness-105">{T.rada.approve} →</button>
        )}
        {(voting || done) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {T.rada.benefits.map((b) => {
              const on = votes.includes(b.who);
              return (
                <motion.button key={b.who} whileTap={{ scale: 0.95 }} onClick={() => vote(b.who)}
                  className={`rounded-3xl p-5 font-extrabold text-xl transition ${on ? 'bg-sgreen text-black' : 'bg-card2 hover:bg-white/10'}`}>
                  <div className="flex justify-center mb-1"><Icon name={b.icon as IconName} size={72} /></div>{b.who}<div className="text-sm mt-1">{on ? '✓ ANO' : 'hlasovat'}</div>
                </motion.button>
              );
            })}
          </div>
        )}
        {done && <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl font-extrabold text-sgreen mt-6">✓ {T.rada.approved}</motion.div>}
      </div>
    </Page>
  );
}
