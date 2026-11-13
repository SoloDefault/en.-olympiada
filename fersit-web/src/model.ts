// FÉRSÍŤ — veškerá matematika (single source of truth)
// t = 0 … 10 (rok 0 = 2027, rok 10 = 2037)

export const ISLAND_NAME = 'ENERGIA';
export const START_YEAR = 2027;

export const DAILY = [64, 58, 54, 52, 53, 58, 66, 76, 86, 92, 95, 94, 90, 87, 85, 84, 86, 90, 95, 99, 100, 94, 84, 73];
export const YEARLY = [100, 97, 88, 78, 70, 65, 63, 64, 70, 80, 90, 98];
export const PV_MONTHLY = [2.5, 4.5, 8, 11.5, 13.5, 14, 14.5, 12.5, 9, 5.5, 2.8, 1.7];
export const RED = [17, 18, 19, 20];
export const GREEN = [23, 0, 1, 2, 3, 4, 5, 11, 12, 13, 14];
export const SEM_RATIO = { green: 0.5, yellow: 1, red: 3 };

export type Band = 'green' | 'yellow' | 'red';
export const bandOf = (h: number): Band => (RED.includes(h) ? 'red' : GREEN.includes(h) ? 'green' : 'yellow');

const dailySum = DAILY.reduce((a, b) => a + b, 0);
export const SHARES: Record<Band, number> = { green: 0, yellow: 0, red: 0 };
DAILY.forEach((v, h) => { SHARES[bandOf(h)] += v / dailySum; });
export const FAC = SHARES.green * SEM_RATIO.green + SHARES.yellow * SEM_RATIO.yellow + SHARES.red * SEM_RATIO.red;

// Koeficient zatížení a špička soustavy
export const LOAD_FACTOR = (dailySum / 24 / 100) * (YEARLY.reduce((a, b) => a + b, 0) / 12 / 100);
export const PEAK_GW = 52e6 / 8760 / LOAD_FACTOR / 1000; // ≈ 9,3 GW

export function inputs(t: number) {
  const NB = 1e6 + 0.1e6 * t; // domácnosti s FVE
  const NA = 4e6 - NB; // domácnosti bez FVE
  const NF = 1e5; // firmy
  return { NA, NB, NF, kwhA: 3.5, kwhB: 1.5, kwhF: 400 - 2 * t, kwA: 6, kwB: 11, kwF: 100, cost: 2500e6 + 60e6 * t };
}

// Dnešní tarif (jen za energii)
export function statusQuo(t: number) {
  const d = inputs(t);
  const E = d.NA * d.kwhA + d.NB * d.kwhB + d.NF * d.kwhF; // MWh
  const rate = d.cost / E; // €/MWh
  return { rate, A: rate * d.kwhA, B: rate * d.kwhB, F: rate * d.kwhF, total: rate * E };
}

export type Sem = Record<Band, number>;
const sem = (avg: number): Sem => ({ green: (avg / FAC) * SEM_RATIO.green, yellow: avg / FAC, red: (avg / FAC) * SEM_RATIO.red });

// FÉRSÍŤ
export function fersit(t: number, flexSavingM = 0) {
  const d = inputs(t);
  const cost = d.cost - (flexSavingM * 1e6 * t) / 10;
  const sF0 = 1923.0769e6 / 2500e6; // dnešní podíl firem
  const sF = sF0 + ((0.72 - sF0) * t) / 10; // postupné narovnání → 72 %
  const F = cost * sF, H = cost - F;
  const pts = d.NA + d.NB, kw = d.NA * 6 + d.NB * 11, mwh = d.NA * 3.5 + d.NB * 1.5;
  const P = (0.4 * H) / pts, K = (0.3 * H) / kw, E = (0.3 * H) / mwh;
  const PF = (0.2 * F) / d.NF, KF = (0.5 * F) / (d.NF * 100), EF = (0.3 * F) / (d.NF * d.kwhF);
  const A = P + K * 6 + E * 3.5, B = P + K * 11 + E * 1.5, Fb = PF + KF * 100 + EF * d.kwhF;
  return {
    cost, sF, P, K, E, PF, KF, EF, semH: sem(E), semF: sem(EF),
    A, B, F: Fb,
    total: d.NA * A + d.NB * B + d.NF * Fb,
  };
}

// Kalkulačka: vlastní parametry
export type Persona = 'marie' | 'novakovi' | 'firma';
export interface CalcIn { persona: Persona; kw: number; mwh: number; redShare: number; t?: number }

/** Rozdělení odběru do pásem: co ubude z červené, přesune se do zelené (baterie / přesun výroby). */
export function bandSplit(redShare: number): Sem {
  const green = Math.max(0, SHARES.green + (SHARES.red - redShare));
  const yellow = 1 - redShare - green;
  return { red: redShare, green, yellow };
}

export function calc({ persona, kw, mwh, redShare, t = 0 }: CalcIn) {
  const f = fersit(t);
  const firm = persona === 'firma';
  const P = firm ? f.PF : f.P;
  const K = firm ? f.KF : f.K;
  const s = firm ? f.semF : f.semH;
  const sp = bandSplit(redShare);
  const semRate = sp.green * s.green + sp.yellow * s.yellow + sp.red * s.red;
  const parts = { pripojeni: P, jistic: K * kw, semafor: mwh * semRate };
  const total = parts.pripojeni + parts.jistic + parts.semafor;
  const today = statusQuo(t).rate * mwh;
  return { parts, total, today, diff: total - today, K, s, semRate };
}

export const PERSONAS: Record<Persona, { name: string; kw: number; mwh: number; redShare: number; place: string }> = {
  marie: { name: 'Marie', kw: 6, mwh: 3.5, redShare: SHARES.red, place: 'Panelák, Energiapolis' },
  novakovi: { name: 'Novákovi', kw: 11, mwh: 1.5, redShare: SHARES.red, place: 'Rodinný dům s FVE, Azuro' },
  firma: { name: 'Firma Kovář', kw: 100, mwh: 400, redShare: SHARES.red, place: 'Výroba, Ferrum' },
};

// Alternativní model „jen jistič“
export function onlyJistic(t = 0) {
  const d = inputs(t);
  const kw = d.NA * 6 + d.NB * 11 + d.NF * 100;
  const r = d.cost / kw;
  return { rate: r, A: r * 6, B: r * 11, F: r * 100 };
}

// Úspory flexibility (start)
export function savings() {
  const f = fersit(0);
  const nov = calc({ persona: 'novakovi', kw: 11, mwh: 1.5, redShare: SHARES.red });
  const novBat = calc({ persona: 'novakovi', kw: 11, mwh: 1.5, redShare: 0.05 });
  return {
    novBattery: nov.total - novBat.total,
    novJistic: f.K * 5,
    perKw: f.K,
    firmShift: 400 * 0.1 * (f.semF.red - f.semF.green),
  };
}

export const years = Array.from({ length: 11 }, (_, t) => t);
