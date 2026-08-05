import { useState } from 'react';
import { flowText, extractFlavorTags } from '../lib/text';
import RadarChart from './RadarChart';

function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-3" style={{ borderBottom: '0.5px solid #E0DCD6' }}>
      <span className="text-[11px] tracking-[0.1em]" style={{ color: '#9a9080' }}>{label}</span>
      <span className="text-[13px] text-right ml-6" style={{ color: '#2C1917' }}>{value}</span>
    </div>
  );
}

export default function ProfileSection({ bean, farm, process }) {
  const [open, setOpen] = useState(false);
  const tags = extractFlavorTags(bean.taste_ja);

  return (
    <section className="max-w-2xl mx-auto px-6 pb-20">
      <p className="text-[10px] tracking-[0.28em] mb-4" style={{ color: '#9a9080' }}>TASTE — フレーバーノート</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-serif-jp"
              style={{
                fontSize: '13px',
                color: '#F8F6F2',
                background: '#443A35',
                borderRadius: '20px',
                padding: '6px 16px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <RadarChart bean={bean} />

      {bean.taste_ja && (
        <p className="text-[14px] leading-[1.95] mb-10 mt-8" style={{ color: '#4a4038' }}>
          {flowText(bean.taste_ja)}
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 cursor-pointer"
        style={{ borderTop: '0.5px solid #D0C8BE', borderBottom: open ? 'none' : '0.5px solid #D0C8BE' }}
      >
        <span className="text-[11px] tracking-[0.2em]" style={{ color: '#5a4838' }}>詳細プロファイル</span>
        <span className="text-[11px]" style={{ color: '#9a9080' }}>{open ? '閉じる ▲' : 'もっと見る ▼'}</span>
      </button>

      {open && (
        <div className="pt-1 pb-2">
          <SpecRow label="産地" value={farm?.country_name} />
          <SpecRow label="地域・農園" value={farm?.location ?? farm?.name} />
          <SpecRow label="生産者" value={bean.producer} />
          <SpecRow label="品種" value={flowText(bean.variety)} />
          <SpecRow label="標高" value={bean.altitude} />
          <SpecRow label="精製方法" value={process?.name} />
        </div>
      )}
    </section>
  );
}
