# FÉRSÍŤ — шпаргалка: слабые места и ответы жюри

## A. Где можно провалиться (и как не провалиться)

| # | Риск | Что делаем |
|---|---|---|
| 1 | Говорим «спираль смерти +34 %» — жюри: «это же просто рост затрат сети» | Правильно: **+34 %, из них +24 % — рост затрат, +8 % — потому что люди с FVE перестают платить.** Эти 8 % растут каждый год. |
| 2 | «Фирмы создают 54 % пика, а платят 77 % — где ваша справедливость?» | Это **политическое решение Рады**, а не регулятора (см. B3). Мы идём к справедливости постепенно. |
| 3 | «40/30/30 вы подогнали» | Нет: Мария = Новаки выходит **при любом делении, где jistič и semafor имеют равный вес** (B4). |
| 4 | «Вы убиваете фотовоltaiku» | FVE всё ещё экономит **129 €/год**; общий счёт Новаков 220 € против 319 € у Марии (B5). |
| 5 | «0 € дотаций, но просите 615 млн €» | Счётчики платит **сеть**, не бюджет: 59 млн €/год, экономия 100 млн €/год (B7). |
| 6 | «Через 10 лет Мария платит почти как сейчас (224 vs 226)» | Честно: выгода уменьшается, потому что промышленность постепенно перестаёт доплачивать. **Скорость решает Рада** (B3). |
| 7 | «4 млн жителей, но 4 млн домохозяйств?» | Допущение: 1 точка подключения = 1 домохозяйство (так в данных ERÚ). Сказать сразу на слайде допущений. |
| 8 | Видео 48 с = 20 % времени выступления | Говорить поверх видео / порезать до ~30 с, если не укладываемся. Репетиция с таймером. |
| 9 | Цифры в Canva ≠ цифры на сайте | Все цифры брать с сайта (страницы Domů / Férovost / Pro Radu). |
| 10 | Ноутбук: сайт не открылся | Запустить заранее (`npm run preview`), держать вкладку открытой; видео — MP4 в Canva, не зависит от сайта. |

## B. Ответы жюри (чешский — говорить; русский — понимать)

**B1. Proč „spirála smrti“?**
„Dnešní cena sítě vzroste za 10 let o 34 %. Z toho 24 % je růst nákladů sítě, ale 8 % jen proto, že lidé s fotovoltaikou přestávají platit — a ten náklad přejde na ty, kdo si FVE dovolit nemůžou. Čím víc FVE, tím víc to roste.“
*(Рост тарифа на 34 %: 24 % из-за роста затрат сети, 8 % из-за перекладывания на тех, у кого нет FVE.)*

**B2. Proč mají Novákovi platit dvakrát víc?**
„V lednu ve 20:00 jejich fotovoltaika nevyrábí a baterie je prázdná — síť potřebují stejně jako paní Marie (1,0 vs 1,1 kW ve špičce). Dnes jim Marie a ostatní doplácejí 73 mil. € ročně. To je skrytá dotace.“
*(1 млн домов × 73 € = 73 млн €/год — скрытая дотация.)*

**B3. Firmy tvoří 54 % špičky, ale platí 77 %. Proč to neopravíte hned?**
„Skokem by účty domácností vzrostly o desítky procent. Narovnáváme postupně: 77 → 72 % za 10 let. Jak rychle, to je politické rozhodnutí Rady — to regulátor sám nevyřeší.“
*(Скачок поднял бы счета домов; скорость выравнивания — решение Рады.)*

**B4. Proč poměr 40/30/30?**
„Marie a Novákovi vychází stejně vždy, když má jistič a semafor stejnou váhu — to odpovídá tomu, že síť platíme napůl za kapacitu a napůl za využití. 40 % za připojení pokrývá elektroměry, přípojky a správu, které stojí stejně pro každého. Zkoušeli jsme i 50/25/25 a 20/40/40 — výsledek je stejný: 144 vs 145 €.“
*(Равенство Мария = Новаки не зависит от точного числа, важно равенство весов jistič и semafor.)*

**B5. Nezabijete fotovoltaiku?**
„Ne. Novákovi s FVE ušetří 129 € ročně a celkem (síť + elektřina) platí 220 € — Marie 319 €. Fotovoltaika se vyplatí dál, jen ji přestane platit Marie. Pokud chce stát FVE podporovat víc, ať to dělá transparentně z rozpočtu.“

**B6. Jak měříte červenou bez chytrých elektroměrů?**
„2027 začneme připojením a jističem — to jde hned. 2028–2030 elektroměry, do té doby semafor podle typových diagramů dodávky (TDD), jako dnes v ČR.“

**B7. Kdo zaplatí 615 mil. € za elektroměry?**
„Síť, ne státní rozpočet. Rozloženo na 15 let je to 59 mil. € ročně, tedy 1,20 € měsíčně na domácnost. Úspora je ~100 mil. € ročně: nižší špička o 1 GW a dálkové odečty. Čistý přínos 41 mil. € ročně.“

**B8. Odkud je ta −1 GW špičky?**
„2 mil. domácností s baterií × 0,4 kW posunutí z červené + flexibilita chemie v Petrovii 0,2 GW. Vyhnutý náklad počítáme jen 80 €/kW ročně — průměrný náklad sítě je 269 €/kW, takže jsme konzervativní.“

**B9. Jak jste spočítali špičku 9,3 GW?**
„Z diagramů zatížení: denní průměr 79,8 %, roční 80,25 % → koeficient 0,64. 52 TWh / 8 760 h / 0,64 = 9,3 GW.“

**B10. Proč ne dynamická cena po 15 minutách?**
„Lidé ji nepochopí. Semafor se třemi barvami pochopí každý — i paní Marie. Za ním může být později chytrá automatika.“

**B11. Co výrobci na západě?**
„Dlouhodobě lokační signál — platba za síť podle místa připojení zdroje. To vyžaduje změnu zákona, regulátor sám nemůže.“

**B12. Energeticky chudé domácnosti?**
„Marie platí méně hned od prvního roku. Pro nejslabší: sociální příspěvek státu, asi 200 tis. domácností × 50 € = 10 mil. € ročně — mimo tarif, z rozpočtu.“

**B13. Inspirace?**
„Kapacitní tarif ve Flandrech (Belgie), tři časová pásma síťových poplatků ve Španělsku, české typové diagramy (TDD).“

## C. Ключевые числа (выучить)
- Сеть: **2 500 млн €**, 80 % фикс; пик **9,3 ГВт**; 52 ТВт·ч.
- Мария **168 → 144 €**, Новаки **72 → 145 €**, фирма **19 231 €**.
- Светофор: **0,6 / 1,2 / 3,6 c/kWh**, красный 17–21 ч.
- Скрытая дотация FVE сегодня: **73 млн €/год**.
- Спираль: **+34 %** (из них **+8 %** от ухода в FVE).
- Счётчики: **615 млн €**, 59 млн €/год, экономия **100 млн €/год**.
