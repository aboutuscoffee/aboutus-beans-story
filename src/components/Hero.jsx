import { useEffect, useState } from 'react';
import { sampleBottomColor } from '../lib/sampleColor';
import { cardPalette } from '../lib/cardPalette';

const FALLBACK_RGB = [26, 24, 26];
const FALLBACK_PALETTE = ['#e9e3d3', '#eee8d9', '#e6e0cf', '#efe9db', '#e9e3d3'];

// 水彩のにじみ（[色の番号, 左%, 上%, 大きさの係数]）。味わいの数だけ色の玉を重ねる想定の配置
const BLOBS = [
  [3, 12, 8, 1.0],
  [4, 30, 52, 0.9],
  [0, 50, 10, 0.9],
  [1, 74, 58, 1.0],
  [2, 88, 6, 0.9],
];

const CUE = 'About this Bean';

function PhotoHero({ bean, farm, country, image }) {
  const [rgb, setRgb] = useState(FALLBACK_RGB);

  useEffect(() => {
    setRgb(FALLBACK_RGB);
    if (!image) return;
    let cancelled = false;
    sampleBottomColor(image).then((sampled) => {
      if (!cancelled && sampled) setRgb(sampled);
    });
    return () => { cancelled = true; };
  }, [image]);

  const [r, g, b] = rgb;
  const scrim = `linear-gradient(180deg, rgba(${r},${g},${b},0) 0%, rgba(${r},${g},${b},0) 50%, rgba(${r},${g},${b},0.30) 78%, rgba(${r},${g},${b},0.58) 100%)`;

  return (
    <section className="relative h-[50svh] min-h-[420px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 transition-[background] duration-700" style={{ background: scrim }} />

      <div className="relative h-full flex flex-col items-center justify-end text-center px-6 pb-10">
        <p className="reveal mb-3 text-[11px] tracking-[0.32em]" style={{ color: 'rgba(248,246,242,0.75)', animationDelay: '0.1s' }}>
          {country?.flag} {country?.name?.toUpperCase()} — {farm?.name}
        </p>
        <h1
          className="reveal font-display font-light leading-[1.1] px-2"
          style={{ color: '#F8F6F2', fontSize: 'clamp(26px, 6vw, 48px)', animationDelay: '0.25s' }}
        >
          {bean.name}
        </h1>
        <div className="reveal mt-5 flex flex-col items-center gap-2" style={{ animationDelay: '0.6s' }}>
          <span style={{ width: '1px', height: '22px', background: 'rgba(248,246,242,0.5)' }} />
          <a href="#story" className="text-[10px] tracking-[0.24em]" style={{ color: 'rgba(248,246,242,0.85)' }}>
            {CUE}
          </a>
        </div>
      </div>
    </section>
  );
}

// シールカード1枚の豆: カードの絵柄は出さず、カードの色（スプラッシュ・レーダーチャート）を水彩のようににじませる
function WatercolorHero({ bean, farm, country, frontImage, chartImage }) {
  const [palette, setPalette] = useState(FALLBACK_PALETTE);

  useEffect(() => {
    setPalette(FALLBACK_PALETTE);
    let cancelled = false;
    cardPalette(frontImage, chartImage).then((p) => {
      if (!cancelled && p) setPalette(p);
    });
    return () => { cancelled = true; };
  }, [frontImage, chartImage]);

  return (
    <section className="relative h-[50svh] min-h-[420px] w-full overflow-hidden" style={{ background: '#f7f5ee' }}>
      {BLOBS.map(([ci, left, top, k], i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute rounded-full transition-colors duration-700"
          style={{
            background: palette[ci % palette.length],
            left: `${left}%`,
            top: `${top}%`,
            width: `calc(clamp(220px, 30vw, 340px) * ${k})`,
            height: `calc(clamp(220px, 30vw, 340px) * ${k})`,
            transform: 'translate(-50%, 0)',
            filter: 'blur(34px) saturate(1.45)',
            mixBlendMode: 'multiply',
            opacity: 0.95,
          }}
        />
      ))}

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <p className="reveal mb-3 text-[11px] tracking-[0.32em]" style={{ color: '#6b6254', animationDelay: '0.1s' }}>
          {country?.flag} {country?.name?.toUpperCase()} — {farm?.name}
        </p>
        <h1
          className="reveal font-display font-light leading-[1.1] px-2"
          style={{ color: '#1A181A', fontSize: 'clamp(28px, 6vw, 50px)', animationDelay: '0.25s' }}
        >
          {bean.name}
        </h1>
        <div className="reveal mt-5 flex flex-col items-center gap-2" style={{ animationDelay: '0.6s' }}>
          <span style={{ width: '1px', height: '22px', background: '#6b6254' }} />
          <a href="#story" className="text-[10px] tracking-[0.24em]" style={{ color: '#4a4038' }}>
            {CUE}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Hero({ bean, farm, country, heroImage, photo = false, chartImage = null }) {
  const image = heroImage ?? bean.image_urls?.[0];
  if (photo) return <PhotoHero bean={bean} farm={farm} country={country} image={image} />;
  return <WatercolorHero bean={bean} farm={farm} country={country} frontImage={image} chartImage={chartImage} />;
}
