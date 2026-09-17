import { flowText } from '../lib/text';

export default function StorySection({ farm, images = [] }) {
  const photos = images.slice(0, 2);

  return (
    <section id="story" className="max-w-2xl mx-auto px-6 pt-24 pb-16">
      <p className="text-[10px] tracking-[0.28em] mb-4" style={{ color: '#9a9080' }}>THE FARM — 農園のストーリー</p>
      <h2 className="font-serif-jp text-2xl mb-8" style={{ color: '#1A181A' }}>{farm?.name}</h2>

      <div className={photos.length > 0 ? 'flex flex-col md:flex-row gap-8 mb-12' : ''}>
        {photos.length > 0 && (
          <div className="flex flex-row md:flex-col gap-3 flex-shrink-0" style={{ width: '100%', maxWidth: '260px' }}>
            {photos.map((url) => (
              <div key={url} className="flex-1 md:flex-none rounded-lg overflow-hidden" style={{ background: '#F0EDE7' }}>
                <img src={url} alt="" className="w-full h-auto block" style={{ objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        )}

        {farm?.overview && (
          <p className="text-[15px] leading-[2]" style={{ color: '#4a4038', margin: 0 }}>
            {flowText(farm.overview)}
          </p>
        )}
      </div>

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
