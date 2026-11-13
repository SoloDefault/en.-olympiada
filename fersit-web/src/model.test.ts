import { describe, it, expect } from 'vitest';
import { fersit, statusQuo, SHARES, FAC, onlyJistic, savings, years, inputs, PEAK_GW } from './model';

const near = (a: number, b: number, tol = 0.5) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('semafor', () => {
  it('podíly pásem', () => {
    near(SHARES.green, 0.40104, 0.0001);
    near(SHARES.yellow, 0.39843, 0.0001);
    near(SHARES.red, 0.20052, 0.0001);
    near(FAC, 1.20052, 0.0001);
  });
  it('špička ~9,3 GW', () => near(PEAK_GW, 9.3, 0.1));
});

describe('start t=0', () => {
  const f = fersit(0), s = statusQuo(0);
  it('dnes', () => { near(s.A, 168); near(s.B, 72); near(s.F, 19231); near(s.rate, 48.08, 0.01); });
  it('FÉRSÍŤ', () => {
    near(f.P, 57.69, 0.01); near(f.K * 6, 35.81, 0.01); near(f.E * 3.5, 50.48, 0.01);
    near(f.A, 144); near(f.B, 145); near(f.F, 19231);
    near(f.PF, 3846); near(f.KF, 96.15, 0.01);
    near(f.semH.green, 6.01, 0.01); near(f.semH.yellow, 12.01, 0.01); near(f.semH.red, 36.04, 0.01);
  });
});

describe('řada 10 let', () => {
  const table: [number, number, number, number, number, number, number][] = [
    // t, dnes €/MWh, dnes Marie, dnes Novák, FÉR Marie, FÉR Novák, FÉR Firma
    [0, 48.08, 168, 72, 144.0, 145.0, 19231],
    [1, 49.61, 174, 74, 150.8, 150.8, 19566],
    [5, 56.0, 196, 84, 180.6, 175.7, 20849],
    [10, 64.58, 226, 97, 223.9, 210.1, 22320],
  ];
  it.each(table)('t=%i', (t, rate, a, b, fa, fb, ff) => {
    const s = statusQuo(t), f = fersit(t);
    near(s.rate, rate, 0.01); near(s.A, a); near(s.B, b);
    near(f.A, fa); near(f.B, fb); near(f.F, ff);
  });
  it('součet = náklady sítě každý rok', () => {
    years.forEach((t) => { near(fersit(t).total / 1e6, inputs(t).cost / 1e6, 0.01); near(statusQuo(t).total / 1e6, inputs(t).cost / 1e6, 0.01); });
  });
  it('Marie platí méně než dnes každý rok', () => years.forEach((t) => expect(fersit(t).A).toBeLessThan(statusQuo(t).A)));
  it('s flexibilitou', () => { const f = fersit(10, 80); near(f.A, 218, 1); near(f.B, 205, 1); near(f.F, 21744, 3); });
});

describe('alternativy a úspory', () => {
  it('jen jistič', () => { const j = onlyJistic(); near(j.A, 385, 1); near(j.B, 705, 1); near(j.F, 6410, 1); });
  it('úspory', () => { const s = savings(); near(s.novBattery, 6.8, 0.1); near(s.novJistic, 29.8, 0.1); near(s.firmShift, 1201, 1); });
});
