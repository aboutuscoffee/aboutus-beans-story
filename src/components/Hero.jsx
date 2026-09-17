import { useEffect, useState } from 'react';
import { sampleBottomColor } from '../lib/sampleColor';

const FALLBACK_RGB = [26, 24, 26];

export default function Hero({ bean, farm, country, heroImage }) {
  const image = heroImage ?? bean.image_urls?.[0];
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
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div
        className="absolute inset-0 transition-[background] duration-700"
        style={{ background: scrim }}
      />

      <div className="relative h-full flex flex-col items-center justify-end text-center px-6 pb-20">
        <p
          className="reveal mb-4 text-[11px] tracking-[0.32em]"
          style={{ color: 'rgba(248,246,242,0.75)', animationDelay: '0.1s' }}
        >
          {country?.flag} {country?.name?.toUpperCase()} — {farm?.name}
        </p>
        <h1
          className="reveal font-display font-light leading-[1.1] px-2"
          style={{ color: '#F8F6F2', fontSize: 'clamp(32px, 7vw, 64px)', animationDelay: '0.25s' }}
        >
          {bean.name}
        </h1>
        <div className="reveal mt-6 flex flex-col items-center gap-3" style={{ animationDelay: '0.6s' }}>
          <span style={{ width: '1px', height: '36px', background: 'rgba(248,246,242,0.5)' }} />
          <a
            href="#story"
            className="text-[10px] tracking-[0.24em]"
            style={{ color: 'rgba(248,246,242,0.85)' }}
          >
            この豆を知る
          </a>
        </div>
      </div>
    </section>
  );
}
