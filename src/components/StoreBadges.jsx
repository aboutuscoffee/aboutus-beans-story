// 二条・伏見のどちらで飲めるか。beans.stores（文字列の配列）が空なら何も出さない
const STORE_EN = { 二条: 'Nijo', 伏見: 'Fushimi' };

export default function StoreBadges({ bean, className = '', style }) {
  const stores = Array.isArray(bean.stores) ? bean.stores : [];
  if (!stores.length) return null;
  return (
    <span className={`inline-flex gap-1 ${className}`} style={style}>
      {stores.map((s) => (
        <span
          key={s}
          className="rounded-full px-2.5 py-[2px] font-display text-[11px] leading-snug tracking-[0.12em]"
          style={{ background: 'rgba(250,249,246,.82)', color: '#4a4038', backdropFilter: 'blur(4px)', border: '.5px solid rgba(107,90,69,.25)' }}
        >
          {STORE_EN[s] ?? s}
        </span>
      ))}
    </span>
  );
}
