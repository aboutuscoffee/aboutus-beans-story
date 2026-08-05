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
