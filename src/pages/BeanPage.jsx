import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBeanStory } from '../lib/data';
import { heroImageFor, galleryImagesFor } from '../lib/curatedImages';
import Hero from '../components/Hero';
import StorySection from '../components/StorySection';
import OriginSection from '../components/OriginSection';
import Gallery from '../components/Gallery';
import ProfileSection from '../components/ProfileSection';
import CtaSection from '../components/CtaSection';
import Reveal from '../components/Reveal';
import StickyBuyBar from '../components/StickyBuyBar';

export default function BeanPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStory(null);
    fetchBeanStory(id).then(setStory).catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-stone-500">{error}</div>;
  }

  if (!story) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-stone-400">Loading...</div>;
  }

  const { bean, farm, country, process } = story;

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
      <Reveal><StorySection farm={farm} /></Reveal>
      <Reveal><OriginSection bean={bean} farm={farm} country={country} /></Reveal>
      <Reveal><Gallery images={galleryImagesFor(bean)} /></Reveal>
      <Reveal><ProfileSection bean={bean} farm={farm} process={process} /></Reveal>
      <Reveal><CtaSection bean={bean} /></Reveal>
      <StickyBuyBar bean={bean} />
    </div>
  );
}
