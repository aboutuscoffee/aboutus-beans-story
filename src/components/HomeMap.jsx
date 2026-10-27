import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWorldLand, geometryToPath } from '../lib/worldGeo';
import { COUNTRY_GEO } from '../lib/countryGeo';
import { extractFlavorTags, formatAltitude } from '../lib/text';

// 等長方形図法（経度・緯度をそのままviewBox座標へ）
const px = (lng) => (lng + 100) * 4;
const py = (lat) => (55 - lat) * 4;
const projectFn = (lng, lat) => ({ x: px(lng), y: py(lat) });

const W0 = 372;
const MAPH = 262;
const RATIO = MAPH / W0;
const WORLD_VB = { x: 20, y: 56, w: 640 };

const cardImage = (bean) => bean.image_urls?.[0] ?? null;

function mainlandBBox(geometry) {
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  const ring = polys.map((p) => p[0]).reduce((a, b) => (b.length > a.length ? b : a));
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [lng, lat] of ring) {
    x0 = Math.min(x0, px(lng)); x1 = Math.max(x1, px(lng));
    y0 = Math.min(y0, py(lat)); y1 = Math.max(y1, py(lat));
  }
  return [x0, y0, x1, y1];
}

function groupByCountry(beans) {
  const map = {};
  beans.forEach((b) => {
    const slug = b.country?.slug ?? 'other';
    const geo = COUNTRY_GEO[slug];
    const lat = b.lat ?? geo?.fallbackLat ?? geo?.capitalLat ?? null;
    const lng = b.lng ?? geo?.fallbackLng ?? geo?.capitalLng ?? null;
    if (lat == null || lng == null) return;
    const item = { ...b, slug, x: px(lng), y: py(lat), tags: extractFlavorTags(b.bean.taste_ja) };
    (map[slug] ??= { slug, name: b.country?.name ?? '', en: (geo?.atlasName ?? b.country?.name ?? '').toUpperCase(), flag: b.country?.flag ?? '', list: [] }).list.push(item);
  });
  const groups = Object.values(map).map((c) => ({
    ...c,
    x: c.list.reduce((a, b) => a + b.x, 0) / c.list.length,
    y: c.list.reduce((a, b) => a + b.y, 0) / c.list.length,
  }));
  groups.sort((a, b) => a.x - b.x);
  return groups;
}

// 近接する丸を押し合って重ならないようにする
function spreadBubbles(groups, u) {
  const items = groups.map((c) => ({ c, ox: c.x, oy: c.y, x: c.x, y: c.y, r: (11 + c.list.length * 3) * u }));
  for (let it = 0; it < 80; it++) {
    for (const a of items) for (const b of items) {
      if (a === b) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01, need = a.r + b.r + 4 * u;
      if (d < need) {
        const p = (need - d) / 2;
        a.x -= (dx / d) * p; a.y -= (dy / d) * p; b.x += (dx / d) * p; b.y += (dy / d) * p;
      }
    }
  }
  return items;
}

export default function HomeMap({ beans }) {
  const groups = useMemo(() => groupByCountry(beans), [beans]);
  const bySlug = useMemo(() => Object.fromEntries(groups.map((c) => [c.slug, c])), [groups]);
  const ordered = useMemo(() => groups.flatMap((c) => c.list), [groups]);

  const [world, setWorld] = useState(null); // { all: path, countries: { slug: { d, bbox } } }
  const [vb, setVb] = useState(WORLD_VB);
  const [mode, setMode] = useState('world');
  const [curSlug, setCurSlug] = useState(null);
  const [selId, setSelId] = useState(null);
  const [centerSlug, setCenterSlug] = useState(null);
  const vbRef = useRef(WORLD_VB);
  const animRef = useRef(0);
  const stripRef = useRef(null);
  const rowRefs = useRef({});

  useEffect(() => {
    fetchWorldLand()
      .then((geo) => {
        const countries = {};
        const slugByAtlas = Object.fromEntries(Object.entries(COUNTRY_GEO).map(([slug, g]) => [g.atlasName, slug]));
        geo.features.forEach((f) => {
          const slug = slugByAtlas[f.properties.name];
          if (slug) countries[slug] = { d: geometryToPath(f.geometry, projectFn), bbox: mainlandBBox(f.geometry) };
        });
        setWorld({ all: geo.features.map((f) => geometryToPath(f.geometry, projectFn)).filter(Boolean), countries });
      })
      .catch(() => setWorld({ all: [], countries: {} }));
  }, []);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  function tweenTo(to, ms = 700) {
    cancelAnimationFrame(animRef.current);
    const from = vbRef.current;
    let t0 = null;
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / ms, 1);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const next = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e };
      vbRef.current = next;
      setVb(next);
      if (p < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }

  function enterCountry(slug, id = null) {
    const c = bySlug[slug];
    const cp = world?.countries[slug];
    const b = cp ? cp.bbox : [c.x - 10, c.y - 10, c.x + 10, c.y + 10];
    const w = Math.max((b[2] - b[0]) * 1.5, ((b[3] - b[1]) * 1.5) / RATIO, 44);
    setMode('country');
    setCurSlug(slug);
    setSelId(id);
    setCenterSlug(null);
    tweenTo({ x: (b[0] + b[2]) / 2 - w / 2, y: (b[1] + b[3]) / 2 - (w * RATIO) / 2, w });
  }

  function enterWorld() {
    setMode('world');
    setCurSlug(null);
    setSelId(null);
    tweenTo(WORLD_VB);
  }

  function selectBean(id, scrollToRow) {
    setSelId(id);
    if (scrollToRow) rowRefs.current[id]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // 横スクロールの帯: 真ん中にあるカードの国の丸を強調する
  function markCenter() {
    const strip = stripRef.current;
    if (!strip) return;
    const rect = strip.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;
    let best = null, bd = Infinity;
    strip.querySelectorAll('[data-slug]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bd) { bd = d; best = el; }
    });
    if (best) setCenterSlug(best.dataset.slug);
  }

  useEffect(() => {
    if (mode === 'world') {
      const t = setTimeout(markCenter, 30);
      return () => clearTimeout(t);
    }
  }, [mode, ordered]);

  const u = vb.w / W0;
  const bubbleItems = useMemo(() => (mode === 'world' ? spreadBubbles(groups, u) : []), [mode, groups, u]);
  const cur = curSlug ? bySlug[curSlug] : null;
  const hl = curSlug ? world?.countries[curSlug] : null;

  return (
    <div>
      <div className="relative overflow-hidden" style={{ aspectRatio: `${W0} / ${MAPH}`, background: '#dfe6e3' }}>
        <svg
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.w * RATIO}`}
          preserveAspectRatio="xMidYMid slice"
          className="block w-full h-full"
        >
          <rect x="-300" y="-300" width="1800" height="1200" fill="#dfe6e3" />
          {world?.all.map((d, i) => (
            <path key={i} d={d} fill="#e8e0d5" stroke="#c9bfae" strokeWidth="0.5" />
          ))}
          {hl && <path d={hl.d} fill="#f5e4ac" stroke="#8a7a55" strokeWidth="0.7" />}

          {bubbleItems.map((p) => {
            const on = centerSlug === p.c.slug;
            const moved = Math.hypot(p.x - p.ox, p.y - p.oy) > 3 * u;
            return (
              <g
                key={p.c.slug}
                style={{ cursor: 'pointer', opacity: centerSlug && !on ? 0.45 : 1 }}
                onClick={() => enterCountry(p.c.slug)}
              >
                {moved && (
                  <>
                    <line x1={p.ox} y1={p.oy} x2={p.x} y2={p.y} stroke="#443A35" strokeWidth={1.2 * u} />
                    <circle cx={p.ox} cy={p.oy} r={2.4 * u} fill="#443A35" />
                  </>
                )}
                <circle cx={p.x} cy={p.y} r={p.r * 1.5} fill="transparent" />
                {on && <circle cx={p.x} cy={p.y} r={p.r * 1.35} fill="none" stroke="#6b5a45" strokeWidth={0.9 * u} />}
                <circle cx={p.x} cy={p.y} r={p.r * 0.85} fill="#6b5a45" opacity={on ? 0.9 : 0.72} stroke="rgba(250,249,246,.9)" strokeWidth={1.2 * u} />
                <text
                  x={p.x}
                  y={p.y + 4.5 * u}
                  textAnchor="middle"
                  fontSize={14 * u}
                  fill="#faf9f6"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
                >
                  {p.c.list.length}
                </text>
                {on && <text
                  x={Math.max(p.x, vb.x + 30 * u)}
                  y={p.y - p.r * 0.85 - 4 * u}
                  textAnchor="middle"
                  fontSize={10.5 * u}
                  fill="#4a4038"
                  stroke="rgba(250,249,246,.85)"
                  strokeWidth={2.4 * u}
                  paintOrder="stroke"
                  letterSpacing={1.2 * u}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                >
                  {p.c.en}
                </text>}
              </g>
            );
          })}

          {mode === 'country' && cur && cur.list.map((b, i) => {
            const r = 9 * u;
            const close = cur.list.some((o) => o !== b && Math.hypot(o.x - b.x, o.y - b.y) < r * 1.5);
            const a = (i / cur.list.length) * Math.PI * 2 - Math.PI / 2;
            const d = close ? r * 1.3 : 0;
            const x = b.x + Math.cos(a) * d, y = b.y + Math.sin(a) * d;
            const on = selId === b.bean.id;
            const below = close && i % 2 === 1;
            return (
              <g
                key={b.bean.id}
                style={{ cursor: 'pointer', opacity: on || !selId ? 1 : 0.55 }}
                onClick={() => selectBean(b.bean.id, true)}
              >
                <circle cx={x} cy={y} r={r * 2.2} fill="transparent" />
                {on && <circle cx={x} cy={y} r={r * 2} fill="none" stroke="#6b5a45" strokeWidth={0.9 * u} />}
                <circle cx={x} cy={y} r={r * (on ? 1.1 : 0.8)} fill="#6b5a45" opacity="0.9" stroke="rgba(250,249,246,.9)" strokeWidth={1.4 * u} />
                <text
                  x={x}
                  y={below ? y + r * 3.1 : y - r * 1.9}
                  textAnchor="middle"
                  fontSize={11 * u}
                  fill="#1a181a"
                  stroke="#fff"
                  strokeWidth={3 * u}
                  paintOrder="stroke"
                  fontWeight={on ? 600 : 500}
                >
                  {b.bean.name.slice(0, 16)}
                </text>
              </g>
            );
          })}
        </svg>

        {mode === 'country' && cur && (
          <>
            <button
              type="button"
              onClick={enterWorld}
              className="absolute left-2.5 top-2.5 rounded-full px-3.5 py-1.5 font-serif-jp text-[11px] tracking-[0.12em]"
              style={{ background: 'rgba(250,249,246,.82)', color: '#4a4038', backdropFilter: 'blur(4px)' }}
            >
              ← 世界
            </button>
            <div className="absolute right-2.5 top-2.5 rounded-full px-3 py-1.5 font-serif-jp text-[11px] tracking-[0.12em]" style={{ background: 'rgba(250,249,246,.82)', color: '#4a4038', backdropFilter: 'blur(4px)' }}>
              {cur.en}　{cur.list.length}
            </div>
          </>
        )}
      </div>

      {mode === 'world' && (
        <div className="pb-16">
          <div className="flex items-baseline justify-between px-[18px] pt-3.5 pb-1.5">
            <p className="font-serif-jp text-[15px]">いま飲める{ordered.length}銘柄</p>
            <p className="text-[11px] tracking-[0.08em]" style={{ color: '#9a9080' }}>← 横にスワイプ →</p>
          </div>
          <div
            ref={stripRef}
            onScroll={() => {
              clearTimeout(stripRef.current?._t);
              if (stripRef.current) stripRef.current._t = setTimeout(markCenter, 70);
            }}
            className="flex gap-3 overflow-x-auto px-4 pt-2 pb-4"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
          >
            {ordered.map((b) => {
              
              return (
                <button
                  key={b.bean.id}
                  type="button"
                  data-slug={b.slug}
                  onClick={() => enterCountry(b.slug, b.bean.id)}
                  className="relative flex-none p-0 border-0 bg-transparent"
                  style={{ width: 164, scrollSnapAlign: 'center' }}
                  aria-label={b.bean.name}
                >
                  {cardImage(b.bean) && (
                    <img
                      src={cardImage(b.bean)}
                      alt=""
                      loading="lazy"
                      className="block rounded-[10px] object-cover"
                      style={{ width: 164, height: 228, background: '#e6e1d6', boxShadow: '0 6px 18px rgba(26,24,26,.16)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <p className="px-[18px] text-[11px]" style={{ color: '#8a8070' }}>丸かカードをタップすると、その国へ寄ります。</p>
        </div>
      )}

      {mode === 'country' && cur && (
        <div className="pb-16">
          <div className="flex items-baseline gap-2.5 px-[18px] pt-[18px] pb-1.5">
            <p className="font-serif-jp text-[15px]">{cur.name}</p>
            <p className="text-[11px] tracking-[0.1em]" style={{ color: '#9a9080' }}>{cur.list.length}銘柄</p>
          </div>
          {cur.list.map((b) => (
            <Link
              key={b.bean.id}
              ref={(el) => { rowRefs.current[b.bean.id] = el; }}
              to={`/beans/${b.bean.id}`}
              onMouseEnter={() => setSelId(b.bean.id)}
              className="flex items-center justify-between gap-3 px-[18px] py-[13px] transition-colors"
              style={{ borderTop: '.5px solid #e6e1d6', background: selId === b.bean.id ? '#f2eee4' : 'transparent' }}
            >
              <span className="flex items-center gap-[13px] min-w-0">
                {cardImage(b.bean) && (
                  <img
                    src={cardImage(b.bean)}
                    alt=""
                    loading="lazy"
                    className="flex-none rounded-[5px] object-cover"
                    style={{ width: 48, height: 66, background: '#e6e1d6', boxShadow: '0 2px 8px rgba(26,24,26,.16)' }}
                  />
                )}
                <span className="min-w-0">
                  <span className="block font-serif-jp text-[14px] leading-[1.45]">{b.bean.name}</span>
                  <span className="block mt-[3px] text-[11px]" style={{ color: '#8a8070' }}>
                    {(b.tags.length ? b.tags : ['—']).slice(0, 3).join('・')}
                    {b.bean.altitude ? `　標高 ${formatAltitude(b.bean.altitude)}` : ''}
                  </span>
                </span>
              </span>
              <span style={{ color: '#b9ae9a', fontSize: 18 }}>›</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
