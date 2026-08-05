// 中南米〜アフリカ〜インド洋周辺（コーヒーベルト）を1枚に収める簡易等長方形図法
// 経度: -100〜150 / 緯度: -30〜42 の範囲を viewBox に正規化する
const LNG_MIN = -100;
const LNG_MAX = 150;
const LAT_MIN = -30;
const LAT_MAX = 42;

export function project(lng, lat, width, height) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * width;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * height;
  return { x, y };
}
