# Gemini TTS → WAV (24 kHz mono)
import json, base64, wave, sys, urllib.request, urllib.error, time

env = dict(l.strip().split('=', 1) for l in open('.env.local', encoding='utf-8') if '=' in l)
KEY = env['GEMINI_API_KEY']
STYLE = ("### DIRECTOR NOTES\n"
         "Style: warm, confident, energetic Czech presenter pitching a winning project to a jury. "
         "Clear articulation, natural pace, native Czech pronunciation. Do not read these notes.\n"
         "### TRANSCRIPT\n")


def tts(text, out, voice='Sadaltager', model='gemini-3.8-flash-tts', style=STYLE):
    body = {"contents": [{"parts": [{"text": style + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    for _ in range(4):
        try:
            req = urllib.request.Request(
                f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                data=json.dumps(body).encode(), headers={"x-goog-api-key": KEY, "Content-Type": "application/json"})
            d = json.loads(urllib.request.urlopen(req, timeout=180).read())
            part = d['candidates'][0]['content']['parts'][0]['inlineData']
            pcm = base64.b64decode(part['data'])
            mt = part['mimeType']
            rate = int(mt.split('rate=')[1].split(';')[0]) if 'rate=' in mt else 24000
            with wave.open(out, 'wb') as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(pcm)
            return len(pcm) / 2 / rate
        except urllib.error.HTTPError as e:
            print('HTTP', e.code, e.read()[:300]); time.sleep(4)
    raise SystemExit('tts failed')


if __name__ == '__main__':
    plain = len(sys.argv) > 4 and sys.argv[4] == 'plain'
    print(tts(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else 'Sadaltager', style='' if plain else STYLE))
