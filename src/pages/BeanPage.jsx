import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBeanStory } from '../lib/data';
import { heroImageFor, galleryImagesFor, firstGalleryIsSealCard } from '../lib/curatedImages';
import { buildStoryBlocks } from '../lib/storyBlocks';
import Hero from '../components/Hero';
import StorySection from '../components/StorySection';
import OriginSection from '../components/OriginSection';
import ProfileSection from '../components/ProfileSection';
import CtaSection from '../components/CtaSection';
import Reveal from '../components/Reveal';
import Recommended from '../components/Recommended';
import SiteFooter from '../components/SiteFooter';
import StickyBuyBar from '../components/StickyBuyBar';

export default function BeanPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStory(null);
    setError(null);

    // 一時的な通信エラーや更新中のタイミングで空振りすることがあるため、1回だけ自動で再試行する
    const load = (retry) =>
      fetchBeanStory(id)
        .then((s) => { if (!cancelled) setStory(s); })
        .catch((e) => {
          if (cancelled) return;
          if (retry && e.message !== 'NOT_FOUND') setTimeout(() => load(false), 900);
          else setError(e.message);
        });
    load(true);
    return () => { cancelled = true; };
  }, [id, attempt]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center text-sm" style={{ color: '#5a5248' }}>
        <p>{error === 'NOT_FOUND' ? 'この豆のページは見つかりませんでした。' : 'ページを読み込めませんでした。'}</p>
        <div className="flex gap-3">
          {error !== 'NOT_FOUND' && (
            <button type="button" onClick={() => setAttempt((n) => n + 1)} className="px-5 py-2 text-[12px] tracking-[0.1em]" style={{ border: '1px solid #1A181A', color: '#1A181A' }}>
              もう一度読み込む
            </button>
          )}
          <Link to="/" className="px-5 py-2 text-[12px] tracking-[0.1em]" style={{ border: '1px solid #D0C8BE', color: '#5a5248' }}>
            世界地図へ戻る
          </Link>
        </div>
      </div>
    );
  }

  if (!story) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-stone-400">Loading...</div>;
  }

  const { bean, farm, country, process, varietyTerms, processTerm } = story;

  // 写真は 左→右→左… と交互に並ぶ。産地マップは、直前の写真と反対側に置く
  const galleryImages = galleryImagesFor(bean);
  const photoCount = Math.min(galleryImages.length, buildStoryBlocks(bean, farm).length);
  const lastPhotoOnLeft = photoCount > 0 && (photoCount - 1) % 2 === 0;

  return (
    <div className="font-sans-jp" style={{ backgroundColor: '#FAFAF8' }}>
      <Link
        to="/"
        className="fixed top-5 left-5 z-10 text-[10px] tracking-[0.2em] px-3 py-2"
        style={{ color: 'rgba(248,246,242,0.85)', background: 'rgba(26,24,26,0.35)', backdropFilter: 'blur(4px)' }}
      >
        ← 世界地図へ
      </Link>
      <Hero bean={bean} farm={farm} country={country} heroImage={heroImageFor(bean)} />
      <StorySection bean={bean} farm={farm} images={galleryImages} chartCropFirst={firstGalleryIsSealCard(bean)} varietyTerms={varietyTerms} process={process} processTerm={processTerm} />
      <Reveal><OriginSection bean={bean} farm={farm} country={country} mapOnRight={lastPhotoOnLeft} /></Reveal>
      <Reveal><ProfileSection bean={bean} farm={farm} process={process} /></Reveal>
      <Reveal><CtaSection bean={bean} /></Reveal>
      <Recommended bean={bean} country={country} />
      <SiteFooter />
      <StickyBuyBar bean={bean} />
    </div>
  );
}
