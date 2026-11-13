import json, base64, urllib.request, urllib.error, sys
env = dict(l.strip().split('=', 1) for l in open('.env.local', encoding='utf-8') if '=' in l)
model = sys.argv[1] if len(sys.argv) > 1 else 'lyria-3.5'
prompt = """Instrumental background music for a product launch video, NO vocals, exactly 90 seconds long.
Genre: modern cinematic electronic / uplifting tech commercial (like an Apple or Tesla keynote), polished, premium, clean mix that leaves space for a voiceover.
Structure with exact timing:
0:00-0:29 — the problem: dark, tense, minimal. Soft low synth pulse, sparse piano notes, subtle ticking, low intensity, minor key, slow build.
0:29-0:31 — short rising riser / build-up swell.
0:31 — big cinematic impact hit, then switch to the solution theme.
0:31-1:20 — bright, optimistic, energetic: major key, punchy four-on-the-floor beat at 112 BPM, claps, plucky synth arpeggios, warm pads, inspiring and confident, not too busy.
1:20-1:30 — triumphant finale, final big hit at 1:24 and a clean short tail, ending in silence by 1:30."""
body = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"responseModalities": ["AUDIO"]}}
req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    data=json.dumps(body).encode(), headers={"x-goog-api-key": env['GEMINI_API_KEY'], "Content-Type": "application/json"})
try:
    d = json.loads(urllib.request.urlopen(req, timeout=600).read())
except urllib.error.HTTPError as e:
    print('HTTP', e.code, e.read()[:600]); raise SystemExit(1)
for p in d['candidates'][0]['content']['parts']:
    if 'inlineData' in p:
        mt = p['inlineData']['mimeType']; ext = 'mp3' if 'mpeg' in mt or 'mp3' in mt else 'wav' if 'wav' in mt else mt.split('/')[-1].split(';')[0]
        data = base64.b64decode(p['inlineData']['data']); fn = f'public/music/bed_{model}.{ext}'
        open(fn, 'wb').write(data); print('saved', fn, mt, len(data))
    elif 'text' in p: print('text:', p['text'][:300])
