import { useEffect, useState } from 'react';
import { fetchReleasedBeans } from '../lib/data';
import WorldMap from '../components/WorldMap';
import BeanCard from '../components/BeanCard';

export default function Home() {
  const [beans, setBeans] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReleasedBeans().then(setBeans).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="min-h-screen font-sans-jp" style={{ backgroundColor: '#FAFAF8' }}>
      <header className="text-center px-6 pt-14 pb-8">
        <p className="font-display font-light tracking-[0.14em]" style={{ fontSize: '22px', color: '#1A181A' }}>
          ABOUT US COFFEE
        </p>
        <p className="text-[11px] tracking-[0.18em] mt-3" style={{ color: '#9a9080' }}>
          世界地図で、いま飲めるコーヒーを巡る
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        {error && <p className="text-center text-sm text-stone-400 py-10">{error}</p>}
        {!error && !beans && <div style={{ aspectRatio: '1000 / 320' }} className="animate-pulse bg-stone-100 rounded-lg" />}
        {beans && <WorldMap beans={beans} />}
      </div>

      {beans && beans.length > 0 && (
        <div className="mt-10 pb-20">
          <p className="text-[10px] tracking-[0.22em] px-6 mb-4" style={{ color: '#9a9080' }}>
            NOW RELEASING — いま飲める{beans.length}銘柄
          </p>
          <div className="flex gap-4 overflow-x-auto px-6 pb-2" style={{ scrollbarWidth: 'none' }}>
            {beans.map(({ bean, country }, i) => (
              <BeanCard key={bean.id} bean={bean} country={country} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
