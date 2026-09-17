import { useEffect, useRef, useState } from 'react';

// セクションが画面内にスクロールで入ってきたタイミングでふわっと表示する汎用ラッパー
export default function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-io ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}
