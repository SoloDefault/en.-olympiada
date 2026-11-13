import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { T } from '../content.cs';
import { fersit, statusQuo, savings, ISLAND_NAME, bandOf } from '../model';
import { Page, PersonaSwitch, usePersona, useHour, Icon, CountUp, eur, GradCard, Dot, type IconName } from '../components/ui';
import { SemaforStrip } from '../components/charts';

export default function Home() {
  const { persona } = usePersona();
  const hour = useHour();
  const band = bandOf(hour);
  const f = fersit(0), s = statusQuo(0);
  const now = persona === 'marie' ? f.A : persona === 'novakovi' ? f.B : f.F;
  const old = persona === 'marie' ? s.A : persona === 'novakovi' ? s.B : s.F;
  const diff = now - old;
  const name = persona === 'marie' ? 'Marie' : persona === 'novakovi' ? 'Novákovi' : 'Firma Kovář';
  const sub = persona === 'marie' ? T.home.sub.marie : persona === 'novakovi' ? T.home.sub.novakovi : T.home.sub.firma(eur(savings().firmShift));
  const chip =
    persona === 'novakovi' ? { t: `+${Math.round(diff / 12)} € měsíčně`, c: 'bg-white/10 text-white' }
    : Math.abs(diff) < 1 ? { t: '± 0 €', c: 'bg-white/10 text-white' }
    : { t: `${diff < 0 ? '−' : '+'}${eur(Math.abs(diff))}`, c: diff < 0 ? 'bg-sgreen/20 text-sgreen' : 'bg-sred/20 text-sred' };

  return (
    <Page>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="chip"><Dot band={band} glow /> {T.nowLights(T.band[band])}</span>
        <span className="chip"><Icon name="ostrov" size={22} /> {T.ostrov} {ISLAND_NAME}</span>
        <span className="chip">„{T.claim}“</span>
      </div>

      <div className="mb-5"><PersonaSwitch /></div>

      <motion.div key={persona} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card p-7 md:p-10 mb-5 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-yellow/10 blur-3xl" />
        <div className="flex flex-col md:flex-row md:items-center gap-8 relative">
          <motion.div initial={{ rotate: -8, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <Icon name={persona} size={150} />
          </motion.div>
          <div className="flex-1">
            <div className="text-2xl font-extrabold">{T.home.hello} {name}</div>
            <div className="text-muted font-semibold mt-1">{T.home.bill}</div>
            <div className="flex items-end flex-wrap gap-x-4 gap-y-2 mt-2">
              <CountUp value={now} className="text-6xl md:text-7xl font-extrabold text-yellow leading-none" />
              <span className="text-muted font-semibold text-xl mb-1">{T.home.perYear}</span>
              <span className="text-2xl text-muted line-through mb-1">{eur(old)}</span>
              <span className={`chip !border-0 !text-lg ${chip.c} mb-1`}>{chip.t}</span>
            </div>
            <div className="mt-3 text-lg font-semibold">{sub}</div>
          </div>
          <Link to="/kalkulacka" className="bg-yellow text-black font-extrabold rounded-full px-7 py-4 text-lg flex items-center gap-3 self-start md:self-center hover:brightness-105">
            {T.home.cta} <span className="text-2xl">→</span>
          </Link>
        </div>
      </motion.div>

      <div className="card p-6 mb-5">
        <div className="flex justify-between items-center mb-3">
          <div className="font-extrabold text-lg flex items-center gap-2"><Icon name="semafor" size={34} /> {T.home.today}</div>
          <Link to="/semafor" className="text-muted text-sm font-semibold hover:text-white">0,6 · 1,2 · 3,6 c/kWh →</Link>
        </div>
        <SemaforStrip hour={hour} nowLabel={T.sem.now} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {T.home.cards.map((c) => <GradCard key={c.to} {...c} icon={c.icon as IconName} />)}
      </div>
    </Page>
  );
}
