import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { aiChat } from '../ai';
import { Icon } from './ui';

type Msg = { role: 'user' | 'assistant'; content: string };
const SUGGEST = ['Proč mám s FVE platit víc?', 'Kdy je síť nejlevnější?', 'Mám elektroauto, jak ušetřím?', 'Kdo zaplatí chytré elektroměry?'];

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', content: 'Ahoj! Jsem asistent FÉRSÍŤ. Zeptejte se mě na cokoli o novém tarifu – spočítám, vysvětlím, poradím.' }]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { box.current?.scrollTo({ top: 1e6, behavior: 'smooth' }); }, [msgs, busy]);

  const ask = async (q: string) => {
    if (!q.trim() || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: q.trim() }];
    setMsgs(next); setText(''); setBusy(true);
    const a = await aiChat(next.slice(1));
    setMsgs([...next, { role: 'assistant', content: a ?? 'Teď jsem offline. Zkuste Kalkulačku – spočítá váš účet i bez internetu.' }]);
    setBusy(false);
  };

  return (
    <>
      <motion.button onClick={() => setOpen((o) => !o)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="fixed z-50 right-5 bottom-5 flex items-center gap-2 bg-yellow text-black font-extrabold rounded-full pl-2 pr-5 py-2 shadow-[0_10px_40px_rgba(255,197,49,0.35)]">
        <Icon name="elektromer" size={44} />{open ? 'Zavřít' : 'Zeptej se FÉRSÍTĚ'}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }}
            className="fixed z-50 right-5 bottom-24 w-[min(420px,calc(100vw-40px))] h-[min(560px,calc(100vh-140px))] card !bg-[#141417] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <Icon name="elektromer" size={44} />
              <div><div className="font-extrabold">Asistent FÉRSÍŤ</div><div className="text-xs text-muted flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sgreen inline-block" />AI · odpovídá z dat regulátora</div></div>
            </div>
            <div ref={box} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {msgs.map((m, i) => (
                <div key={i} className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] leading-snug whitespace-pre-wrap ${m.role === 'user' ? 'self-end bg-yellow text-black font-semibold' : 'self-start bg-card2'}`}>{m.content}</div>
              ))}
              {busy && <div className="self-start bg-card2 px-4 py-3 rounded-2xl flex gap-1">{[0, 1, 2].map((k) => <motion.span key={k} className="w-2 h-2 rounded-full bg-muted" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: k * 0.2 }} />)}</div>}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {SUGGEST.map((s) => <button key={s} onClick={() => ask(s)} className="chip !text-sm hover:!bg-card2">{s}</button>)}
                </div>
              )}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="p-3 border-t border-white/5 flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Napište otázku…" className="flex-1 bg-card2 rounded-full px-4 py-3 outline-none focus:ring-2 ring-yellow/60" />
              <button disabled={busy} className="w-12 h-12 rounded-full bg-yellow text-black font-extrabold text-xl disabled:opacity-50">→</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
