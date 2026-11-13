# FÉRSÍŤ — shrnutí pro mentora
**Zadání 7 (ERÚ) · Spravedlivé tarify · Ostrov ENERGIA**

## Problém
Síť na ostrově stojí 2 500 mil. € ročně a 80 % těchto nákladů je fixních. Závisí na připojení a na špičce, ne na kWh. Dnes se ale síť platí jen za kWh (48 €/MWh). Proto:
- **paní Marie** (panelák, bez FVE) platí za síť **168 €/rok**,
- **Novákovi** (FVE + baterie) jen **72 €/rok**,
- přitom v lednu ve 20:00 potřebují síť **stejně** (FVE nevyrábí, baterie je prázdná).

Skrytá dotace domácnostem s FVE je **73 mil. € ročně** a platí ji hlavně lidé, kteří si FVE dovolit nemůžou. Za 10 let má FVE polovina domácností a cena sítě stoupne o 34 %. Z toho 8 % jde jen na vrub toho, že lidé s FVE přestávají platit. To je **spirála smrti**.

## Naše definice férovosti (4 pravidla)
1. **Platí, kdo síť potřebuje.** Za připojení a špičku, ne za kWh.
2. **Stejná potřeba = stejná cena.** Žádné skryté dotace.
3. **Nikdo nezůstane pozadu.** Změna probíhá postupně a se sociální pojistkou.
4. **Jednoduché a stabilní.** Tarif se vejde do 3 řádků a nemá spirálu.

## Řešení: tarif FÉRSÍŤ, „tarif jako u mobilu“
| Položka | Domácnost | Firma |
|---|---|---|
| Připojení | 4,80 €/měsíc | 320 €/měsíc |
| Jistič / příkon | 0,50 €/kW/měsíc | 8 €/kW/měsíc |
| **Síťový semafor** | zelená 0,6 c/kWh (noc, poledne) · žlutá 1,2 · **červená 3,6 (17–21 h)** | stejný |

**Výsledek:** Marie platí 168 → **144 €** (−14 %), Novákovi **145 €** (stejně jako Marie), firma **19 231 €** beze změny. Když firma přesune 10 % odběru z červené, ušetří 1 201 €/rok. Tarif každý rok přesně pokryje náklady sítě (2 500 → 3 100 mil. €).

**Postup:** 2027 připojení + jistič → 2028–2030 chytré elektroměry (615 mil. € zaplatí síť, ne stát, úspora ~100 mil. €/rok) → 2030+ plný semafor.

**Co regulátor sám nevyřeší:** energetickou chudobu (sociální příspěvek státu), podporu FVE (transparentně z rozpočtu), nová vedení západ → východ (povolování), zákon o elektroměrech, cenu elektřiny a daně.

## Produkt: web FÉRSÍŤ (funguje živě)
- **Kalkulačka s AI:** člověk napíše „bydlím v bytě a večer nabíjím elektroauto“. AI odhadne spotřebu, spočítá účet a dá osobní plán úspor. Čísla počítá náš model, AI je jen vysvětluje.
- **Živá mapa sítě:** na mapě ostrova svítí města podle zatížení v daném měsíci a hodině. Přepínač „Dnes / S FÉRSÍŤ“ ukáže, že semafor sníží večerní špičku o ~1,2 GW.
- **Heatmapy:** síť je nejvíc zatížená v lednu ve 20:00, kdy FVE vyrábí 0 %. To je hlavní argument, proč i domácnost s FVE platí za síť.
- **Asistent FÉRSÍŤ:** chat, který odpovídá na otázky z dat regulátora.
- **Stránka Výpočty:** metodika, 8 předpokladů a kontrola, že tarif každý rok přesně pokryje náklady.
- Dále: semafor v reálném čase, „Za 10 let“ (spirála smrti vs. FÉRSÍŤ), test férovosti 3 modelů, energetické trilema a hlasování Rady.

## Energetické trilema (1–5)
Dnes: bezpečnost 3,0 · dostupnost 2,3 · udržitelnost 3,7 → **FÉRSÍŤ: 4,0 · 4,7 · 4,0** (index vyváženosti 0,73 → 0,87). Nejvíc zlepšujeme dostupnost a stabilitu ceny.

## S čím potřebujeme pomoct
1. **Firmy tvoří ~54 % špičky, ale platí 77 % nákladů.** Narovnáváme to na 72 % za 10 let. Je to obhajitelné, nebo bychom měli jít rychleji či pomaleji?
2. **Marie za 10 let:** s FÉRSÍŤ platí 224 €, s dnešním tarifem 226 €, takže výhoda mizí. Zpomalit narovnání u firem (77 → 74 %) a započítat úsporu z flexibility (−1 GW)?
3. **Semafor podle typových diagramů (TDD)** do doby, než budou chytré elektroměry. Je to realistické?
4. **Trilema:** nejsou naše skóre příliš optimistická (dostupnost 5/5)?
5. **Prezentace (4 min):** co vynechat a co je pro porotu nejsilnější?
