import { motion } from 'framer-motion';
import { T } from '../content.cs';
import { fersit, bandOf, type Band } from '../model';
import { Page, H1, useHour, BAND_COLOR, Dot, Icon, num } from '../components/ui';
import { DailyBars } from '../components/charts';
import MapHeat from '../components/MapHeat';
import { Heatmap, LOAD, PV, loadColor, pvColor } from '../components/Heatmap';

export default function Semafor() {
  const hour = useHour();
  const now = bandOf(hour);
  const s = fersit(0).semH;
  const bands: Band[] = ['green', 'yellow', 'red'];
  return (
    <Page>
      <H1 icon="semafor">{T.sem.h1}</H1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {bands.map((b, i) => (
          <motion.div key={b} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}
            className={`card p-6 ${now === b ? '!border-2' : ''}`} style={now === b ? { borderColor: BAND_COLOR[b] } : {}}>
            <div className="flex items-center gap-3">
              <Dot band={b} size={44} glow />
              <div className="text-2xl font-extrabold">{T.band[b]}</div>
              {now === b && <span className="chip ml-auto text-sm"><Dot band={b} size={10} /> {T.sem.now}</span>}
            </div>
            <div className="text-5xl font-extrabold mt-5" style={{ color: BAND_COLOR[b] }}>{num(s[b] / 10, 1)} <span className="text-2xl">c/kWh</span></div>
            <div className="text-muted font-semibold mt-1">{T.sem.cards[b]}</div>
          </motion.div>
        ))}
      </div>

      <div className="card p-6 mb-5"><MapHeat /></div>
      <div className="card p-6 mb-5">
        <DailyBars hour={hour} labels={{ noc: T.sem.noc, poledne: 'Poledne', spicka: T.sem.spicka, now: T.sem.now }} />
      </div>
      {/* Heatmapy: proč semafor dává smysl */}
      <div className="card p-6 mb-5">
        <div className="text-2xl md:text-3xl font-extrabold mb-1">Síť a slunce se v zimě večer nepotkají</div>
        <div className="text-muted font-semibold mb-5">Každý čtvereček = 1 hodina v daném měsíci. Proto potřebuje síť i domácnost s fotovoltaikou.</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Heatmap data={LOAD} color={loadColor} title="Kdy síť potřebujeme" sub="Zatížení sítě, % roční špičky" hi={{ m: 0, h: 20, label: 'Leden 20:00 = 100 %' }} />
          <Heatmap data={PV} color={pvColor} title="Kdy svítí slunce" sub="Výroba fotovoltaiky (orientačně)" hi={{ m: 0, h: 20, label: 'FVE = 0 %' }} />
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <span className="chip"><Icon name="jistic" size={24} /> Špička sítě: zima, 17–21 h</span>
          <span className="chip"><Icon name="novakovi" size={24} /> FVE v lednu vyrobí jen 2,5 % roční výroby</span>
          <span className="chip"><Icon name="priroda" size={24} /> Poledne v létě = přebytek zelené energie</span>
        </div>
      </div>

    </Page>
  );
}
