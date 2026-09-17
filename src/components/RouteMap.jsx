import { useEffect, useState } from 'react';
import { fetchWorldLand, fitProjection, geometryToPath } from '../lib/worldGeo';
import { COUNTRY_GEO } from '../lib/countryGeo';

const WIDTH = 500;
const HEIGHT = 600;

// 農園への「旅」を、その国の実際の国境シルエット上に首都→農園のルートで見せる演出用マップ
export default function RouteMap({ countrySlug, farm, caption, altitude }) {
  const [geo, setGeo] = useState(null);

  const info = COUNTRY_GEO[countrySlug];

  useEffect(() => {
    if (!info) return;
    fetchWorldLand().then((land) => {
      const feat = land.features.find((f) => f.properties?.name === info.atlasName);
      if (feat) setGeo(feat.geometry);
    });
  }, [info]);

  if (!info || !farm?.lat || !farm?.lng) return null;

  const project = geo ? fitProjection(geo, WIDTH, HEIGHT) : null;
  const countryPath = geo && project ? geometryToPath(geo, project) : '';
  const capital = project ? project(info.capitalLng, info.capitalLat) : null;
  const target = project ? project(farm.lng, farm.lat) : null;

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{ background: '#1A181A', aspectRatio: '4 / 5', maxHeight: '520px' }}
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8C99A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E8C99A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {countryPath && <path d={countryPath} fill="#28241f" />}

        {capital && target && (
          <>
            <path
              d={`M ${capital.x} ${capital.y} Q ${(capital.x + target.x) / 2 + (target.y - capital.y) * 0.12} ${(capital.y + target.y) / 2 - (target.x - capital.x) * 0.12} ${target.x} ${target.y}`}
              fill="none"
              stroke="#E8C99A"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
              className="route-dash"
            />

            <circle cx={capital.x} cy={capital.y} r="4" fill="#8a8070" />
            <text x={capital.x + 10} y={capital.y + 4} fill="rgba(248,246,242,0.55)" fontSize="13" letterSpacing="1">
              {info.capital}
            </text>

            <circle cx={target.x} cy={target.y} r="16" fill="url(#glow)" />
            <circle cx={target.x} cy={target.y} r="4.5" fill="#F8F6F2" />
            <text x={target.x + 12} y={target.y - 6} fill="#F8F6F2" fontSize="15" fontWeight="600">
              {farm.name}
            </text>
            {farm.location && (
              <text x={target.x + 12} y={target.y + 14} fill="rgba(248,246,242,0.6)" fontSize="11">
                {farm.location}
              </text>
            )}
          </>
        )}
      </svg>

      <div className="absolute left-5 bottom-5 text-[11px] tracking-[0.14em]" style={{ color: 'rgba(248,246,242,0.55)' }}>
        {caption}
      </div>
      {altitude && (
        <div className="absolute right-5 bottom-5 text-[11px] tracking-[0.1em]" style={{ color: 'rgba(248,246,242,0.55)' }}>
          ALT. {altitude}
        </div>
      )}

      <style>{`
        .route-dash {
          stroke-dashoffset: 240;
          animation: route-draw 2.4s ease-out forwards;
        }
        @keyframes route-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
