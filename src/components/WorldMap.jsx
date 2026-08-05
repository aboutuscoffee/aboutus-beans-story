import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { project } from '../lib/projection';
import { fetchWorldLand, geometryToPath } from '../lib/worldGeo';

const WIDTH = 1000;
const HEIGHT = 320;

const RIPPLE_ORIGINS = [
  { cx: 150, cy: 160 },
  { cx: 540, cy: 170 },
  { cx: 800, cy: 130 },
];

function clusterKey(lat, lng) {
  return `${lat.toFixed(1)}_${lng.toFixed(1)}`;
}

export default function WorldMap({ beans }) {
  const [active, setActive] = useState(null);
  const [landPaths, setLandPaths] = useState(null);

  useEffect(() => {
    fetchWorldLand()
      .then((geo) => {
        const projectFn = (lng, lat) => project(lng, lat, WIDTH, HEIGHT);
        setLandPaths(
          geo.features
            .map((f) => geometryToPath(f.geometry, projectFn))
            .filter(Boolean)
        );
      })
      .catch(() => setLandPaths([]));
  }, []);

  const pins = useMemo(() => {
    const groups = {};
    beans
      .filter((b) => b.lat != null && b.lng != null)
      .forEach((b) => {
        const key = clusterKey(b.lat, b.lng);
        (groups[key] ??= []).push(b);
      });

    const placed = [];
    Object.values(groups).forEach((group) => {
      const base = project(group[0].lng, group[0].lat, WIDTH, HEIGHT);
      group.forEach((b, i) => {
        const angle = (i / group.length) * Math.PI * 2;
        const jitter = group.length > 1 ? 14 : 0;
        placed.push({
          ...b,
          x: base.x + Math.cos(angle) * jitter,
          y: base.y + Math.sin(angle) * jitter,
        });
      });
    });
    return placed;
  }, [beans]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
      <div
        className="absolute inset-0 ocean-pan"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}無題18.png)`,
          backgroundSize: '130%',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'rgba(250,250,248,0.55)' }} />

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="relative w-full h-full block">
        <defs>
          <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#443A35" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#443A35" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 波紋（環境演出） */}
        {RIPPLE_ORIGINS.map((r, i) => (
          <circle
            key={i}
            cx={r.cx}
            cy={r.cy}
            r="4"
            fill="none"
            stroke="rgba(67,58,53,0.22)"
            strokeWidth="1"
            className="ambient-ripple"
            style={{ animationDelay: `${i * 1.3}s` }}
          />
        ))}

        {landPaths?.map((d, i) => (
          <path key={i} d={d} fill="#e8e0d5" stroke="#b8b0a0" strokeWidth="0.5" />
        ))}

        {pins.map(({ bean, x, y }) => (
          <g
            key={bean.id}
            transform={`translate(${x}, ${y})`}
            onMouseEnter={() => setActive(bean.id)}
            onMouseLeave={() => setActive((a) => (a === bean.id ? null : a))}
          >
            <circle r="20" fill="url(#pinGlow)" className="pin-pulse" />
            <Link to={`/beans/${bean.id}`} aria-label={bean.name}>
              <circle r="6" fill="#443A35" stroke="#fff" strokeWidth="2" style={{ cursor: 'pointer' }} />
              <circle r="14" fill="transparent" style={{ cursor: 'pointer' }} />
            </Link>
            {active === bean.id && (
              <g pointerEvents="none">
                <text
                  x="0"
                  y="-16"
                  textAnchor="middle"
                  fill="#1A181A"
                  fontSize="13"
                  style={{ fontFamily: "'Noto Serif JP', serif" }}
                >
                  {bean.name}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>

      <style>{`
        .pin-pulse {
          transform-origin: center;
          animation: pin-pulse 2.6s ease-out infinite;
        }
        @keyframes pin-pulse {
          0% { r: 5; opacity: 0.9; }
          100% { r: 22; opacity: 0; }
        }
        .ambient-ripple {
          animation: ambient-ripple 5.2s ease-out infinite;
        }
        @keyframes ambient-ripple {
          0% { r: 4; opacity: 0.5; }
          100% { r: 140; opacity: 0; }
        }
        .ocean-pan {
          animation: ocean-pan 34s ease-in-out infinite alternate;
        }
        @keyframes ocean-pan {
          0% { background-position: 42% 46%; }
          100% { background-position: 58% 54%; }
        }
      `}</style>
    </div>
  );
}
