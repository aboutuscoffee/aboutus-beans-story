// world-atlasの国名(properties.name)と一致させるための対応表。
// 首都の緯度経度は「首都→農園」のルート表現の起点として使う。
export const COUNTRY_GEO = {
  colombia: { atlasName: 'Colombia', capital: 'BOGOTÁ', capitalLat: 4.711, capitalLng: -74.0721 },
  panama: { atlasName: 'Panama', capital: 'PANAMA CITY', capitalLat: 8.9824, capitalLng: -79.5199 },
  ethiopia: { atlasName: 'Ethiopia', capital: 'ADDIS ABABA', capitalLat: 9.025, capitalLng: 38.7469 },
  kenya: { atlasName: 'Kenya', capital: 'NAIROBI', capitalLat: -1.2864, capitalLng: 36.8172 },
  ecuador: { atlasName: 'Ecuador', capital: 'QUITO', capitalLat: -0.1807, capitalLng: -78.4678 },
  honduras: { atlasName: 'Honduras', capital: 'TEGUCIGALPA', capitalLat: 14.0723, capitalLng: -87.1921 },
  'costa-rica': { atlasName: 'Costa Rica', capital: 'SAN JOSÉ', capitalLat: 9.9281, capitalLng: -84.0907 },
  guatemala: { atlasName: 'Guatemala', capital: 'GUATEMALA CITY', capitalLat: 14.6349, capitalLng: -90.5069 },
};
