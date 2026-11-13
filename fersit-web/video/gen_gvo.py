import json, wave, sys, os, numpy as np
sys.path.insert(0, 'video'); from gtts import tts
S = json.load(open('video/script.json', encoding='utf-8'))
only = set(sys.argv[1:]); out = {}
for s in S:
    path = f"public/vo/{s['id']}.wav"
    if s['id'] in only or (not only and not os.path.exists(path)):
        tts(s['text'].replace('Férsíť', 'Fér síť'), path)
        # ořez ticha na začátku/konci (ponechat 80 ms)
        with wave.open(path) as w: rate = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
        idx = np.where(np.abs(a) > 600)[0]
        if len(idx): a = a[max(0, idx[0] - int(0.08 * rate)): idx[-1] + int(0.12 * rate)]
        with wave.open(path, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(a.tobytes())
    with wave.open(path) as w: out[s['id']] = round(w.getnframes() / w.getframerate(), 3)
json.dump(out, open('video/vo.json', 'w'), indent=1)
print(out, 'total', round(sum(out.values()), 1))
