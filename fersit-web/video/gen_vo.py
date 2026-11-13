# Generuje voiceover po scénách (ElevenLabs) a zapíše délky do video/vo.json
import json, os, sys, urllib.request
from mutagen.mp3 import MP3
env = dict(l.strip().split('=', 1) for l in open('.env.local', encoding='utf-8') if '=' in l)
KEY = env['ELEVENLABS_API_KEY']; VOICE = 'nPczCjzI2devNBz1zQrb'  # Brian
S = json.load(open('video/script.json', encoding='utf-8'))
only = set(sys.argv[1:])
out = {}
for i, s in enumerate(S):
    path = f"public/vo/{s['id']}.mp3"
    if (not only and not os.path.exists(path)) or s['id'] in only:
        body = {"text": s['text'], "model_id": "eleven_multilingual_v2", "language_code": "cs",
                "voice_settings": {"stability": 0.55, "similarity_boost": 0.8, "style": 0.25, "use_speaker_boost": True, "speed": 0.97},
                "previous_text": S[i-1]['text'] if i else None, "next_text": S[i+1]['text'] if i + 1 < len(S) else None}
        req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128",
            data=json.dumps(body).encode(), headers={"xi-api-key": KEY, "Content-Type": "application/json"})
        open(path, 'wb').write(urllib.request.urlopen(req, timeout=60).read())
    out[s['id']] = round(MP3(path).info.length, 3)
json.dump(out, open('video/vo.json', 'w'), indent=1)
print(out, 'total', round(sum(out.values()), 1))
