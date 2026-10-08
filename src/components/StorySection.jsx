import { flowText } from '../lib/text';
import { stripWiki } from '../lib/wikitext';
import { buildStoryBlocks, termParagraphs } from '../lib/storyBlocks';
import Reveal from './Reveal';

function Eyebrow({ children }) {
  return <p className="text-[10px] tracking-[0.28em] mb-4" style={{ color: '#9a9080' }}>{children}</p>;
}

// 豆の region 欄（「地域 / [[農園]] / 区画」）から、農園リンクと区画名を除いた地域名を取り出す
function regionFor(bean, farm) {
  const parts = (bean.region || '')
    .split('/')
    .map((x) => x.trim())
    .filter((x) => x && !x.includes('[[') && !/区画/.test(x));
  return parts[0] || farm?.location || null;
}

// シールカードの Producer / Region … と同じ書き方で、農園ブロックの前に簡潔なスペック表を置く（値が無い項目は出さない）
function SpecList({ bean, farm }) {
  const items = [
    ['Producer', bean.producer],
    ['Region', regionFor(bean, farm)],
    ['Altitude', bean.altitude],
    ['Variety', flowText(bean.variety)],
    ['Process', flowText(bean.process)],
  ].filter(([, v]) => v);
  if (items.length === 0) return null;

  return (
    <dl className="mb-10 max-w-[440px]" style={{ margin: '0 0 2.5rem' }}>
      {items.map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-2 py-[3px]">
          <dt className="text-[11px] tracking-[0.08em] flex-shrink-0" style={{ color: '#1A181A', width: '5.2em' }}>{label}</dt>
          <span className="flex-1 min-w-3" style={{ borderBottom: '1px dotted #bdb3a2', transform: 'translateY(-3px)' }} />
          <dd className="text-[12.5px] text-right" style={{ color: '#1A181A', margin: 0 }}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// シールカード画像のうち、右下のレーダーチャート部分だけを切り出して見せる
function ChartCrop({ url }) {
  return (
    <div
      role="img"
      aria-label="フレーバーのレーダーチャート"
      className="w-full"
      style={{
        aspectRatio: '1.157 / 1',
        backgroundImage: `url(${url})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '204% auto',
        backgroundPosition: '70.6% 78.4%',
      }}
    />
  );
}

// 小見出し + 本文。見出しは明朝、本文は地の文と同じ組み
function SubSection({ tag, title, paragraphs }) {
  return (
    <Reveal>
      <div className="mt-9">
        {tag && <p className="text-[10px] tracking-[0.24em] mb-2" style={{ color: '#9a7a4a' }}>{tag}</p>}
        <h4 className="font-serif-jp text-[17px] leading-snug mb-2" style={{ color: '#1A181A', fontWeight: 400, margin: 0 }}>
          {title}
        </h4>
        <div className="space-y-3 mt-2">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[13.5px] leading-[1.95]" style={{ color: '#4a4038' }}>{p}</p>
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
            className="font-serif-jp text-[14px] leading-[1.9] whitespace-pre-line mt-9 pt-3"
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

export default function StorySection({ bean, farm, images = [], chartCropFirst = false, varietyTerms = [], process, processTerm }) {
  const blocks = buildStoryBlocks(bean, farm);

  const extras = {
    farm: <FarmDetails farm={farm} />,
    lot: <LotDetails varietyTerms={varietyTerms} process={process} processTerm={processTerm} />,
  };

  return (
    <section id="story" className="tight max-w-3xl mx-auto px-6 pt-12 pb-8">
      <h2 className="font-serif-jp text-xl mb-5" style={{ color: '#1A181A' }}>{farm?.name}</h2>
      <SpecList bean={bean} farm={farm} />

      <div className="space-y-12">
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
                      {i === 0 && chartCropFirst
                        ? <ChartCrop url={photo} />
                        : <img src={photo} alt="" className="w-full h-auto block" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <Eyebrow>{block.eyebrow}</Eyebrow>
                    {hasLead ? (
                      <p className="font-serif-jp text-[16px] leading-[1.9]" style={{ color: '#2c1917', fontWeight: 300, margin: 0 }}>
                        {first}
                      </p>
                    ) : (
                      <p className="text-[13.5px] leading-[1.95]" style={{ color: '#4a4038' }}>{first}</p>
                    )}
                    <div className="space-y-3 mt-4">
                      {rest.map((p, j) => (
                        <p key={j} className="text-[13.5px] leading-[1.95]" style={{ color: '#4a4038' }}>{p}</p>
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
