import RouteMap from './RouteMap';
import { formatAltitude } from '../lib/text';

function parseChips(raw) {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export default function OriginSection({ bean, farm, country, mapOnRight = false }) {
  const chips = parseChips(country?.flavor_chips);

  return (
    <section className="tight max-w-3xl mx-auto px-6 pb-10">
      <p className="text-[10px] tracking-[0.28em] mb-4" style={{ color: '#9a9080' }}>ORIGIN — 産地への旅</p>
      <div className={`flex flex-col ${mapOnRight ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-10 md:items-center`}>
        <div className="w-full max-w-[300px] mx-auto md:mx-0 md:w-[300px] flex-shrink-0">
          <RouteMap
            countrySlug={country?.slug}
            farm={farm}
            caption={`${(farm?.location ?? country?.region ?? '').toUpperCase()}, ${country?.name?.toUpperCase() ?? ''}`}
            altitude={formatAltitude(bean.altitude)}
          />
        </div>

        <div className="flex-1">
          {country?.name && (
            <p className="font-serif-jp text-[17px] mb-3" style={{ color: '#1A181A', margin: 0 }}>
              {country.flag} {country.name}
            </p>
          )}

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
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
            <p className="text-[13px] leading-[1.9] mt-4" style={{ color: '#5a5248' }}>
              {country.terroir}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
