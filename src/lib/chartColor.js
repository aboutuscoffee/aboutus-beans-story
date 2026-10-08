// シールカードのレーダーチャートの塗り色を読み取り、豆どうしの「色の近さ」を測る。
// チャートの位置は ChartCrop と同じ（x 36〜85% / y 56〜85%）。

const cache = new Map();

function toHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2, d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  return { h: h < 0 ? h + 360 : h, s, l };
}

export function sampleChartColor(url) {
  if (!url) return Promise.resolve(null);
  if (cache.has(url)) return cache.get(url);

  const p = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => resolve(null);
    img.onload = () => {
      try {
        const W = 120;
        const H = Math.round((img.naturalHeight * W) / img.naturalWidth);
        const canvas = document.createElement('canvas');
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, W, H);
        const x0 = Math.floor(W * 0.36), y0 = Math.floor(H * 0.56);
        const { data } = ctx.getImageData(x0, y0, Math.floor(W * 0.49), Math.floor(H * 0.29));
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const sat = Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]);
          if (sat > 50) { r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
        }
        resolve(n > 20 ? toHsl(r / n, g / n, b / n) : null);
      } catch {
        resolve(null);
      }
    };
    img.src = url;
  });
  cache.set(url, p);
  return p;
}

// 0（同じ色）〜 約1（正反対）。色相を主に、彩度・明度を少しだけ見る
export function colorDistance(a, b) {
  if (!a || !b) return 1;
  const dh = Math.abs(a.h - b.h);
  return (Math.min(dh, 360 - dh) / 180) * 0.7 + Math.abs(a.s - b.s) * 0.15 + Math.abs(a.l - b.l) * 0.15;
}
