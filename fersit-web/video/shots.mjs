// Screenshoty webu FÉRSÍŤ pro video (2× rozlišení)
import puppeteer from 'puppeteer-core';
const exe = 'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe';
const B = 'http://localhost:4173/#';
const browser = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const hideChat = () => page.addStyleTag({ content: 'button.fixed{display:none!important}' });
const go = async (path, ms = 1800) => { await page.goto(B + path, { waitUntil: 'networkidle0' }); await hideChat(); await wait(ms); };
const cardWith = async (txt, file) => {
  const h = await page.evaluateHandle((t) => [...document.querySelectorAll('.card')].find((c) => c.innerText.includes(t)), txt);
  await h.asElement().screenshot({ path: `public/shots/${file}.png` });
};
const click = (txt) => page.evaluate((t) => [...document.querySelectorAll('button')].find((b) => b.innerText.trim() === t || b.innerText.includes(t))?.click(), txt);

await go('/?hour=19'); await page.screenshot({ path: 'public/shots/home.png' });
await go('/semafor?hour=20', 2500);
await cardWith('Živá mapa sítě', 'map_dnes');
await click('S FÉRSÍŤ'); await wait(1500); await cardWith('Živá mapa sítě', 'map_fer');
await cardWith('Kdy síť potřebujeme', 'heat');
await go('/ferovost', 2000); await cardWith('Marie platí', 'fair');
await go('/pro-radu', 2500); await page.screenshot({ path: 'public/shots/rada.png' });
await go('/kalkulacka', 1200);
await click('Byt v Energiapolis');
await page.waitForFunction(() => document.body.innerText.includes('účet za síť') && !document.body.innerText.includes('Připravuji'), { timeout: 40000 });
await wait(1500); await page.screenshot({ path: 'public/shots/calc.png' });
await browser.close();
console.log('ok');
