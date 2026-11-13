// Klient AI (volá serverový proxy /api/ai/*). Vždy má offline fallback.
export interface AiProfile {
  persona: 'marie' | 'novakovi' | 'firma';
  kw: number; kwh: number; redShare: number;
  hasPV?: boolean; hasBattery?: boolean; hasEV?: boolean; heatPump?: boolean; label?: string;
}

async function post<T>(path: string, body: unknown, ms = 15000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(`api/ai/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()) as T;
  } finally { clearTimeout(t); }
}

// jednoduchý offline odhad, když AI není k dispozici
export function localProfile(text: string): AiProfile {
  const s = text.toLowerCase();
  const firm = /firm|dílna|dilna|výrob|vyrob|provoz|kancel|hal|s\.r\.o|obchod/.test(s);
  if (firm) return { persona: 'firma', kw: 80, kwh: 150000, redShare: 0.2, label: 'Firma (odhad offline)' };
  const pv = /fve|fotovolt|solár|solar|panel/.test(s);
  const house = /dům|dum|rodinn|vila|chalup/.test(s);
  const ev = /auto|ev\b|elektromobil|tesla/.test(s);
  const tc = /čerpad|cerpad|tepeln/.test(s);
  const bat = /bateri/.test(s);
  const evening = /večer|vecer|po práci|po praci/.test(s);
  let kwh = house ? 4500 : 3000, kw = house ? 11 : 6, red = 0.2;
  if (tc) { kwh += 4000; kw += 4; red += 0.03; }
  if (ev) { kwh += 2500; if (evening) red += 0.1; }
  if (pv) kwh = Math.max(800, kwh - 2000);
  if (bat) red = Math.max(0.05, red - 0.05);
  return { persona: pv ? 'novakovi' : 'marie', kw, kwh, redShare: Math.min(0.4, red), hasPV: pv, hasEV: ev, heatPump: tc, hasBattery: bat, label: 'Odhad offline' };
}

export async function aiProfile(text: string): Promise<{ p: AiProfile; ai: boolean }> {
  try { const p = await post<AiProfile>('profile', { text }); return { p, ai: true }; }
  catch { return { p: localProfile(text), ai: false }; }
}
export async function aiAdvice(data: unknown): Promise<string | null> {
  try { return (await post<{ text: string }>('advice', data)).text; } catch { return null; }
}
export async function aiChat(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<string | null> {
  try { return (await post<{ text: string }>('chat', { messages })).text; } catch { return null; }
}
