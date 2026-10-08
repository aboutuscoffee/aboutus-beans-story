import { flowText } from '../lib/text';
import { buildStoryBlocks } from '../lib/storyBlocks';
import Reveal from './Reveal';
import Accordion from './Accordion';

export default function StorySection({ bean, farm, images = [] }) {
  const blocks = buildStoryBlocks(bean, farm);

  return (
    <section id="story" className="max-w-3xl mx-auto px-6 pt-24 pb-16">
      <h2 className="font-serif-jp text-2xl mb-14" style={{ color: '#1A181A' }}>{farm?.name}</h2>

      <div className="space-y-16">
        {blocks.map((block, i) => {
          const photo = images[i];
          return (
            <Reveal key={block.key}>
              <div
                className={`flex flex-col gap-6 md:gap-10 md:items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                {photo && (
                  <div className="md:w-5/12 flex-shrink-0 rounded-lg overflow-hidden" style={{ background: '#F0EDE7' }}>
                    <img src={photo} alt="" className="w-full h-auto block" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[10px] tracking-[0.28em] mb-4" style={{ color: '#9a9080' }}>{block.eyebrow}</p>
                  <div className="space-y-5">
                    {block.paragraphs.map((p, j) => (
                      <p key={j} className="text-[15px] leading-[2]" style={{ color: '#4a4038', margin: 0 }}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {farm?.areas?.length > 0 && (
        <div className="mt-16" style={{ borderBottom: '0.5px solid #D0C8BE' }}>
          <Accordion title="農園・区画の詳細">
            <div className="space-y-6">
              {farm.areas.map((a) => (
                <div key={a.name} className="pl-5" style={{ borderLeft: '2px solid #D0C8BE' }}>
                  <div className="text-[10px] tracking-[0.18em] mb-2 uppercase" style={{ color: '#9a9080' }}>{a.name}</div>
                  <p className="text-[13px] leading-[1.9]" style={{ color: '#5a5248' }}>{flowText(a.description)}</p>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      )}
    </section>
  );
}
