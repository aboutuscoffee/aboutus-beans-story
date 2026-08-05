import RouteMap from './RouteMap';

function parseChips(raw) {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

// プロトタイプ用: 産地の主要都市（ルート表現の起点）。将来的にはcountriesテーブルへ追加を検討
const COUNTRY_CAPITAL = {
  kenya: 'NAIROBI',
  ethiopia: 'ADDIS ABABA',
  colombia: 'BOGOTÁ',
  panama: 'PANAMA CITY',
};

export default function OriginSection({ bean, farm, country }) {
  const chips = parseChips(country?.flavor_chips);

  return (
    <section className="max-w-2xl mx-auto px-6 pb-16">
      <p className="text-[10px] tracking-[0.28em] mb-4" style={{ color: '#9a9080' }}>ORIGIN — 産地への旅</p>
      <RouteMap
        fromLabel={COUNTRY_CAPITAL[country?.slug] ?? country?.name?.toUpperCase()}
        toLabel={farm?.name}
        toSubLabel={farm?.location}
        caption={`${(farm?.location ?? country?.region ?? '').toUpperCase()}, ${country?.name?.toUpperCase() ?? ''}`}
        altitude={bean.altitude}
      />

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-6">
          {chips.map((chip) => (
            <span
              key={chip}
              style={{
                fontSize: '11px',
                letterSpacing: '0.02em',
                color: '#5a4838',
                background: 'rgba(90,72,56,0.07)',
                border: '0.5px solid rgba(90,72,56,0.18)',
                borderRadius: '20px',
                padding: '4px 12px',
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {country?.terroir && (
        <p className="text-[13px] leading-[1.95] mt-6" style={{ color: '#5a5248' }}>
          {country.terroir}
        </p>
      )}
    </section>
  );
}
