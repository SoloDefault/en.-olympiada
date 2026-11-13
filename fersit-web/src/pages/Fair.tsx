import { motion } from 'framer-motion';
import { T } from '../content.cs';
import { fersit, statusQuo, onlyJistic } from '../model';
import { Page, H1, Icon, Mark, eur, type IconName } from '../components/ui';

export default function Fair() {
  const marie = [statusQuo(0).A, onlyJistic(0).A, fersit(0).A];
  return (
    <Page>
      <H1 icon="obyvatele">{T.fair.h1}</H1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {T.fair.rules.map((r, i) => (
          <motion.div key={r.t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`${r.grad} rounded-[30px] p-6 min-h-[220px] flex flex-col justify-between`}>
            <div className="flex justify-between items-start"><Icon name={r.icon as IconName} size={84} className="-ml-1 -mt-1" /><span className="text-5xl font-extrabold text-white/30">{i + 1}</span></div>
            <div><div className="text-2xl font-extrabold leading-tight">{r.t}</div><div className="text-white/85 font-semibold mt-1">{r.s}</div></div>
          </motion.div>
        ))}
      </div>

      <div className="text-3xl font-extrabold mb-4">{T.fair.test}</div>
      <div className="card p-4 md:p-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-x-2 border-spacing-y-0">
          <thead>
            <tr>
              <th />
              {T.fair.cols.map((c, i) => (
                <th key={c} className={`p-4 text-xl font-extrabold rounded-t-3xl ${i === 2 ? 'bg-yellow/10 border-2 border-b-0 border-yellow text-yellow' : 'text-muted'}`}>
                  {i === 2 && <div className="inline-block bg-yellow text-black text-xs rounded-full px-3 py-1 mb-1">★ {T.fair.rec}</div>}
                  <div>{c}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {T.fair.rules.map((r, ri) => (
              <tr key={r.t}>
                <td className="p-3 font-bold text-lg"><span className="flex items-center gap-3"><Icon name={r.icon as IconName} size={36} />{r.t}</span></td>
                {T.fair.matrix[ri].map((m, ci) => (
                  <td key={ci} className={`p-3 text-center ${ci === 2 ? 'bg-yellow/10 border-x-2 border-yellow' : ''}`}>
                    <Mark kind={m as 'ok' | 'warn' | 'no'} />
                    {T.fair.notes[ri][ci] && <div className="text-muted text-sm font-semibold">{T.fair.notes[ri][ci]}</div>}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-3 font-extrabold text-lg"><span className="flex items-center gap-3"><Icon name="marie" size={40} />{T.fair.marie}</span></td>
              {marie.map((v, ci) => (
                <td key={ci} className={`p-4 text-center text-3xl font-extrabold ${ci === 2 ? 'bg-yellow/10 border-2 border-t-0 border-yellow rounded-b-3xl text-yellow' : ci === 1 ? 'text-sred' : ''}`}>{eur(v)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Page>
  );
}
