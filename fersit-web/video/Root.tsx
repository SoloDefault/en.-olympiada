import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import { AbsoluteFill, Audio, Composition, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12 } from './scenes';
import { C, FONT } from './kit';
import vo from './vo.json';
import script from './script.json';
import { PromoStage, PROMO_LEN } from '../src/promo/PromoStage';

const FPS = 30, LEAD = 15, GAP = 6, TAIL = 45, X = 10, RATE = 1.0; // snímky
const SCENES = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12];
const ids = Object.keys(vo) as (keyof typeof vo)[];
let t = LEAD;
export const TL = ids.map((id, i) => {
  const len = Math.ceil(((vo[id] as number) / RATE) * FPS);
  const item = { id, i, start: t, len };
  t += len + GAP;
  return item;
});
export const TOTAL = t - GAP + TAIL;
// drop hudby (35,0 s v nahrávce) přesně na záblesk loga FÉRSÍŤ (začátek scény 5)
const MUSIC_OFFSET = Math.round(35.0 * FPS) - (TL[4].start - X / 2);

// titulky: věty rozdělené podle délky textu
function Captions() {
  const f = useCurrentFrame();
  const cur = TL.find((s) => f >= s.start && f < s.start + s.len);
  if (!cur) return null;
  const text: string = (script as { id: string; text: string }[])[cur.i].text.replace('Férsíť', 'FÉRSÍŤ');
  const parts = text.match(/[^.!?]+[.!?]?/g)!.map((p) => p.trim()).filter(Boolean);
  const total = parts.reduce((a, p) => a + p.length, 0);
  let acc = 0; const local = (f - cur.start) / cur.len;
  let show = parts[parts.length - 1];
  for (const p of parts) { acc += p.length / total; if (local < acc) { show = p; break; } }
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 44 }}>
      <div style={{ maxWidth: 1500, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 36, color: '#fff', background: 'rgba(0,0,0,0.62)', padding: '12px 30px', borderRadius: 16, lineHeight: 1.3 }}>{show}</div>
    </AbsoluteFill>
  );
}
function Progress() {
  const f = useCurrentFrame();
  return <div style={{ position: 'absolute', left: 0, bottom: 0, height: 6, width: `${interpolate(f, [0, TOTAL], [0, 100])}%`, background: C.y }} />;
}

const VOICE_END = TL[TL.length - 1].start + TL[TL.length - 1].len;
// hudba pod hlasem tišší, na začátku nájezd, na konci (logo) zesílit a pak fade-out
const musicVol = (f: number) => {
  const base = interpolate(f, [0, 20], [0, 0.16], { extrapolateRight: 'clamp' });
  const outro = interpolate(f, [VOICE_END, VOICE_END + 10, TOTAL - 30, TOTAL], [0, 0.22, 0.22, -0.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.max(0, base + outro);
};

const Main = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
    {TL.map((s) => {
      const Sc = SCENES[s.i];
      const dur = s.len + GAP + X + (s.i === TL.length - 1 ? TAIL : 0);
      return (
        <Sequence key={s.id} from={s.start - X / 2} durationInFrames={dur} premountFor={30}>
          <Sc dur={dur} />
        </Sequence>
      );
    })}
    {TL.map((s) => (
      <Sequence key={'a' + s.id} from={s.start} durationInFrames={s.len + 12}>
        <Audio src={staticFile(`vo/${s.id}.wav`)} playbackRate={RATE} />
      </Sequence>
    ))}
    <Audio src={staticFile('music/bed_lyria-3.5.mp3')} startFrom={MUSIC_OFFSET} volume={musicVol} />
    <Captions />
    <Progress />
  </AbsoluteFill>
);

const OldPromo = () => { const f = useCurrentFrame(); return <PromoStage t={f / FPS} />; };

export const RemotionRoot = () => (
  <>
    <Composition id="Fersit" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="FersitPromo" component={OldPromo} durationInFrames={PROMO_LEN * FPS} fps={FPS} width={1920} height={1080} />
  </>
);
