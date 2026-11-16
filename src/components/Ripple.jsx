import { prefersReducedMotion } from '../lib/dropRipple';

// 読み込み中の波紋。ロゴの3方向（上・左下・右下）に3つの発生源を置き、
// 細い輪が一定の間隔で広がって消える。3つは少しずつタイミングをずらし、輪が重なってロゴのように見える
const D = 34; // 中心から各発生源までの距離
const SOURCES = [
  [120, 120 - D],
  [120 - D * 0.87, 120 + D * 0.5],
  [120 + D * 0.87, 120 + D * 0.5],
];
const T = 4.8; // 1つの輪が広がりきるまで
const N = 3; // 発生源ごとの輪の数
const SPACING = T / N; // 輪の間隔（1.6秒）

export default function Ripple({ label, className = '', style }) {
  const still = prefersReducedMotion();
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={style} role="status" aria-label={label}>
      <svg viewBox="0 0 240 240" width="200" height="200" aria-hidden="true" style={{ overflow: 'visible' }}>
        {SOURCES.flatMap(([cx, cy], i) =>
          Array.from({ length: N }, (_, k) => {
            const begin = `${(k * SPACING + (i * SPACING) / 3).toFixed(2)}s`;
            return still ? (
              k < 2 && <circle key={`${i}-${k}`} cx={cx} cy={cy} r={16 + k * 22} fill="none" stroke="#6b5a45" strokeWidth="1" opacity="0.35" />
            ) : (
              <circle key={`${i}-${k}`} cx={cx} cy={cy} r="0" fill="none" stroke="#6b5a45" strokeWidth="1" opacity="0">
                <animate attributeName="r" from="0" to="80" dur={`${T}s`} begin={begin} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.75;0" keyTimes="0;0.1;1" dur={`${T}s`} begin={begin} repeatCount="indefinite" />
              </circle>
            );
          })
        )}
      </svg>
      {label && <p className="mt-2 font-display text-[12px] tracking-[0.24em]" style={{ color: '#9a9080' }}>{label}</p>}
    </div>
  );
}
