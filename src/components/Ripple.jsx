// 読み込み中の波紋。茶色の細い輪が広がって消える
export default function Ripple({ label, className = '', style }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={style} role="status" aria-label={label}>
      <div className="relative" style={{ width: 120, height: 120 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full ripple-ring"
            style={{ border: '1px solid rgba(107,90,69,.55)', animationDelay: `${i * 0.9}s` }}
          />
        ))}
        <span className="absolute rounded-full" style={{ width: 6, height: 6, left: 57, top: 57, background: '#6b5a45' }} />
      </div>
      {label && <p className="mt-4 font-display text-[12px] tracking-[0.24em]" style={{ color: '#9a9080' }}>{label}</p>}
    </div>
  );
}
