// FÉRSÍŤ — prezentace (pptxgenjs). Spuštění: node build.js
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');

const OUT = path.join(__dirname, 'FERSIT_prezentace.pptx');
const IMG = (n) => path.join(__dirname, 'img', n);
const SHOT = (n) => path.join(__dirname, '..', 'fersit-web', 'public', 'shots', n);
const VIDEO = path.join(__dirname, '..', 'video', 'fersit_video_final.mp4');

const BG = '0B0B0D', CARD = '17171A', CARD2 = '222226', Y = 'FFC531', MUT = 'A1A1AA', W = 'FFFFFF',
  G = '22C55E', R = 'EF4444', SY = 'FACC15', BLUE = '2563EB', TEAL = '0D9488', ORANGE = 'EA580C', PURPLE = '7C3AED', PINK = 'DB2777';
const H = 'Montserrat ExtraBold', BLK = 'Montserrat Black', B = 'Montserrat', MED = 'Montserrat Medium', SEMI = 'Montserrat SemiBold';

const THEME = {
  name: 'FERSIT', headFontFace: H, bodyFontFace: MED,
  colors: { dk1: BG, lt1: W, dk2: CARD, lt2: MUT, accent1: Y, accent2: G, accent3: R, accent4: SY, accent5: BLUE, accent6: PURPLE, hlink: Y, folHlink: SY },
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 × 7.5 in
pres.theme = { headFontFace: H, bodyFontFace: MED };
pres.title = 'FÉRSÍŤ – spravedlivé síťové tarify';
pres.author = 'Tým Ivaň (č. 15)';

pres.defineSlideMaster({ title: 'DARK', background: { color: BG }, objects: [] });
pres.defineSlideMaster({
  title: 'CONTENT', background: { color: BG },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.42, w: 12.1, h: 0.95, fontFace: H, fontSize: 40, color: W, valign: 'middle', margin: 0 }, text: '' } },
  ],
});

// ---------- pomocníci ----------
const T = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontFace: MED, color: W, valign: 'top', ...o });
const card = (s, x, y, w, h, color = CARD, name) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color }, line: { color, width: 0 }, rectRadius: 0.22, objectName: name });
const icon = (s, n, x, y, size) => s.addImage({ path: IMG(n + '.png'), x, y, w: size, h: size, objectName: 'icon-' + n });
const glow = (s, n, x, y, size) => s.addImage({ path: IMG(n + '.png'), x, y, w: size, h: size, objectName: 'glow' });
const dot = (s, color, x, y, d) => s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 } });
const chip = (s, text, x, y, w, h, fill = Y, color = '111111', size = 16) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 }, rectRadius: h / 2 });
  T(s, text, { x, y, w, h, fontFace: H, fontSize: size, color, align: 'center', valign: 'middle' });
};
const title = (s, runs) => s.addText(runs, { placeholder: 'title' });

// =============== HLAVNÍ ČÁST ===============
pres.addSection({ title: 'Prezentace (4 min)' });

// 1 — Titul
{
  const s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Prezentace (4 min)' });
  glow(s, 'glow_y', 6.4, -0.6, 8.2);
  icon(s, 'ostrov', 7.3, 1.05, 5.6);
  T(s, 'Energetická olympiáda 2026  ·  Zadání 7  ·  ERÚ', { x: 0.7, y: 0.7, w: 7, h: 0.4, fontFace: SEMI, fontSize: 15, color: MUT });
  T(s, [{ text: 'FÉR', options: { color: Y } }, { text: 'SÍŤ', options: { color: W } }], { x: 0.62, y: 1.85, w: 7.2, h: 1.9, fontFace: BLK, fontSize: 120, charSpacing: -2 });
  T(s, 'Síť platí ti, kdo ji potřebují.', { x: 0.7, y: 3.85, w: 6.8, h: 0.6, fontFace: SEMI, fontSize: 28 });
  T(s, 'Spravedlivé síťové tarify pro ostrov ENERGIA', { x: 0.7, y: 4.5, w: 6.8, h: 0.45, fontSize: 18, color: MUT });
  [G, SY, R].forEach((c, i) => dot(s, c, 0.72 + i * 0.5, 5.35, 0.3));
  T(s, [{ text: 'Tým Ivaň', options: { fontFace: H, color: W } }, { text: '   ·   tým č. 15', options: { color: MUT } }], { x: 0.7, y: 6.5, w: 6, h: 0.4, fontSize: 16 });
  s.addNotes('A (15 s): Dobrý den, vážená Rado ostrova Energia. Jsme tým Ivaň a jsme nezávislí energetičtí architekti. Zeptali jste se nás: kdo má platit za síť, aby to bylo férové? Odpověď vám ukážeme na příběhu jedné paní z paneláku. → spustit video');
}

// 2 — Video
{
  const s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Prezentace (4 min)' });
  const cover = 'data:image/jpeg;base64,' + fs.readFileSync(IMG('poster.jpg')).toString('base64');
  s.addMedia({ type: 'video', path: VIDEO, x: 0, y: 0, w: 13.333, h: 7.5, cover, objectName: 'video-fersit' });
  s.addNotes('VIDEO (85 s). Oba mlčíme a stojíme stranou. Video se spustí samo (případně kliknout).');
}

// 3 — Co je férové
{
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Prezentace (4 min)' });
  title(s, [{ text: 'Co je ' }, { text: 'férové?', options: { color: Y } }]);
  const rules = [
    { n: '01', t: 'Platí, kdo síť potřebuje', d: 'Za připojení a špičku, ne za kWh', c: BLUE, i: 'pripojeni' },
    { n: '02', t: 'Stejná potřeba = stejná cena', d: 'Žádné skryté dotace', c: TEAL, i: 'jistic' },
    { n: '03', t: 'Nikdo nezůstane pozadu', d: 'Postupně a se sociální pojistkou', c: ORANGE, i: 'obyvatele' },
    { n: '04', t: 'Jednoduché a stabilní', d: '3 položky, žádná spirála', c: PURPLE, i: 'semafor' },
  ];
  rules.forEach((r, k) => {
    const x = 0.6 + k * 3.075, y = 1.75;
    card(s, x, y, 2.9, 4.75, r.c, 'rule-' + r.n);
    icon(s, r.i, x + 0.2, y + 0.25, 1.75);
    T(s, r.n, { x: x + 1.9, y: y + 0.3, w: 0.8, h: 0.5, fontFace: BLK, fontSize: 24, color: W, align: 'right', transparency: 45 });
    T(s, r.t, { x: x + 0.3, y: y + 2.45, w: 2.4, h: 1.3, fontFace: H, fontSize: 22, valign: 'bottom' });
    T(s, r.d, { x: x + 0.3, y: y + 3.9, w: 2.4, h: 0.6, fontFace: MED, fontSize: 14, color: 'F4F4F5' });
  });
  s.addNotes('B (20 s): Co je pro nás férové? Čtyři pravidla. Platí, kdo síť potřebuje – za připojení a špičku, ne za kilowatthodiny. Stejná potřeba – stejná cena. Nikdo nezůstane pozadu. A tarif musí být jednoduchý a stabilní.');
}

// 4 — Trilema
{
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Prezentace (4 min)' });
  title(s, [{ text: 'Energetické ' }, { text: 'trilema', options: { color: Y } }]);
  card(s, 0.6, 1.6, 6.3, 5.3, CARD, 'trilema-chart-card');
  s.addChart(pres.charts.RADAR, [
    { name: 'FÉRSÍŤ', labels: ['Bezpečnost', 'Dostupnost', 'Udržitelnost'], values: [4.0, 4.67, 4.0] },
    { name: 'Dnes', labels: ['Bezpečnost', 'Dostupnost', 'Udržitelnost'], values: [3.0, 2.33, 3.67] },
  ], {
    x: 0.75, y: 1.7, w: 6.0, h: 5.1, radarStyle: 'filled', chartColors: [Y, 'E4E4E7'], chartColorsOpacity: 60,
    valAxisMinVal: 0, valAxisMaxVal: 5, valAxisMajorUnit: 1, valAxisLabelColor: '71717A', valAxisLabelFontSize: 10, valAxisLabelFontFace: '+mn-lt',
    catAxisLabelColor: W, catAxisLabelFontSize: 15, catAxisLabelFontFace: '+mj-lt',
    valGridLine: { color: '3F3F46', size: 1 }, catGridLine: { color: '3F3F46', size: 1 },
    showLegend: true, legendPos: 'b', legendColor: MUT, legendFontSize: 13, legendFontFace: '+mn-lt', objectName: 'trilema-radar',
  });
  const rows = [
    { l: 'Dostupnost', a: '2,3', b: '4,7', d: 'Marie platí méně hned. Konec skrytých dotací a spirály smrti.', c: G },
    { l: 'Bezpečnost', a: '3,0', b: '4,0', d: 'Semafor sníží večerní špičku o ~1 GW.', c: Y },
    { l: 'Udržitelnost', a: '3,7', b: '4,0', d: 'Fotovoltaika se vyplatí dál, méně nových vedení.', c: Y },
  ];
  rows.forEach((r, k) => {
    const y = 1.6 + k * 1.42;
    T(s, r.l, { x: 7.3, y, w: 2.6, h: 0.4, fontFace: SEMI, fontSize: 16, color: MUT });
    T(s, [{ text: r.a + '  →  ', options: { color: '71717A' } }, { text: r.b, options: { color: r.c } }], { x: 9.6, y: y - 0.08, w: 3.1, h: 0.55, fontFace: BLK, fontSize: 30, align: 'right' });
    T(s, r.d, { x: 7.3, y: y + 0.5, w: 5.4, h: 0.7, fontSize: 15 });
  });
  card(s, 7.3, 5.95, 5.4, 0.95, CARD2, 'balance-card');
  T(s, [{ text: 'Proč ne 5/5?  ', options: { fontFace: H, color: Y } }, { text: 'Tarif sám elektrárny nestaví – bezpečnost a emise řeší investice.' }], { x: 7.55, y: 6.0, w: 5.0, h: 0.85, fontSize: 14, valign: 'middle' });
  s.addNotes('B (35 s): Proto vypadá naše trilema takhle. Nejvíc roste dostupnost – z 2,3 na 4,7: Marie platí méně hned a končí skrytá dotace i spirála smrti. Bezpečnost roste, protože semafor sníží večerní špičku asi o jeden gigawatt. Udržitelnost držíme – fotovoltaika se vyplatí dál. Pětky všude záměrně nemáme: tarif sám elektrárny nestaví. Index vyváženosti stoupá z 0,73 na 0,87.');
}

// 5 — Proveditelnost
{
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Prezentace (4 min)' });
  title(s, [{ text: 'Uživí se sama. ' }, { text: 'Bez dotací.', options: { color: Y } }]);
  const stats = [
    { big: '2,5 → 3,1', unit: '', l: 'mld. € nákladů sítě za 10 let', c: W },
    { big: '100 %', unit: '', l: 'pokryto tarifem každý rok', c: G },
    { big: '0 €', unit: '', l: 'ze státního rozpočtu', c: Y },
  ];
  stats.forEach((st, k) => {
    const x = 0.6 + k * 4.1;
    card(s, x, 1.6, 3.9, 1.95, CARD, 'stat-' + k);
    T(s, [{ text: st.big, options: { color: st.c } }, { text: st.unit, options: { color: st.c, fontSize: 22 } }], { x: x + 0.35, y: 1.8, w: 3.4, h: 0.95, fontFace: BLK, fontSize: 40, valign: 'middle' });
    T(s, st.l, { x: x + 0.35, y: 2.8, w: 3.3, h: 0.5, fontSize: 15, color: MUT });
  });
  const steps = [
    { y: '2027', t: 'Připojení + jistič', d: 'Funguje hned, bez nové techniky', i: 'pripojeni' },
    { y: '2028–2030', t: 'Chytré elektroměry', d: '615 mil. € · vrátí se za 6 let', i: 'elektromer' },
    { y: '2030+', t: 'Plný semafor', d: 'Večerní špička −1 GW', i: 'semafor' },
  ];
  steps.forEach((st, k) => {
    const x = 0.6 + k * 4.1;
    dot(s, CARD2, x + 0.1, 3.95, 1.4);
    icon(s, st.i, x + 0.25, 4.1, 1.1);
    T(s, st.y, { x: x + 1.7, y: 4.0, w: 2.3, h: 0.5, fontFace: BLK, fontSize: 24, color: Y });
    T(s, st.t, { x: x + 1.7, y: 4.5, w: 2.3, h: 0.45, fontFace: H, fontSize: 17 });
    T(s, st.d, { x: x + 0.1, y: 5.6, w: 3.7, h: 0.75, fontSize: 15, color: MUT });
  });
  T(s, 'Vychází z dat zadání: 80 % nákladů je fixních · špička soustavy 9,3 GW z diagramů zatížení · všechny předpoklady jsou na webu', { x: 0.6, y: 6.65, w: 12.1, h: 0.4, fontSize: 12, color: '71717A' });
  s.addNotes('A (30 s): Je to proveditelné? Tarif každý rok přesně pokryje náklady sítě – od 2,5 do 3,1 miliardy eur – bez dotací ze státního rozpočtu. Vycházíme z vašich dat: 80 procent nákladů je fixních, špička 9,3 gigawattu z diagramů zatížení. Zavedení má tři kroky: 2027 připojení a jistič, do roku 2030 chytré elektroměry za 615 milionů – zaplatí je síť a vrátí se za šest let – a pak plný semafor.');
}

// 6 — Co regulátor nevyřeší
{
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Prezentace (4 min)' });
  title(s, [{ text: 'Co regulátor ' }, { text: 'sám nevyřeší', options: { color: Y } }]);
  const rows = [
    { i: 'obyvatele', p: 'Energetická chudoba', d: 'Sociální příspěvek, ne tarif', who: 'Stát' },
    { i: 'novakovi', p: 'Podpora fotovoltaiky', d: 'Transparentně z rozpočtu, ne skrytě přes účty', who: 'Stát' },
    { i: 'ostrov', p: 'Nová vedení západ → východ', d: 'Rychlejší povolování staveb', who: 'Stát + kraje' },
    { i: 'elektromer', p: 'Chytré elektroměry pro všechny', d: 'Bez zákona semafor neměříme', who: 'Zákon' },
  ];
  rows.forEach((r, k) => {
    const y = 1.6 + k * 1.33;
    card(s, 0.6, y, 12.1, 1.15, CARD, 'row-' + k);
    icon(s, r.i, 0.8, y + 0.08, 1.0);
    T(s, r.p, { x: 2.05, y: y + 0.17, w: 7.3, h: 0.5, fontFace: H, fontSize: 22 });
    T(s, r.d, { x: 2.05, y: y + 0.66, w: 7.3, h: 0.4, fontSize: 15, color: MUT });
    chip(s, r.who, 9.9, y + 0.3, 2.55, 0.55);
  });
  s.addNotes('B (20 s): Buďme upřímní: regulátor nevyřeší všechno. Energetickou chudobu musí řešit stát sociálním příspěvkem, ne tarifem. Podporu fotovoltaiky ať stát platí transparentně z rozpočtu, ne skrytě přes účet paní Marie. Nová vedení ze západu na východ potřebují rychlejší povolování. A semafor potřebuje zákon o chytrých elektroměrech.');
}

// 7 — Finále
{
  const s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Prezentace (4 min)' });
  glow(s, 'glow_y', 3.2, 2.2, 7.0);
  const items = [
    { i: 'stat', w: 'Stát', b: '0 €', d: 'dotací', c: BLUE },
    { i: 'obyvatele', w: 'Obyvatelé', b: '−24 €', d: 'ročně, hned', c: TEAL },
    { i: 'prumysl', w: 'Průmysl', b: '−9 %', d: 'za 10 let', c: ORANGE },
    { i: 'priroda', w: 'Příroda', b: '−1 GW', d: 'večerní špičky', c: PINK },
  ];
  items.forEach((it, k) => {
    const x = 0.6 + k * 3.075;
    card(s, x, 0.6, 2.9, 3.55, it.c, 'benefit-' + k);
    icon(s, it.i, x + 0.2, 0.75, 1.45);
    T(s, it.w, { x: x + 0.3, y: 2.3, w: 2.4, h: 0.4, fontFace: SEMI, fontSize: 17 });
    T(s, it.b, { x: x + 0.3, y: 2.7, w: 2.5, h: 0.75, fontFace: BLK, fontSize: 40 });
    T(s, it.d, { x: x + 0.3, y: 3.45, w: 2.4, h: 0.4, fontSize: 15, color: 'F4F4F5' });
  });
  T(s, [{ text: 'Schvalte ' }, { text: 'FÉR', options: { color: Y } }, { text: 'SÍŤ.' }], { x: 0.6, y: 4.55, w: 12.1, h: 1.2, fontFace: BLK, fontSize: 64, align: 'center', valign: 'middle' });
  T(s, 'Síť pro všechny.', { x: 0.6, y: 5.7, w: 12.1, h: 0.6, fontFace: SEMI, fontSize: 26, align: 'center', color: MUT });
  [G, SY, R].forEach((c, i) => dot(s, c, 6.27 + i * 0.32, 6.55, 0.2));
  T(s, 'Tým Ivaň · č. 15', { x: 0.6, y: 6.85, w: 12.1, h: 0.35, fontSize: 13, align: 'center', color: '71717A' });
  s.addNotes('A (25 s): Co z toho máte? Stát – nula eur dotací. Obyvatelé – minus 24 eur ročně pro tři miliony domácností, hned od prvního roku. Průmysl – o 9 procent méně za deset let. Příroda – o gigawatt menší večerní špička a méně nových vedení přes krajinu. Proto vás prosíme: schvalte tarif FÉRSÍŤ a zákon o chytrých elektroměrech. Síť pro všechny. Děkujeme.');
}

// =============== ZÁLOHA ===============
pres.addSection({ title: 'Záloha pro otázky' });

// 8 — předěl
{
  const s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Záloha pro otázky' });
  icon(s, 'semafor', 1.0, 1.9, 3.6);
  T(s, 'Záloha', { x: 5.0, y: 2.5, w: 7.5, h: 1.3, fontFace: BLK, fontSize: 72 });
  T(s, 'Čísla a výpočty pro otázky poroty', { x: 5.0, y: 3.8, w: 7.5, h: 0.6, fontFace: SEMI, fontSize: 24, color: MUT });
  s.addNotes('Záložní slajdy – jen při otázkách.');
}

// 9 — Semafor
{
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Záloha pro otázky' });
  title(s, [{ text: 'Síťový ' }, { text: 'semafor', options: { color: Y } }]);
  const DAILY = [64, 58, 54, 52, 53, 58, 66, 76, 86, 92, 95, 94, 90, 87, 85, 84, 86, 90, 95, 99, 100, 94, 84, 73];
  const RED = [17, 18, 19, 20], GREEN = [23, 0, 1, 2, 3, 4, 5, 11, 12, 13, 14];
  const band = (h) => (RED.includes(h) ? 'r' : GREEN.includes(h) ? 'g' : 'y');
  const labels = DAILY.map((_, h) => String(h));
  card(s, 0.6, 1.6, 8.1, 5.3, CARD, 'semafor-chart-card');
  s.addChart(pres.charts.BAR, [
    { name: 'Zelená', labels, values: DAILY.map((v, h) => (band(h) === 'g' ? v : 0)) },
    { name: 'Žlutá', labels, values: DAILY.map((v, h) => (band(h) === 'y' ? v : 0)) },
    { name: 'Červená', labels, values: DAILY.map((v, h) => (band(h) === 'r' ? v : 0)) },
  ], {
    x: 0.8, y: 1.75, w: 7.7, h: 5.0, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 25, chartColors: [G, SY, R],
    showTitle: true, title: 'Denní diagram zatížení (% špičky) podle pásem', titleColor: W, titleFontSize: 14, titleFontFace: '+mj-lt',
    catAxisLabelColor: MUT, catAxisLabelFontSize: 10, catAxisLabelFontFace: '+mn-lt', valAxisLabelColor: MUT, valAxisLabelFontSize: 10, valAxisLabelFontFace: '+mn-lt',
    valAxisMaxVal: 100, valGridLine: { color: '3F3F46', size: 1 }, catGridLine: { style: 'none' }, showLegend: false, objectName: 'semafor-chart',
  });
  const p = [
    { c: G, t: 'Zelená', s: 'Noc 23–6 h a poledne 11–15 h', v: '0,6 c/kWh' },
    { c: SY, t: 'Žlutá', s: 'Běžný den', v: '1,2 c/kWh' },
    { c: R, t: 'Červená', s: '17–21 h, síť na maximu', v: '3,6 c/kWh' },
  ];
  p.forEach((x, k) => {
    const y = 1.6 + k * 1.82;
    card(s, 9.0, y, 3.7, 1.62, CARD, 'price-' + k);
    dot(s, x.c, 9.25, y + 0.28, 0.42);
    T(s, x.t, { x: 9.85, y: y + 0.25, w: 2.7, h: 0.45, fontFace: H, fontSize: 18 });
    T(s, x.v, { x: 9.25, y: y + 0.75, w: 3.3, h: 0.5, fontFace: BLK, fontSize: 26, color: x.c });
    T(s, x.s, { x: 9.25, y: y + 1.2, w: 3.35, h: 0.35, fontSize: 12, color: MUT });
  });
  s.addNotes('Pásma jsou odvozená z denního diagramu zatížení: zelená 40 % odběru, žlutá 40 %, červená 20 %. Poměr cen 0,5 : 1 : 3, průměr pokryje proměnné náklady 9,6 €/MWh.');
}

// 10 — Za 10 let (tabulka)
{
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Záloha pro otázky' });
  title(s, [{ text: 'Účty za síť ' }, { text: 'za 10 let', options: { color: Y } }]);
  const hd = (t, al = 'center') => ({ text: t, options: { fontFace: H, color: MUT, fontSize: 14, align: al, fill: { color: CARD } } });
  const c = (t, color = W, al = 'center') => ({ text: t, options: { color, fontSize: 18, align: al, fill: { color: CARD } } });
  const rows = [
    [hd('', 'left'), hd('2027 dnes'), hd('2027 FÉRSÍŤ'), hd('2032 dnes'), hd('2032 FÉRSÍŤ'), hd('2037 dnes'), hd('2037 FÉRSÍŤ')],
    [c('Marie', W, 'left'), c('168 €', MUT), c('144 €', Y), c('196 €', MUT), c('181 €', Y), c('226 €', MUT), c('224 €', Y)],
    [c('Novákovi', W, 'left'), c('72 €', MUT), c('145 €', Y), c('84 €', MUT), c('176 €', Y), c('97 €', MUT), c('210 €', Y)],
    [c('Firma Kovář', W, 'left'), c('19 231 €', MUT), c('19 231 €', Y), c('21 840 €', MUT), c('20 849 €', Y), c('24 542 €', MUT), c('22 320 €', Y)],
    [c('Cena za kWh dnes', W, 'left'), c('4,8 c', MUT), c('—', MUT), c('5,6 c', MUT), c('—', MUT), c('6,5 c', R), c('—', MUT)],
  ];
  s.addTable(rows, { x: 0.6, y: 1.7, w: 12.1, colW: [2.5, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6], rowH: 0.72, fontFace: MED, valign: 'middle', border: { type: 'solid', color: BG, pt: 3 }, margin: 0.1, objectName: 'table-10y' });
  T(s, 'Dnešní tarif +34 % (z toho +8 % jen kvůli odchodu do FVE) · Marie platí s FÉRSÍŤ méně v každém roce · firmy narovnáváme 77 % → 72 %', { x: 0.6, y: 5.6, w: 12.1, h: 0.8, fontSize: 15, color: MUT });
  s.addNotes('Za 10 let: náklady 3 100 mil. €, FVE u 50 % domácností, odběr 48 TWh. Výhoda Marie se zmenšuje, protože průmysl postupně přestává doplácet – rychlost narovnání je rozhodnutí Rady.');
}

// 11 — Test férovosti
{
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Záloha pro otázky' });
  title(s, [{ text: 'Test ' }, { text: 'férovosti', options: { color: Y } }]);
  const ok = { text: '✓', options: { color: G, fontFace: BLK, fontSize: 26, align: 'center', fill: { color: CARD } } };
  const no = { text: '✕', options: { color: R, fontFace: BLK, fontSize: 24, align: 'center', fill: { color: CARD } } };
  const wa = { text: '!', options: { color: SY, fontFace: BLK, fontSize: 26, align: 'center', fill: { color: CARD } } };
  const hd = (t, col = MUT) => ({ text: t, options: { fontFace: H, color: col, fontSize: 18, align: 'center', fill: { color: CARD } } });
  const l = (t) => ({ text: t, options: { color: W, fontSize: 17, fill: { color: CARD } } });
  const rows = [
    [{ text: '', options: { fill: { color: CARD } } }, hd('Dnes (jen kWh)'), hd('Jen jistič'), hd('FÉRSÍŤ', Y)],
    [l('Platí, kdo síť potřebuje'), no, ok, ok],
    [l('Stejná potřeba = stejná cena'), no, wa, ok],
    [l('Nikdo nezůstane pozadu'), wa, no, ok],
    [l('Jednoduché a stabilní'), wa, ok, ok],
    [{ text: 'Marie platí', options: { fontFace: H, color: W, fontSize: 18, fill: { color: CARD } } }, hd('168 €', W), hd('385 €', R), hd('144 €', Y)],
  ];
  s.addTable(rows, { x: 0.6, y: 1.7, w: 12.1, colW: [4.6, 2.5, 2.5, 2.5], rowH: 0.78, fontFace: MED, valign: 'middle', border: { type: 'solid', color: BG, pt: 3 }, margin: 0.12, objectName: 'table-fair' });
  s.addNotes('Jen jistič by zvedl Marii účet o 129 % na 385 € a Novákovým na 705 €. Dnešní tarif dotuje FVE (168 vs 72 €). FÉRSÍŤ splní všechna 4 pravidla.');
}

// 12 — Předpoklady
{
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Záloha pro otázky' });
  title(s, [{ text: 'Naše ' }, { text: 'předpoklady', options: { color: Y } }]);
  const A = [
    '1 odběrné místo = 1 domácnost (4 mil.)',
    'Za 10 let 50 % domácností s FVE, odběr 52 → 48 TWh',
    'Lineární vývoj: náklady sítě +60 mil. € ročně',
    'Leden 20:00: FVE nevyrábí, baterie je prázdná → Marie 1,1 kW ≈ Novákovi 1,0 kW',
    'Špička 9,3 GW = 52 TWh / 8 760 h / koeficient 0,64',
    'Firmy ~54 % špičky, dnes platí 77 % → postupně 72 %',
    'Elektroměr 150 € × 4,1 mil. = 615 mil. €, splátka 15 let',
    'Flexibilita: baterie + chemie Petrovia ≈ −1 GW, vyhnutý náklad 80 €/kW',
  ];
  A.forEach((t, k) => {
    const col = k % 2, row = Math.floor(k / 2), x = 0.6 + col * 6.1, y = 1.6 + row * 1.32;
    card(s, x, y, 5.95, 1.15, CARD, 'assume-' + k);
    s.addShape(pres.shapes.OVAL, { x: x + 0.22, y: y + 0.3, w: 0.55, h: 0.55, fill: { color: Y }, line: { color: Y, width: 0 } });
    T(s, String(k + 1), { x: x + 0.22, y: y + 0.3, w: 0.55, h: 0.55, fontFace: H, fontSize: 16, color: '111111', align: 'center', valign: 'middle' });
    T(s, t, { x: x + 0.95, y: y + 0.12, w: 4.85, h: 0.92, fontSize: 15, valign: 'middle' });
  });
  s.addNotes('Všechny předpoklady jsou i na webu na stránce Výpočty, včetně kontroly, že tarif každý rok přesně pokryje náklady.');
}

// 13 — Web
{
  const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Záloha pro otázky' });
  title(s, [{ text: 'Web ' }, { text: 'FÉRSÍŤ', options: { color: Y } }, { text: ' živě' }]);
  s.addImage({ path: SHOT('calc.png'), x: 0.6, y: 1.65, w: 6.0, h: 3.75, sizing: { type: 'cover', w: 6.0, h: 3.75 }, rounding: false, objectName: 'shot-calc' });
  s.addImage({ path: SHOT('map_fer.png'), x: 6.75, y: 1.65, w: 5.95, h: 3.75, sizing: { type: 'cover', w: 5.95, h: 3.75 }, objectName: 'shot-map' });
  T(s, [{ text: 'AI poradce  ', options: { fontFace: H, color: Y } }, { text: 'napíšete, jak bydlíte – spočítá účet a poradí, jak ušetřit' }], { x: 0.6, y: 5.6, w: 6.0, h: 0.9, fontSize: 15 });
  T(s, [{ text: 'Živá mapa sítě  ', options: { fontFace: H, color: Y } }, { text: 'zatížení měst v čase, s FÉRSÍŤ večerní špička −1,2 GW' }], { x: 6.75, y: 5.6, w: 5.95, h: 0.9, fontSize: 15 });
  s.addNotes('Na otázky odpovídáme živě v kalkulačce na webu (localhost:4173).');
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('ok', OUT);
})();
