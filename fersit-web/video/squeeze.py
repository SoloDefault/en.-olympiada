# Zkrátí vnitřní pauzy > 0,5 s na 0,35 s a přepočítá vo.json
import json, wave, glob, numpy as np
out = {}
for p in sorted(glob.glob('public/vo/s*.wav')):
    with wave.open(p) as w: rate = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).copy()
    win = int(0.02 * rate); n = len(a) // win
    rms = np.sqrt((a[:n * win].astype(np.float32).reshape(n, win) ** 2).mean(1))
    silent = rms < 350
    keep = np.ones(len(a), bool); i = 0; cut = 0
    while i < n:
        if silent[i]:
            j = i
            while j < n and silent[j]: j += 1
            L = (j - i) * win
            if L > 0.5 * rate:
                drop = L - int(0.35 * rate); s = i * win + int(0.35 * rate / 2)
                keep[s:s + drop] = False; cut += drop
            i = j
        else: i += 1
    a = a[keep]
    with wave.open(p, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(a.tobytes())
    out[p[-7:-4]] = round(len(a) / rate, 3)
    if cut: print(p[-7:-4], 'cut', round(cut / rate, 2), 's')
json.dump(out, open('video/vo.json', 'w'), indent=1); print(out, 'total', round(sum(out.values()), 1))
