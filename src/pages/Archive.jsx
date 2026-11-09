import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchArchivedBeans } from '../lib/data';
import { LangToggle, useLang } from '../lib/lang';
import { COUNTRY_GEO } from '../lib/countryGeo';
import { cardThumbFor } from '../lib/curatedImages';
import Ripple from '../components/Ripple';

// 終売した豆の一覧。カード画像だけを並べて、物語のページへ入れる
export default function Archive() {
  const { lang, tr } = useLang();
  const [beans, setBeans] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArchivedBeans().then(setBeans).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="min-h-screen font-sans-jp" style={{ backgroundColor: '#f3f0e8' }}>
      <div className="max-w-xl mx-auto px-4 pb-20 relative">
        <LangToggle className="absolute right-4 top-4" />
        <Link to="/" className="inline-block pt-5 text-[11px] tracking-[0.16em]" style={{ color: '#6b5a45' }}>
          {tr('← 世界地図へ', '← World map')}
        </Link>
        <header className="text-center pt-6 pb-8">
          <p className="font-display font-light tracking-[0.14em]" style={{ fontSize: '20px' }}>Past coffees</p>
          <p className="text-[10px] tracking-[0.16em] mt-2" style={{ color: '#9a9080' }}>
            {tr('これまでにお届けした豆たち', 'Coffees we have served before')}
          </p>
        </header>

        {error && <p className="text-center text-sm text-stone-400 py-10">{error}</p>}
        {!error && !beans && <Ripple label="Loading" className="py-20" />}
        {beans && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {beans.map(({ bean, country }) => (
              <Link key={bean.id} to={`/beans/${bean.id}`} className="block">
                {cardThumbFor(bean) && (
                  <img
                    src={cardThumbFor(bean)}
                    alt=""
                    loading="lazy"
                    className="block w-full rounded-[10px] object-cover"
                    style={{ aspectRatio: '164 / 228', background: '#e6e1d6', boxShadow: '0 6px 18px rgba(26,24,26,.14)' }}
                  />
                )}
                <p className="mt-2 text-[10px] tracking-[0.12em]" style={{ color: '#9a9080' }}>
                  {lang === 'en' ? COUNTRY_GEO[country?.slug]?.atlasName ?? country?.name : country?.name}
                </p>
                <p className="font-serif-jp text-[13px] leading-snug mt-0.5">{bean.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
