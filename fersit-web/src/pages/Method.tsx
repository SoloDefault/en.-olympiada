import { motion } from 'framer-motion';
import { fersit, statusQuo, inputs, years, START_YEAR, SHARES, FAC, LOAD_FACTOR, PEAK_GW } from '../model';
import { Page, H1, Icon, eur, num, type IconName } from '../components/ui';

const STEPS: { icon: IconName; t: string; big: string; s: string }[] = [
  { icon: 'stat', t: 'Náklady sítě', big: '2 500 mil. €', s: '80 % fixních (2 000 mil. €) – připojení a špička. 20 % proměnných (500 mil. € = 9,6 €/MWh).' },
  { icon: 'jistic', t: 'Špička soustavy', big: `${num(PEAK_GW, 1)} GW`, s: `Denní diagram ø 79,8 % × roční ø 80,25 % = koeficient ${num(LOAD_FACTOR, 2)}. 52 TWh / 8 760 h / ${num(LOAD_FACTOR, 2)}.` },
  { icon: 'obyvatele', t: 'Kdo dělá špičku', big: '3,3 + 1,0 + 5,0 GW', s: 'Marie 1,1 kW × 3 mil., Novákovi 1,0 kW × 1 mil., firmy 50 kW × 100 tis. = 9,3 GW ✓ sedí s diagramy.' },
  { icon: 'semafor', t: 'Semafor z diagramu', big: '0,5 : 1 : 3', s: `Podíl odběru: zelená ${num(SHARES.green * 100, 0)} %, žlutá ${num(SHARES.yellow * 100, 0)} %, červená ${num(SHARES.red * 100, 0)} % → průměrný faktor ${num(FAC, 3)}.` },
];

const ASSUME = [
  'Jedno odběrné místo = jedna domácnost (4 mil. míst).',
  'Za 10 let 2 mil. domácností bez FVE a 2 mil. s FVE; firmy 400 → 380 MWh (vlastní FVE, úspory).',
  'Vývoj je lineární: náklady sítě +60 mil. €/rok, +100 tis. domácností s FVE ročně.',
  'Odběr všech sleduje denní diagram zatížení; baterie umí posunout červenou z 20 % na 5 %.',
  'Ve špičce (leden 20:00) FVE nevyrábí a baterie je po zimním dni prázdná → Marie 1,1 kW ≈ Novákovi 1,0 kW.',
  'FVE vyrobí v lednu jen 2,5 % roční výroby (typický profil střední Evropy, PVGIS).',
  'Chytrý elektroměr ≈ 150 € instalovaný; 4,1 mil. kusů = 615 mil. € (2028–2030), splátka 15 let.',
  'Flexibilita do 10 let: 2 mil. baterií × 0,4 kW + chemie Petrovia 0,2 GW ≈ −1 GW večerní špičky; vyhnutý náklad jen 80 €/kW (průměr sítě 269 €/kW).',
];

export default function Method() {
  const f0 = fersit(0);
  return (
    <Page>
      <H1 icon="jistic">Jak to počítáme</H1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        {STEPS.map((s, i) => (
          <motion.div key={s.t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-6">
            <div className="flex items-center gap-3"><Icon name={s.icon} size={52} /><div className="font-extrabold text-lg">{s.t}</div></div>
            <div className="text-3xl font-extrabold text-yellow mt-4">{s.big}</div>
            <div className="text-muted font-semibold mt-2 text-sm leading-relaxed">{s.s}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card p-6">
          <div className="text-2xl font-extrabold mb-4">Jak dělíme náklady</div>
          <div className="flex flex-col gap-3">
            <Row l="1. Firmy vs. domácnosti" r="77 % → 72 % za 10 let" s="Firmy dnes platí 77 %, ale tvoří ~54 % špičky. Narovnáváme postupně, aby účty domácností nevyskočily." />
            <Row l="2. Domácnosti" r="40 / 30 / 30 %" s="Připojení / jistič / semafor. Marie = Novákovi vyjde vždy, když mají jistič a semafor stejnou váhu (zkoušeno 50/25/25 i 20/40/40)." />
            <Row l="3. Firmy" r="20 / 50 / 30 %" s="Připojení / rezervovaný příkon / semafor – firma rezervuje velký výkon, platí hlavně za něj." />
            <Row l="4. Semafor" r={`${num(f0.semH.green, 2)} · ${num(f0.semH.yellow, 2)} · ${num(f0.semH.red, 2)} €/MWh`} s="Pokrývá proměnné náklady 9,6 €/MWh a navíc dává cenový signál: červená je 6× dražší než zelená." />
          </div>
        </div>
        <div className="card p-6">
          <div className="text-2xl font-extrabold mb-1">Kontrola: tarif pokryje síť každý rok</div>
          <div className="text-muted font-semibold mb-4 text-sm">Součet plateb všech zákazníků = náklady sítě. Žádná díra, žádná dotace.</div>
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-x-4 gap-y-1.5 text-sm font-semibold">
            <div className="text-muted">Rok</div><div className="text-muted text-right">Náklady sítě</div><div className="text-muted text-right">Vybráno FÉRSÍŤ</div><div className="text-muted text-right">Marie dnes → FÉR</div>
            {years.filter((t) => t % 2 === 0).map((t) => (
              <div key={t} className="contents">
                <div>{START_YEAR + t}</div>
                <div className="text-right">{num(inputs(t).cost / 1e6)} mil. €</div>
                <div className="text-right text-sgreen">{num(fersit(t).total / 1e6)} mil. € ✓</div>
                <div className="text-right">{eur(statusQuo(t).A)} → <span className="text-yellow">{eur(fersit(t).A)}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6 mb-5">
        <div className="text-2xl font-extrabold mb-4">Naše předpoklady</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ASSUME.map((a, i) => (
            <div key={i} className="bg-card2 rounded-2xl p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow text-black font-extrabold grid place-items-center shrink-0">{i + 1}</div>
              <div className="font-semibold leading-snug">{a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="text-2xl font-extrabold mb-3">Inspirace ze světa</div>
        <div className="flex flex-wrap gap-3">
          <span className="chip !text-base">Flandry (Belgie): kapacitní síťový tarif</span>
          <span className="chip !text-base">Španělsko: tři časová pásma síťových poplatků</span>
          <span className="chip !text-base">Česko: typové diagramy dodávky (TDD)</span>
          <span className="chip !text-base">Mobilní operátoři: paušál + velikost + podle času</span>
        </div>
      </div>
    </Page>
  );
}

function Row({ l, r, s }: { l: string; r: string; s: string }) {
  return (
    <div className="bg-card2 rounded-2xl p-4">
      <div className="flex justify-between gap-3 font-extrabold"><span>{l}</span><span className="text-yellow text-right">{r}</span></div>
      <div className="text-muted text-sm font-semibold mt-1">{s}</div>
    </div>
  );
}
