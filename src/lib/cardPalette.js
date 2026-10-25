import { sampleChartColor } from './chartColor';

const cache = new Map();

// 濃い色（紫など）が文字の背景で強くなりすぎないよう、色相は保ったまま明るさを持ち上げる
function softened(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  const l = (mx + mn) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = d === 0 ? 0 : mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return `hsl(${Math.round(h)}, ${Math.round(Math.min(s, 0.85) * 100)}%, ${Math.round(Math.min(0.84, Math.max(0.64, l)) * 100)}%)`;
}

// シールカード下部の「色のスプラッシュ」から、色相ごとの代表色を取り出す（多い順）
function splashColors(url, max = 3) {
  if (cache.has(url)) return cache.get(url);
  const p = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => resolve([]);
    img.onload = () => {
      try {
        const W = 100;
        const H = Math.round((img.naturalHeight * W) / img.naturalWidth);
        const canvas = document.createElement('canvas');
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, W, H);
        const y0 = Math.floor(H * 0.55);
        const { data } = ctx.getImageData(0, y0, W, H - y0);

        const buckets = Array.from({ length: 12 }, () => ({ n: 0, r: 0, g: 0, b: 0 }));
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
          if (mx - mn < 40) continue;
          let h = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
          h = (h * 60 + 360) % 360;
          const k = buckets[Math.floor(h / 30) % 12];
          k.n++; k.r += r; k.g += g; k.b += b;
        }
        const total = buckets.reduce((s, k) => s + k.n, 0) || 1;
        const colors = buckets
          .filter((k) => k.n / total > 0.06)
          .sort((a, b) => b.n - a.n)
          .slice(0, max)
          .map((k) => softened(k.r / k.n, k.g / k.n, k.b / k.n));
        resolve(colors);
      } catch {
        resolve([]);
      }
    };
    img.src = url;
  });
  cache.set(url, p);
  return p;
}

const hsl = (c, dl = 0) => `hsl(${Math.round(c.h)}, ${Math.round(Math.min(c.s, 0.85) * 100)}%, ${Math.round(Math.min(0.82, Math.max(0.64, c.l + dl)) * 100)}%)`;

// ヒーローの水彩に使う5色。カード下部のスプラッシュの色を主役に、レーダーチャートの色を添える。
// 色が足りないときは同じ色を明るさ違いで補う。
export async function cardPalette(frontUrl, chartUrl) {
  const [splash, chart] = await Promise.all([
    frontUrl ? splashColors(frontUrl) : [],
    chartUrl ? sampleChartColor(chartUrl) : null,
  ]);
  const base = [...splash];
  if (chart) base.push(hsl(chart));
  if (base.length === 0) return null;
  const palette = [];
  for (let i = 0; i < 5; i++) palette.push(base[i % base.length]);
  return palette;
}
