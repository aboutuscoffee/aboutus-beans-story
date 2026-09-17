// ヒーロー画像下部の色を自動サンプリングし、その色みを保った暗いスクリム色を算出する。
// 豆ごとに画像が変わっても、その都度その画像に合った色に自動で追従させるための仕組み。

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return [0, 0, l];

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h;
  if (max === r) h = ((g - b) / delta) % 6;
  else if (max === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h *= 60;
  if (h < 0) h += 360;
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r1, g1, b1;
  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

// 元の色みは保ちつつ、常に十分暗いスクリム用トーンへ変換する
function toDarkScrimTone([r, g, b]) {
  const [h, s] = rgbToHsl(r, g, b);
  const clampedS = Math.min(Math.max(s, 0.15), 0.4);
  return hslToRgb(h, clampedS, 0.15);
}

export function sampleBottomColor(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const fail = () => resolve(null);
    img.onerror = fail;

    img.onload = () => {
      try {
        const SAMPLE_W = 80;
        const scale = SAMPLE_W / img.naturalWidth;
        const sampleH = Math.max(1, Math.round(img.naturalHeight * scale));

        const canvas = document.createElement('canvas');
        canvas.width = SAMPLE_W;
        canvas.height = sampleH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, SAMPLE_W, sampleH);

        const bandTop = Math.floor(sampleH * 0.72);
        const bandHeight = sampleH - bandTop;
        if (bandHeight <= 0) return fail();

        const { data } = ctx.getImageData(0, bandTop, SAMPLE_W, bandHeight);
        let sum = [0, 0, 0], count = 0;
        let vividSum = [0, 0, 0], vividCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const sat = Math.max(r, g, b) - Math.min(r, g, b);
          sum[0] += r; sum[1] += g; sum[2] += b; count++;
          if (sat > 40) {
            vividSum[0] += r; vividSum[1] += g; vividSum[2] += b; vividCount++;
          }
        }

        if (count === 0) return fail();
        const useVivid = vividCount > count * 0.08;
        const [r, g, b] = useVivid
          ? vividSum.map((v) => v / vividCount)
          : sum.map((v) => v / count);

        resolve(toDarkScrimTone([r, g, b]));
      } catch {
        fail();
      }
    };

    img.src = imageUrl;
  });
}
