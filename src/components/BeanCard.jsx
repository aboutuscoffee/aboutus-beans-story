import { Link } from 'react-router-dom';
import { heroImageFor } from '../lib/curatedImages';

// 画像未準備の豆でも破綻しないよう、豆IDから決定的にグラデーションを選ぶプレースホルダー
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #443A35, #6b5a4a)',
  'linear-gradient(135deg, #2f3b34, #52685a)',
  'linear-gradient(135deg, #3a2f38, #6a4f5e)',
  'linear-gradient(135deg, #35302a, #5e5245)',
];

function placeholderFor(id) {
  const idx = String(id).split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % PLACEHOLDER_GRADIENTS.length;
  return PLACEHOLDER_GRADIENTS[idx];
}

export default function BeanCard({ bean, country, index = 0 }) {
  const image = heroImageFor(bean);

  return (
    <Link
      to={`/beans/${bean.id}`}
      className="group reveal flex-shrink-0 block"
      style={{ width: '168px', animationDelay: `${Math.min(index, 8) * 0.06}s` }}
    >
      <div
        className="w-full overflow-hidden rounded-lg relative"
        style={{ aspectRatio: '3 / 4', boxShadow: '0 6px 20px rgba(26,24,26,0.10)' }}
      >
        <div
          className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ background: image ? `url(${image}) center/cover` : placeholderFor(bean.id) }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(26,24,26,0) 55%, rgba(26,24,26,0.32) 100%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(26,24,26,0.08)' }}
        />
      </div>
      <div className="pt-3">
        <p className="text-[10px] tracking-[0.1em]" style={{ color: '#9a9080' }}>
          {country?.flag} {country?.name}
        </p>
        <p className="font-serif-jp text-[13px] leading-snug mt-1" style={{ color: '#1A181A' }}>
          {bean.name}
        </p>
      </div>
    </Link>
  );
}
