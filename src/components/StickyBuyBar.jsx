import { useEffect, useState } from 'react';
import { PURCHASE_URL } from '../lib/constants';

// ヒーローを過ぎたらスクロール中ずっと画面下に購入導線を出しておく
export default function StickyBuyBar({ bean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 transition-transform duration-300"
      style={{
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        background: 'rgba(26,24,26,0.96)',
        backdropFilter: 'blur(6px)',
        borderTop: '0.5px solid rgba(248,246,242,0.12)',
      }}
    >
      <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        <p className="font-serif-jp text-[13px] truncate" style={{ color: '#F8F6F2' }}>
          {bean.name}
        </p>
        <a
          href={PURCHASE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex-shrink-0 px-5 py-2.5 text-[11px] tracking-[0.15em] whitespace-nowrap"
          style={{ background: '#F8F6F2', color: '#1A181A' }}
        >
          購入する
        </a>
      </div>
    </div>
  );
}
