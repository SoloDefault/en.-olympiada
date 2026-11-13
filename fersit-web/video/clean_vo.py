# Odstraní artefakt Gemini TTS: krátký hlasitý „cvak/šum“ po tichu na konci (příp. na začátku) klipu
import wave, glob, json, sys, numpy as np
out = {}
for p in sorted(glob.glob('public/vo/s*.wav')):
    if len(sys.argv) > 1 and p[-7:-4] not in sys.argv[1:]:
        with wave.open(p) as w: out[p[-7:-4]] = round((w.getnframes() - int(0.15 * w.getframerate())) / w.getframerate(), 3)
        continue
    with wave.open(p) as w: r = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
    win = int(0.02 * r); n = len(a) // win
    rms = np.sqrt((a[:n * win].reshape(n, win) ** 2).mean(1)); loud = rms > 300
    # souvislé hlasité úseky
    segs = []; i = 0
    while i < n:
        if loud[i]:
            j = i
            while j < n and loud[j]: j += 1
            segs.append([i, j]); i = j
        else: i += 1
    # spojit úseky oddělené mezerou < 0,2 s
    merged = [segs[0]]
    for s in segs[1:]:
        if s[0] - merged[-1][1] < 10: merged[-1][1] = s[1]
        else: merged.append(s)
    removed = []
    while len(merged) > 1 and (merged[-1][1] - merged[-1][0]) * 0.02 <= 0.22:
        removed.append(('end', round((merged[-1][1] - merged[-1][0]) * 0.02, 2))); merged.pop()
    s0 = max(0, merged[0][0] * win - int(0.05 * r)); s1 = min(len(a), merged[-1][1] * win + int(0.1 * r))
    a = a[s0:s1]
    fi, fo = int(0.015 * r), int(0.12 * r)
    a[:fi] *= 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, fi)); a[-fo:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, fo))
    a = np.concatenate([a, np.zeros(int(0.15 * r), np.float32)])
    with wave.open(p, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(r); w.writeframes(a.astype(np.int16).tobytes())
    out[p[-7:-4]] = round((len(a) - int(0.15 * r)) / r, 3)
    print(p[-7:-4], 'removed', removed)
json.dump(out, open('video/vo.json', 'w'), indent=1); print('total', round(sum(out.values()), 1))
