const BG = '#f3f0e8';
const RING = 'rgba(107,90,69,.55)';

// 画面の (x, y) から水の波紋が広がり、クリーム色に染まったところで onCovered（画面遷移）を呼び、
// 遷移後のページが見えるように静かに消える。
export function playRippleTransition(x, y, onCovered) {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    onCovered();
    return;
  }

  const W = window.innerWidth, H = window.innerHeight;
  const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) * 1.05;

  const root = document.createElement('div');
  root.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden';
  document.body.appendChild(root);

  // 細い輪を時間差で3本
  const rings = [0, 140, 280].map((delay) => {
    const ring = document.createElement('div');
    ring.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${R * 2}px;height:${R * 2}px;margin:${-R}px 0 0 ${-R}px;border-radius:50%;border:1px solid ${RING};opacity:0;transform:scale(0)`;
    root.appendChild(ring);
    return ring.animate(
      [
        { transform: 'scale(0.02)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 0 },
      ],
      { duration: 900, delay, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'both' }
    );
  });

  // クリーム色の波が広がって画面を覆う
  const fill = document.createElement('div');
  fill.style.cssText = `position:absolute;inset:0;background:${BG}`;
  root.appendChild(fill);
  const cover = fill.animate(
    [
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      { clipPath: `circle(${R}px at ${x}px ${y}px)` },
    ],
    { duration: 800, delay: 120, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' }
  );

  // アニメーションが止まる環境（裏タブなど）でも画面遷移できるよう、時間でも保険をかける
  let covered = false;
  const onCover = () => {
    if (covered) return;
    covered = true;
    onCovered();
    // 次のページの描画を待ってから、波が引くように消す
    setTimeout(() => {
      let removed = false;
      const remove = () => { if (!removed) { removed = true; root.remove(); } };
      const out = root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, easing: 'ease-out', fill: 'forwards' });
      out.onfinish = remove;
      setTimeout(remove, 1200);
    }, 350);
  };
  cover.onfinish = onCover;
  setTimeout(onCover, 1100);
  rings.forEach((a) => a.play());
}
