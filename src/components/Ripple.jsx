import { useEffect, useRef } from 'react';
import { dropRipple, prefersReducedMotion } from '../lib/dropRipple';

// 読み込み中の波紋。水面に雫がランダムに落ちて、細い輪が重なりながら広がって消える
export default function Ripple({ label, className = '', style }) {
  const ref = useRef(null);

  useEffect(() => {
    const g = ref.current;
    if (!g) return undefined;
    // 動きを減らす設定のときは、輪を2本だけ止めて見せる
    if (prefersReducedMotion()) {
      [22, 38].forEach((r) => {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', 120); c.setAttribute('cy', 120); c.setAttribute('r', r);
        c.setAttribute('fill', 'none'); c.setAttribute('stroke', '#6b5a45'); c.setAttribute('stroke-width', 1); c.setAttribute('opacity', 0.4);
        g.appendChild(c);
      });
      return () => { while (g.firstChild) g.removeChild(g.firstChild); };
    }
    const cancels = new Set();
    const drop = () => {
      const cancel = dropRipple(g, {
        x: 50 + Math.random() * 140,
        y: 50 + Math.random() * 140,
        r1: 52 + Math.random() * 24,
      });
      cancels.add(cancel);
    };
    drop();
    const id = setInterval(drop, 800);
    return () => { clearInterval(id); cancels.forEach((c) => c()); };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={style} role="status" aria-label={label}>
      <svg viewBox="0 0 240 240" width="200" height="200" aria-hidden="true" style={{ overflow: 'visible' }}>
        <g ref={ref} />
      </svg>
      {label && <p className="mt-2 font-display text-[12px] tracking-[0.24em]" style={{ color: '#9a9080' }}>{label}</p>}
    </div>
  );
}
