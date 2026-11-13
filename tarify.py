# ENOL 26 - zadani 7 ERU - vypocet tarifu
G = {  # skupina: (pocet, kWh/rok, rezervovany kW, predpokl. podil na spicce soustavy kW)
 "HH bez zdroju": (3_000_000, 3500, 6, 1.2),
 "HH s FVE+bat":  (1_000_000, 1500, 11, 1.0),
 "Firmy":         (100_000, 400_000, 100, 45),
}
COST=2500e6; FIX=0.8*COST; VAR=0.2*COST; COMM=50  # EUR/MWh
E=sum(n*k/1000 for n,k,_,_ in G.values())  # MWh
print(f"Odber celkem {E/1e6:.1f} TWh, rezervovano {sum(n*r for n,r in [(v[0],v[2]) for v in G.values()])/1e6:.1f} GW")
print("\n== 1) DNES: vse za MWh ==")
p=COST/E; print(f"cena site {p:.2f} EUR/MWh")
for g,(n,k,r,c) in G.items(): print(f"{g:15} {k/1000*p:10.0f} EUR/rok  podil {n*k/1000*p/COST:5.1%}")
pv=VAR/E; print(f"\nvariabilni slozka {pv:.2f} EUR/MWh")
print("\n== 2) Fix podle rezervovaneho kW ==")
R=sum(n*r for n,k,r,c in G.values()); pk=FIX/R; print(f"{pk:.2f} EUR/kW/rok")
for g,(n,k,r,c) in G.items(): t=r*pk+k/1000*pv; print(f"{g:15} {t:10.0f} EUR/rok  podil {n*t/COST:5.1%}")
print("\n== 3) Fix podle podilu na spicce soustavy ==")
C=sum(n*c for n,k,r,c in G.values()); pc=FIX/C; print(f"spicka {C/1e6:.1f} GW, {pc:.2f} EUR/kW/rok")
for g,(n,k,r,c) in G.items(): t=c*pc+k/1000*pv; print(f"{g:15} {t:10.0f} EUR/rok  {t/(k/1000):6.1f} EUR/MWh  podil {n*t/COST:5.1%}")
