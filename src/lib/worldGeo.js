import { feature } from 'topojson-client';

let cached = null;

// 110m解像度の軽量な世界地図データ（国境ポリゴン）を1度だけ取得してキャッシュする
export async function fetchWorldLand() {
  if (cached) return cached;
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
  const topo = await res.json();
  cached = feature(topo, topo.objects.countries);
  return cached;
}

function ringToPath(ring, project) {
  return ring
    .map(([lng, lat], i) => {
      const { x, y } = project(lng, lat);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ') + ' Z';
}

function outerRings(geometry) {
  if (geometry.type === 'Polygon') return [geometry.coordinates[0]];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.map((poly) => poly[0]);
  return [];
}

// 単一の国の輪郭をviewBoxいっぱいに収める投影を作る。
// 離島（例: エクアドルのガラパゴス）が全体の縮尺を歪めないよう、最も点数の多い輪郭（=本土）だけを基準にbboxを取る
export function fitProjection(geometry, width, height, padding = 24) {
  const rings = outerRings(geometry);
  const mainland = rings.reduce((a, b) => (b.length > a.length ? b : a), rings[0] ?? []);

  let lngMin = Infinity, lngMax = -Infinity, latMin = Infinity, latMax = -Infinity;
  for (const [lng, lat] of mainland) {
    if (lng < lngMin) lngMin = lng;
    if (lng > lngMax) lngMax = lng;
    if (lat < latMin) latMin = lat;
    if (lat > latMax) latMax = lat;
  }

  const lngSpan = Math.max(lngMax - lngMin, 0.01);
  const latSpan = Math.max(latMax - latMin, 0.01);
  const scale = Math.min((width - padding * 2) / lngSpan, (height - padding * 2) / latSpan);

  const lngCenter = (lngMin + lngMax) / 2;
  const latCenter = (latMin + latMax) / 2;
  const xCenter = width / 2;
  const yCenter = height / 2;

  return (lng, lat) => ({
    x: xCenter + (lng - lngCenter) * scale,
    y: yCenter - (lat - latCenter) * scale,
  });
}

export function geometryToPath(geometry, project) {
  if (!geometry) return '';
  if (geometry.type === 'Polygon') {
    return geometry.coordinates.map((ring) => ringToPath(ring, project)).join(' ');
  }
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates
      .map((poly) => poly.map((ring) => ringToPath(ring, project)).join(' '))
      .join(' ');
  }
  return '';
}
