# FÉRSÍŤ — spravedlivé síťové tarify pro ostrov ENERGIA
**Energetická olympiáda 2026 · Zadání 7 (ERÚ) „Spravedlivé tarify“**

> „Síť platí ti, kdo ji potřebují.“

Dnes se síť platí jen za kWh. Domácnosti s fotovoltaikou proto platí za síť méně (72 €), než domácnosti bez ní (168 €), i když v lednu ve 20:00 potřebují síť stejně. **FÉRSÍŤ** je tarif „jako u mobilu“: připojení + jistič + **síťový semafor** (zelená 0,6 · žlutá 1,2 · červená 3,6 c/kWh). Marie platí 144 €, Novákovi 145 € a tarif každý rok přesně pokryje náklady sítě (2,5 → 3,1 mld. €) bez dotací.

## Obsah repozitáře
| Cesta | Co to je |
|---|---|
| `fersit-web/` | Web FÉRSÍŤ (Vite + React + TypeScript + Tailwind): kalkulačka s AI poradcem, živá mapa sítě, heatmapy, semafor, „Za 10 let“, test férovosti, Pro Radu, výpočty |
| `fersit-web/src/model.ts` | Celý výpočetní model tarifu (jediný zdroj čísel) + `model.test.ts` (kontrolní hodnoty) |
| `fersit-web/ai-server.ts` | Serverový proxy pro AI (klíč zůstává na serveru) |
| `fersit-web/video/` | Promo video v Remotion (scény, scénář, generování hlasu a hudby) |
| `video/fersit_video_final.mp4` | Hotové video (85 s, 1080p) |
| `SCENAR_prezentace.md` | Scénář 4min prezentace + otázky |
| `MENTOR_shrnuti.md`, `QA_tahak.md` | Shrnutí pro mentora, tahák na otázky poroty |
| `tarify.py`, `scenare.py` | Prvotní výpočty a porovnání scénářů |
| `ENOL 26 – *.xlsx` | Podklady soutěže (zadání, data, diagramy zatížení, trilema) |

## Spuštění webu
```bash
cd fersit-web
npm install
cp .env.local.example .env.local   # doplnit OPENAI_API_KEY (bez něj funguje vše kromě AI)
npm test                            # kontrolní hodnoty modelu
npm run build && npm run preview    # http://localhost:4173
```

## Render videa
```bash
cd fersit-web
npx remotion render video/index.ts Fersit out.mp4
```
