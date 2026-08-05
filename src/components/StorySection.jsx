import { flowText } from '../lib/text';

export default function StorySection({ farm }) {
  return (
    <section id="story" className="max-w-2xl mx-auto px-6 pt-24 pb-16">
      <p className="text-[10px] tracking-[0.28em] mb-4" style={{ color: '#9a9080' }}>THE FARM — 農園のストーリー</p>
      <h2 className="font-serif-jp text-2xl mb-8" style={{ color: '#1A181A' }}>{farm?.name}</h2>

      {farm?.overview && (
        <p className="text-[15px] leading-[2] mb-12" style={{ color: '#4a4038' }}>
          {flowText(farm.overview)}
        </p>
      )}

      {farm?.areas?.length > 0 && (
        <div className="space-y-8">
          {farm.areas.map((a) => (
            <div key={a.name} className="pl-5" style={{ borderLeft: '2px solid #D0C8BE' }}>
              <div className="text-[10px] tracking-[0.18em] mb-2 uppercase" style={{ color: '#9a9080' }}>{a.name}</div>
              <p className="text-[13px] leading-[1.9]" style={{ color: '#5a5248' }}>{flowText(a.description)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
