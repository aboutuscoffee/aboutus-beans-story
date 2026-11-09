// farms に緯度経度が未登録の農園用の仮座標（産地の町・地域の中心あたり）。
// Beans Profile で農園に緯度経度が登録されれば、そちらが優先される。
export const FARM_GEO_FALLBACK = {
  'el-pergamino': { lat: 8.84, lng: -82.62 }, // Bambito, Tierras Altas, Chiriquí
  llavicucha: { lat: -3.62, lng: -79.23 }, // Saraguro, Loja
  'nova-coffee': { lat: -1.58, lng: 30.07 }, // Gicumbi District
  'vermilion-blaze': { lat: 1.88, lng: -76.27 }, // San Agustín, Huila
  'finca-milan': { lat: 5.0, lng: -76.0 }, // Risaralda
  kagunyu: { lat: -0.58, lng: 37.13 }, // Mukurwe-ini, Nyeri
  'el-origen': { lat: 4.4, lng: -75.7 }, // Quindío
  aborigen: { lat: 8.83, lng: -82.61 }, // Bambito, Tierras Altas, Chiriquí
  'finca-tres-cedros': { lat: -6.23, lng: -79.37 }, // Incahuasi, Lambayeque
};

// 農園リンクが無い豆用（豆名で引く）
export const BEAN_GEO_FALLBACK = {
  Danche: { lat: 6.16, lng: 38.2 }, // Yirgacheffe, Gedeo
};
