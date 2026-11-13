# ENOL 26 - zadani 7 ERU - porovnani scenaru tarifu (dnes a za 10 let)
COMM=50
def world(year):
    if year==0:
        G={"HH bez":(3e6,3500,6,1.2),"HH FVE":(1e6,1500,11,1.0),"Firma":(1e5,400e3,100,45)}
        cost=2500e6
    else:  # +10 let: 50 % FVE, odber 48 TWh, naklady 3100
        G={"HH bez":(2e6,3500,6,1.2),"HH FVE":(2e6,1500,11,1.0),"Firma":(1e5,380e3,100,43)}
        cost=3100e6
    return G,cost
def scen(name,G,cost,peakFVE=None):
    G=dict(G)
    if peakFVE is not None:
        n,k,r,c=G["HH FVE"]; G["HH FVE"]=(n,k,r,peakFVE)
    E=sum(n*k/1000 for n,k,r,c in G.values()); N=sum(n for n,*_ in G.values())
    R=sum(n*r for n,k,r,c in G.values()); C=sum(n*c for n,k,r,c in G.values())
    fix,var=0.8*cost,0.2*cost; pv=var/E
    out={}
    for g,(n,k,r,c) in G.items():
        mwh=k/1000
        if name=="S0 vse za MWh": t=mwh*cost/E
        elif name=="S1 pausal/misto": t=fix/N+mwh*pv
        elif name=="S2 jistic kW": t=r*fix/R+mwh*pv
        elif name=="S3 spicka kW": t=c*fix/C+mwh*pv
        elif name=="S4 FER mix":  # 10 % fix pausal za misto, 70 % spicka, 20 % energie (var 20 % + 0 navic)
            t=0.10*fix/N + 0.90*fix*c/C + mwh*pv
        out[g]=t
    chk=sum(G[g][0]*out[g] for g in G)/1e6
    return out,chk,pv
for y in (0,10):
    G,cost=world(y)
    print(f"\n######## ROK +{y}  naklady {cost/1e6:.0f} M EUR")
    print(f"{'scenar':18}{'HH bez':>9}{'HH FVE':>9}{'Firma':>9}  kontrola")
    for s in ["S0 vse za MWh","S1 pausal/misto","S2 jistic kW","S3 spicka kW","S4 FER mix"]:
        o,chk,pv=scen(s,G,cost)
        print(f"{s:18}{o['HH bez']:9.0f}{o['HH FVE']:9.0f}{o['Firma']:9.0f}  {chk:6.0f}")
    if y==10:
        o,chk,_=scen("S3 spicka kW",G,cost,peakFVE=0.5)
        print(f"{'S3 + baterie 0.5kW':18}{o['HH bez']:9.0f}{o['HH FVE']:9.0f}{o['Firma']:9.0f}  {chk:6.0f}")

print("\n== S5 kompromis: fix 50 % podle spicky + 50 % podle MWh ==")
for y in (0,10):
    G,cost=world(y); fix,var=0.8*cost,0.2*cost
    E=sum(n*k/1000 for n,k,r,c in G.values()); C=sum(n*c for n,k,r,c in G.values())
    pk=0.5*fix/C; pe=(0.5*fix+var)/E
    o={g:c*pk+k/1000*pe for g,(n,k,r,c) in G.items()}
    print(f"+{y:2} let: {pk:6.1f} EUR/kW/rok, {pe:5.1f} EUR/MWh | HH bez {o['HH bez']:4.0f}  HH FVE {o['HH FVE']:4.0f}  Firma {o['Firma']:6.0f}  kontrola {sum(G[g][0]*o[g] for g in G)/1e6:.0f}")
