import { flowText } from '../lib/text';
import { stripWiki } from '../lib/wikitext';
import { buildStoryBlocks, termParagraphs } from '../lib/storyBlocks';
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

// 小見出し + 本文。見出しは明朝、本文は地の文と同じ組み
function SubSection({ tag, title, paragraphs }) {
  return (
    <Reveal>
      <div className="mt-12">
        {tag && <p className="text-[10px] tracking-[0.24em] mb-2" style={{ color: '#9a7a4a' }}>{tag}</p>}
        <h4 className="font-serif-jp text-[20px] leading-snug mb-3" style={{ color: '#1A181A', fontWeight: 400, margin: 0 }}>
          {title}
        </h4>
        <div className="space-y-4 mt-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-[2.05]" style={{ color: '#4a4038' }}>{p}</p>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function FarmDetails({ farm }) {
  const areas = farm?.areas ?? [];
  return (
    <>
      {areas.map((a) => (
        <SubSection key={a.name} title={a.name} paragraphs={[flowText(a.description)]} />
      ))}
      {farm?.awards && (
        <Reveal>
          <p
            className="font-serif-jp text-[16px] leading-[1.9] whitespace-pre-line mt-12 pt-4"
            style={{ color: '#6b5a45', borderTop: '1px solid #D9B77E', margin: 0 }}
          >
            {stripWiki(farm.awards)}
          </p>
        </Reveal>
      )}
    </>
  );
}

function LotDetails({ varietyTerms, process, processTerm }) {
  const processInfo = process?.body ? process : processTerm;
  return (
    <>
      {varietyTerms.map((t) => (
        <SubSection key={t.slug} tag="VARIETY" title={`品種　${t.name}`} paragraphs={termParagraphs(t.body)} />
      ))}
      {processInfo?.body && (
        <SubSection tag="PROCESS" title={`精製方法　${processInfo.name}`} paragraphs={termParagraphs(processInfo.body)} />
      )}
    </>
  );
}

export default function StorySection({ bean, farm, images = [], varietyTerms = [], process, processTerm }) {
  const blocks = buildStoryBlocks(bean, farm);

  const extras = {
    farm: <FarmDetails farm={farm} />,
    lot: <LotDetails varietyTerms={varietyTerms} process={process} processTerm={processTerm} />,
  };

  return (
    <section id="story" className="tight max-w-3xl mx-auto px-6 pt-16 pb-10">
      <h2 className="font-serif-jp text-2xl mb-8" style={{ color: '#1A181A' }}>{farm?.name}</h2>
      <ProfileBand bean={bean} farm={farm} />

      <div className="space-y-16">
        {blocks.map((block, i) => {
          const photo = images[i];
          const [first, ...rest] = block.paragraphs;
          const hasLead = block.key !== 'taste';
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
                    {hasLead ? (
                      <p className="font-serif-jp text-[18px] leading-[1.95]" style={{ color: '#2c1917', fontWeight: 300, margin: 0 }}>
                        {first}
                      </p>
                    ) : (
                      <p className="text-[15px] leading-[2.05]" style={{ color: '#4a4038' }}>{first}</p>
                    )}
                    <div className="space-y-4 mt-5">
                      {rest.map((p, j) => (
                        <p key={j} className="text-[15px] leading-[2.05]" style={{ color: '#4a4038' }}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
              <div className="max-w-[600px] mx-auto">{extras[block.key]}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
