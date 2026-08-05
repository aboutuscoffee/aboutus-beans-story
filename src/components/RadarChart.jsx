const AXES = [
  { key: 'score_flavor', label: 'Flavor' },
  { key: 'score_aroma', label: 'Aroma' },
  { key: 'score_mouthfeel', label: 'Mouthfeel' },
  { key: 'score_sweetness', label: 'Sweetness' },
  { key: 'score_acidity', label: 'Acidity' },
  { key: 'score_aftertaste', label: 'Aftertaste' },
];

const MAX = 5;
const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 36;

function pointAt(index, ratio) {
  const angle = (Math.PI / 3) * index - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * RADIUS * ratio,
    y: CENTER + Math.sin(angle) * RADIUS * ratio,
  };
}

function polygonPoints(ratios) {
  return ratios.map((r, i) => pointAt(i, r)).map((p) => `${p.x},${p.y}`).join(' ');
}

export default function RadarChart({ bean }) {
  const values = AXES.map((a) => bean[a.key]);
  if (values.some((v) => v == null)) return null;

  const ratios = values.map((v) => v / MAX);
  const gridLevels = [0.33, 0.66, 1];

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={polygonPoints(AXES.map(() => level))}
            fill="none"
            stroke="rgba(67,58,53,0.18)"
            strokeWidth="0.75"
          />
        ))}
        {AXES.map((_, i) => {
          const p = pointAt(i, 1);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={p.x}
              y2={p.y}
              stroke="rgba(67,58,53,0.18)"
              strokeWidth="0.75"
            />
          );
        })}

        <polygon
          points={polygonPoints(ratios)}
          fill="rgba(68,58,53,0.35)"
          stroke="#443A35"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {ratios.map((r, i) => {
          const p = pointAt(i, r);
          return <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#443A35" />;
        })}

        {AXES.map((a, i) => {
          const p = pointAt(i, 1.28);
          return (
            <text
              key={a.key}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              letterSpacing="0.03em"
              fill="#9a9080"
            >
              {a.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
