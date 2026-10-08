import { flowText } from '../lib/text';
import { stripWiki } from '../lib/wikitext';
import { buildStoryBlocks } from '../lib/storyBlocks';
import Reveal from './Reveal';

function Eyebrow({ children }) {
  return <p className="text-[10px] tracking-[0.28em] mb-4" style={{ color: '#9a9080' }}>{children}</p>;
}

// 農園プロフィール帯: 生産者・標高・所在地・品種を並べる（値が無い項目は出さない）
function ProfileBand({ bean, farm }) {
  const items = [
    ['生産者', bean.producer],
    ['標高', bean.altitude],
    ['所在地', farm?.location],
    ['品種', flowText(bean.variety)],
  ].filter(([, v]) => v);
  if (items.length === 0) return null;

  return (
    <dl
      className="grid grid-cols-2 md:grid-cols-4 gap-y-6 mb-12 py-6"
      style={{ borderTop: '0.5px solid #D0C8BE', borderBottom: '0.5px solid #D0C8BE' }}
    >
      {items.map(([label, value], i) => (
        <div key={label} className="px-4" style={{ borderLeft: i % 2 === 0 ? 'none' : '0.5px solid #E0DCD6' }}>
          <dt className="text-[10px] tracking-[0.22em] mb-2" style={{ color: '#9a9080' }}>{label}</dt>
          <dd className="font-serif-jp text-[14px] leading-snug" style={{ color: '#2C1917', margin: 0 }}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Awards({ farm }) {
  if (!farm?.awards) return null;
  return (
    <Reveal>
      <div className="mt-10">
        <Eyebrow>AWARDS — 主な実績</Eyebrow>
        <p
          className="font-serif-jp text-[15px] leading-[2] whitespace-pre-line pl-5"
          style={{ color: '#4a4038', margin: 0, borderLeft: '2px solid #D9B77E' }}
        >
          {stripWiki(farm.awards)}
        </p>
      </div>
    </Reveal>
  );
}

function AreaCards({ farm }) {
  if (!farm?.areas?.length) return null;
  return (
    <Reveal>
      <div className="mt-10">
        <Eyebrow>ABOUT THE FARM — 農園のこと</Eyebrow>
        <div className="grid gap-4 md:grid-cols-2">
          {farm.areas.map((a) => (
            <div key={a.name} className="rounded-lg p-5" style={{ background: '#F3F0E9' }}>
              <p className="font-serif-jp text-[14px] mb-2" style={{ color: '#2C1917', margin: 0 }}>{a.name}</p>
              <p className="text-[13px] leading-[1.9] mt-2" style={{ color: '#5a5248', margin: 0 }}>{flowText(a.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function LotDetails({ varietyTerms, process, processTerm }) {
  const cards = [
    ...varietyTerms.map((t) => ({ key: `v-${t.slug}`, eyebrow: 'VARIETY — 品種', name: t.name, body: t.body })),
    ...(process?.body
      ? [{ key: 'process', eyebrow: 'PROCESS — 精製方法', name: process.name, body: process.body }]
      : processTerm
        ? [{ key: 'process', eyebrow: 'PROCESS — 精製方法', name: processTerm.name, body: processTerm.body }]
        : []),
  ];
  if (cards.length === 0) return null;
  return (
    <Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.key} className="rounded-lg p-5" style={{ background: '#F3F0E9' }}>
            <p className="text-[10px] tracking-[0.22em]" style={{ color: '#9a9080', margin: 0 }}>{c.eyebrow}</p>
            <p className="font-display text-[22px] mt-2" style={{ color: '#2C1917', margin: 0 }}>{c.name}</p>
            <p className="text-[13px] leading-[1.9] whitespace-pre-line mt-3" style={{ color: '#5a5248', margin: 0 }}>
              {stripWiki(c.body)}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default function StorySection({ bean, farm, images = [], varietyTerms = [], process, processTerm }) {
  const blocks = buildStoryBlocks(bean, farm);

  const extras = {
    farm: (
      <>
        <Awards farm={farm} />
        <AreaCards farm={farm} />
      </>
    ),
    lot: <LotDetails varietyTerms={varietyTerms} process={process} processTerm={processTerm} />,
  };

  return (
    <section id="story" className="max-w-3xl mx-auto px-6 pt-16 pb-10">
      <h2 className="font-serif-jp text-2xl mb-8" style={{ color: '#1A181A' }}>{farm?.name}</h2>
      <ProfileBand bean={bean} farm={farm} />

      <div className="space-y-12">
        {blocks.map((block, i) => {
          const photo = images[i];
          return (
            <div key={block.key}>
              <Reveal>
                <div
                  className={`flex flex-col gap-6 md:gap-10 md:items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                >
                  {photo && (
                    <div className="md:w-5/12 flex-shrink-0 rounded-lg overflow-hidden" style={{ background: '#F0EDE7' }}>
                      <img src={photo} alt="" className="w-full h-auto block" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Eyebrow>{block.eyebrow}</Eyebrow>
                    <div className="space-y-5">
                      {block.paragraphs.map((p, j) => (
                        <p key={j} className="text-[15px] leading-[2]" style={{ color: '#4a4038', margin: 0 }}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
              {extras[block.key]}
            </div>
          );
        })}
      </div>
    </section>
  );
}
