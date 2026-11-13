// Serverový proxy pro AI (klíč zůstává na serveru, nikdy v prohlížeči).
import type { Plugin, Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

const FACTS = `
FÉRSÍŤ je nový tarif za síť na ostrově ENERGIA (navrhuje regulátor). Claim: „Síť platí ti, kdo ji potřebují.“
Problém dnes: síť se platí jen za kWh (48,08 €/MWh). 80 % nákladů sítě (2 500 mil. €/rok) je ale fixních – závisí na připojení a špičce, ne na kWh.
Paní Marie (panelák, bez FVE, 3 500 kWh, jistič 6 kW) dnes platí za síť 168 €/rok, Novákovi (FVE + baterie, 1 500 kWh ze sítě, jistič 11 kW) jen 72 €/rok, i když v lednu ve 20:00 potřebují síť stejně (špička 1,1 vs 1,0 kW). Skrytá dotace FVE domácnostem = 73 mil. €/rok.
Za 10 let: FVE u 50 % domácností, náklady sítě 3 100 mil. €, dnešní cena vzroste o 34 % na 64,6 €/MWh (24 % růst nákladů, 8 % jen proto, že lidé s FVE přestávají platit) = spirála smrti.
FÉRSÍŤ = 3 položky jako u mobilu: Připojení 4,80 €/měsíc, Jistič 0,50 €/kW/měsíc, Síťový semafor podle času: zelená 0,6 c/kWh (noc 23–6 h a poledne 11–15 h), žlutá 1,2 c/kWh (zbytek), červená 3,6 c/kWh (17–21 h, síť na maximu).
Firmy (VN): připojení 320 €/měsíc, příkon 8 €/kW/měsíc, stejný semafor.
Výsledek: Marie 144 € (−24 €), Novákovi 145 € (stejně jako Marie), Firma Kovář 19 231 € (stejně, ale přesunem 10 % odběru z červené do zelené ušetří 1 201 €/rok).
Pravidla férovosti: 1) Platí, kdo síť potřebuje. 2) Stejná potřeba = stejná cena. 3) Nikdo nezůstane pozadu (postupně, sociální pojistka státu). 4) Jednoduché a stabilní.
Firmy tvoří ~54 % špičky, ale platí 77 % – narovnáváme postupně na 72 % za 10 let; rychlost je politické rozhodnutí Rady.
Chytré elektroměry: 615 mil. € zaplatí síť, ne stát (59 mil. €/rok = 1,20 €/měsíc na domácnost), úspora ~100 mil. €/rok (špička −1 GW, dálkové odečty). Do jejich instalace (2028–2030) semafor podle typových diagramů (TDD).
Co regulátor nevyřeší: energetická chudoba (stát – sociální příspěvek), podpora FVE (stát z rozpočtu), nová vedení západ→východ (stát + kraje), zákon o elektroměrech, cena elektřiny a daně (trh + stát).
Komodita (silová elektřina) 50 €/MWh – není součástí síťového tarifu.
Špička soustavy 9,3 GW (52 TWh / 8 760 h / koeficient zatížení 0,64). Ostrov: vítr a slunce na západě, města a průmysl na východě.
`;

const SYS_CHAT = `Jsi „FÉRSÍŤ asistent“ – přátelský poradce regulátora ostrova ENERGIA. Odpovídáš česky, stručně (max 3–4 krátké věty), lidsky a konkrétně, s čísly z faktů. Nevymýšlej si čísla, která nejsou ve faktech; když něco nevíš, řekni to a odkaž na Kalkulačku. Pokud se někdo ptá na úsporu, dej 1 praktický tip (přesun spotřeby do zelené, menší jistič, baterie). Fakta:\n${FACTS}`;

const SYS_PROFILE = `Z popisu domácnosti nebo firmy odhadni parametry pro výpočet síťového tarifu. Vrať POUZE JSON:
{"persona":"marie"|"novakovi"|"firma","kw":číslo (jistič kW; domácnost 3–25, firma 50–300),"kwh":číslo (roční odběr ZE SÍTĚ v kWh; firma v kWh),"redShare":číslo 0–0.4 (podíl odběru mezi 17–21 h),"hasPV":bool,"hasBattery":bool,"hasEV":bool,"heatPump":bool,"label":"krátký popis česky (max 6 slov)"}
Postup (SČÍTEJ přídavky!): základ byt = 3 000 kWh, jistič 6 kW, red 0.20; základ rodinný dům = 4 500 kWh, jistič 11 kW, red 0.20.
+ tepelné čerpadlo: kwh += 4 000, kw += 4, red += 0.03
+ elektroauto: kwh += 2 500; když nabíjí večer/po práci red += 0.10
+ FVE: kwh -= 2 000 (min 800), persona "novakovi"
+ baterie: red -= 0.05
Příklad: „byt, elektroauto nabíjím večer“ → kwh 5 500, kw 6, red 0.30.
Firma/dílna/provoz: persona "firma", malá dílna ~80 000 kWh a 50 kW; provoz jen přes den (např. 7–15 h) → red 0.05. Bez FVE persona "marie".`;

const SYS_ADVICE = `Jsi energetický poradce FÉRSÍŤ. Dostaneš profil zákazníka a PŘESNĚ spočítané možnosti úspor (v €/rok). Jde o ÚČET ZA SÍŤ (síťový poplatek), ne za elektřinu – vždy piš „účet za síť“.
Formát (přesně):
1. řádek: jedna věta – kolik bude platit za síť s FÉRSÍŤ a kolik dnes (ucet_fersit_eur vs ucet_dnes_eur).
Pak 2–3 řádky, každý na NOVÉM řádku a začíná „• “: konkrétní akce pro tohoto člověka (podle popisu, např. „nabíjejte auto po 23. hodině“) + úspora z dat ve tvaru „−X € ročně“.
Poslední řádek: krátká motivační věta, proč to pomáhá síti (max 12 slov).
Používej jen čísla z dat. Celkem max 75 slov. Bez nadpisů a markdownu.`;

async function callOpenAI(key: string, model: string, messages: { role: string; content: string }[], json = false) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages, temperature: json ? 0.1 : 0.5, max_tokens: 400, ...(json ? { response_format: { type: 'json_object' } } : {}) }),
    });
    if (!r.ok) throw new Error(`OpenAI ${r.status}`);
    const d = (await r.json()) as { choices: { message: { content: string } }[] };
    return d.choices[0].message.content;
  } finally {
    clearTimeout(timer);
  }
}

function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((res, rej) => {
    let s = '';
    req.on('data', (c) => { s += c; if (s.length > 20000) rej(new Error('too big')); });
    req.on('end', () => { try { res(s ? JSON.parse(s) : {}); } catch (e) { rej(e); } });
  });
}
const send = (res: ServerResponse, code: number, obj: unknown) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
};

export function aiPlugin(env: Record<string, string>): Plugin {
  const key = env.OPENAI_API_KEY;
  const model = env.OPENAI_MODEL || 'gpt-4.1-mini';
  const mw: Connect.NextHandleFunction = async (req, res, next) => {
    if (!req.url?.startsWith('/api/ai')) return next();
    const path = req.url.replace(/\?.*$/, '');
    if (path === '/api/ai/health') return send(res, 200, { ok: !!key, model });
    if (!key) return send(res, 503, { error: 'no key' });
    try {
      const body = await readBody(req);
      if (path === '/api/ai/chat') {
        const msgs = (body.messages || []).slice(-8).map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: String(m.content).slice(0, 800) }));
        const text = await callOpenAI(key, model, [{ role: 'system', content: SYS_CHAT }, ...msgs]);
        return send(res, 200, { text });
      }
      if (path === '/api/ai/profile') {
        const out = await callOpenAI(key, model, [{ role: 'system', content: SYS_PROFILE }, { role: 'user', content: String(body.text || '').slice(0, 600) }], true);
        return send(res, 200, JSON.parse(out));
      }
      if (path === '/api/ai/advice') {
        const text = await callOpenAI(key, model, [{ role: 'system', content: SYS_ADVICE }, { role: 'user', content: JSON.stringify(body).slice(0, 3000) }]);
        return send(res, 200, { text });
      }
      return send(res, 404, { error: 'unknown' });
    } catch (e) {
      return send(res, 502, { error: String((e as Error).message) });
    }
  };
  return {
    name: 'fersit-ai',
    configureServer(s) { s.middlewares.use(mw); },
    configurePreviewServer(s) { s.middlewares.use(mw); },
  };
}
