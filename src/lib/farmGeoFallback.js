// farms に緯度経度が未登録の農園用の仮座標（産地の町・地域の中心あたり）。
// Beans Profile で農園に緯度経度が登録されれば、そちらが優先される。
export const FARM_GEO_FALLBACK = {
  'el-pergamino': { lat: 8.84, lng: -82.62 }, // Bambito, Tierras Altas, Chiriquí
  llavicucha: { lat: -3.62, lng: -79.23 }, // Saraguro, Loja
  'nova-coffee': { lat: -1.58, lng: 30.07 }, // Gicumbi District
  'vermilion-blaze': { lat: 1.88, lng: -76.27 }, // San Agustín, Huila
  'finca-milan': { lat: 5.0, lng: -76.0 }, // Risaralda
};
