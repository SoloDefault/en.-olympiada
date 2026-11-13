import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './index.css';
import { T } from './content.cs';
import { PersonaProvider, Icon, type IconName } from './components/ui';
import Chat from './components/Chat';
import Home from './pages/Home';
import Calc from './pages/Calc';
import Semafor from './pages/Semafor';
import Future from './pages/Future';
import Fair from './pages/Fair';
import Rada from './pages/Rada';
import Promo from './pages/Promo';
import Method from './pages/Method';

const NAV: { to: string; label: string; e: IconName }[] = [
  { to: '/', label: T.nav.home, e: 'ostrov' },
  { to: '/kalkulacka', label: T.nav.calc, e: 'elektromer' },
  { to: '/semafor', label: T.nav.semafor, e: 'semafor' },
  { to: '/za-10-let', label: T.nav.future, e: 'spirala' },
  { to: '/ferovost', label: T.nav.fair, e: 'obyvatele' },
  { to: '/pro-radu', label: T.nav.rada, e: 'stat' },
  { to: '/jak-pocitame', label: 'Výpočty', e: 'jistic' },
];

function Logo({ small }: { small?: boolean }) {
  return (
    <div className={`font-extrabold tracking-tight ${small ? 'text-lg' : 'text-2xl'}`}>
      <span className="text-yellow">FÉR</span>SÍŤ
    </div>
  );
}

function Shell() {
  const loc = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  if (loc.pathname === '/promo') return <Promo />;
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-[104px] md:h-screen md:sticky md:top-0 bg-bg border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center md:py-6 px-2 gap-1 overflow-x-auto">
        <div className="hidden md:block mb-6"><Logo small /></div>
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}
            className={({ isActive }) => `flex flex-col items-center gap-1 px-2 py-2.5 rounded-2xl w-[84px] shrink-0 text-[12px] font-semibold transition ${isActive ? 'bg-yellow text-black' : 'text-muted hover:text-white hover:bg-card'}`}>
            <Icon name={n.e} size={38} />{n.label}
          </NavLink>
        ))}
        <div className="hidden md:flex mt-auto flex-col items-center text-[10px] text-muted text-center"><Icon name="ostrov" size={46} />Ostrov<br />ENERGIA</div>
      </aside>
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <Routes location={loc} key={loc.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/kalkulacka" element={<Calc />} />
            <Route path="/semafor" element={<Semafor />} />
            <Route path="/za-10-let" element={<Future />} />
            <Route path="/ferovost" element={<Fair />} />
            <Route path="/pro-radu" element={<Rada />} />
            <Route path="/jak-pocitame" element={<Method />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Chat />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <PersonaProvider>
        <Shell />
      </PersonaProvider>
    </HashRouter>
  </React.StrictMode>,
);
