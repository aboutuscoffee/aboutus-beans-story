// 農園への「旅」を抽象的なルート表現で見せる演出用マップ。
// 精密な地理データではなく、起点（主要都市）→農園のダッシュラインで没入感を出す。
export default function RouteMap({ fromLabel, toLabel, toSubLabel, caption, altitude }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{ background: '#1A181A', aspectRatio: '4 / 5', maxHeight: '520px' }}
    >
      <svg viewBox="0 0 500 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8C99A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E8C99A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 抽象的な陸地シルエット */}
        <path
          d="M 90 560 C 40 460, 60 340, 130 260 C 180 200, 170 130, 240 90 C 320 45, 400 70, 430 150
             C 460 230, 400 260, 400 340 C 400 430, 340 480, 280 560 C 220 610, 140 610, 90 560 Z"
          fill="#28241f"
        />

        {/* ルート */}
        <path
          d="M 150 490 Q 220 420 250 340 T 330 150"
          fill="none"
          stroke="#E8C99A"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          className="route-dash"
        />

        {/* 起点 */}
        <circle cx="150" cy="490" r="4" fill="#8a8070" />
        <text x="162" y="495" fill="rgba(248,246,242,0.55)" fontSize="13" letterSpacing="1">{fromLabel}</text>

        {/* 農園（強調） */}
        <circle cx="330" cy="150" r="16" fill="url(#glow)" />
        <circle cx="330" cy="150" r="4.5" fill="#F8F6F2" />
        <text x="342" y="146" fill="#F8F6F2" fontSize="15" fontWeight="600">{toLabel}</text>
        {toSubLabel && <text x="342" y="166" fill="rgba(248,246,242,0.6)" fontSize="11">{toSubLabel}</text>}
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
