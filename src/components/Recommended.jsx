import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchReleasedBeans } from '../lib/data';
import { chartImageFor, heroImageFor } from '../lib/curatedImages';
import { sampleChartColor, colorDistance } from '../lib/chartColor';
import ChartCrop from './ChartCrop';
import Reveal from './Reveal';

const COUNT = 4;
const MAX_SAME_COUNTRY = 2;

// 同じ国の豆を最大2つ、残りは「チャートの色が近い」豆で埋める
function pickRecommendations(current, currentColor, pool, colors) {
  const dist = (item) => colorDistance(currentColor, colors[item.bean.id]);
  const byColor = (a, b) => dist(a) - dist(b);

  const others = pool.filter((p) => String(p.bean.id) !== String(current.id));
  const sameCountry = others.filter((p) => p.country?.slug && p.country.slug === current.countrySlug).sort(byColor);
  const different = others.filter((p) => !sameCountry.includes(p)).sort(byColor);

  const picks = [...sameCountry.slice(0, MAX_SAME_COUNTRY), ...different];
  for (const p of sameCountry.slice(MAX_SAME_COUNTRY)) if (picks.length < COUNT) picks.push(p);
  return picks.slice(0, COUNT);
}

function Card({ item }) {
  const chart = chartImageFor(item.bean);
  const hero = heroImageFor(item.bean);
  return (
    <Link to={`/beans/${item.bean.id}`} className="block group">
      <div className="rounded-lg overflow-hidden" style={{ background: '#E6E1D6' }}>
        {chart ? (
          <ChartCrop url={chart} />
        ) : (
          <div style={{ aspectRatio: '1.217 / 1', background: hero ? `url(${hero}) center/cover` : '#D9D2C4' }} />
        )}
      </div>
      <p className="text-[10px] tracking-[0.1em] mt-3" style={{ color: '#9a9080', margin: '12px 0 0' }}>
        {item.country?.flag} {item.country?.name}
      </p>
      <p className="font-serif-jp text-[13px] leading-snug mt-1 group-hover:underline" style={{ color: '#1A181A', margin: '4px 0 0' }}>
        {item.bean.name.trim()}
      </p>
    </Link>
  );
}

export default function Recommended({ bean, country }) {
  const [pool, setPool] = useState([]);
  const [colors, setColors] = useState({});
  const [currentColor, setCurrentColor] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setPool([]); setColors({}); setCurrentColor(null);

    fetchReleasedBeans().then((items) => {
      if (cancelled) return;
      setPool(items);
      items.forEach((it) => {
        sampleChartColor(chartImageFor(it.bean)).then((c) => {
          if (!cancelled && c) setColors((prev) => ({ ...prev, [it.bean.id]: c }));
        });
      });
    }).catch(() => {});

    sampleChartColor(chartImageFor(bean)).then((c) => { if (!cancelled) setCurrentColor(c); });
    return () => { cancelled = true; };
  }, [bean.id]);

  const picks = useMemo(
    () => pickRecommendations({ id: bean.id, countrySlug: country?.slug }, currentColor, pool, colors),
    [bean.id, country?.slug, currentColor, pool, colors]
  );

  if (picks.length === 0) return null;

  return (
    <Reveal>
      <section className="tight max-w-3xl mx-auto px-6 pt-4 pb-12">
        <p className="text-[10px] tracking-[0.28em] mb-5" style={{ color: '#9a9080' }}>YOU MAY ALSO LIKE — 似た国・似た色の豆</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {picks.map((item) => <Card key={item.bean.id} item={item} />)}
        </div>
      </section>
    </Reveal>
  );
}
