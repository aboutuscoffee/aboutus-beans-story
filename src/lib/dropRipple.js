// 水面に雫が落ちたような波紋を、SVGの <g> や <svg> の中に1つ足す。
// 細い輪が時間差で2本広がって消える。輪どうしが重なって、ロゴの重なる波紋のように見える。
const NS = 'http://www.w3.org/2000/svg';

function el(name, attrs) {
  const e = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

// 戻り値: 途中で止めるための関数（タイマーと輪を片づける）
export function dropRipple(parent, { x, y, r0 = 2, r1 = 60, sw = 1, color = '#6b5a45', rings = 2, gap = 0.6, dur = 3.4, peak = 0.7 }) {
  const timers = [];
  const nodes = [];
  for (let k = 0; k < rings; k++) {
    const c = el('circle', { cx: x, cy: y, r: r0, fill: 'none', stroke: color, 'stroke-width': sw, opacity: 0 });
    const a = el('animate', {
      attributeName: 'r', from: r0, to: r1 * (1 - k * 0.25), dur: `${dur}s`, begin: 'indefinite',
      fill: 'freeze', calcMode: 'spline', keyTimes: '0;1', keySplines: '.2 .5 .3 1',
    });
    const o = el('animate', {
      attributeName: 'opacity', values: `0;${peak - k * 0.2};0`, keyTimes: '0;0.12;1', dur: `${dur}s`, begin: 'indefinite', fill: 'freeze',
    });
    c.appendChild(a);
    c.appendChild(o);
    parent.appendChild(c);
    nodes.push(c);
    timers.push(setTimeout(() => { try { a.beginElement(); o.beginElement(); } catch { /* 描画できない環境では何もしない */ } }, k * gap * 1000));
    timers.push(setTimeout(() => c.remove(), (k * gap + dur) * 1000 + 300));
  }
  return () => { timers.forEach(clearTimeout); nodes.forEach((n) => n.remove()); };
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
