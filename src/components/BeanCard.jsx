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

export default function BeanCard({ bean, country }) {
  const image = heroImageFor(bean);

  return (
    <Link
      to={`/beans/${bean.id}`}
      className="flex-shrink-0 block overflow-hidden rounded-lg"
      style={{ width: '168px' }}
    >
      <div
        className="w-full"
        style={{
          aspectRatio: '3 / 4',
          background: image ? `url(${image}) center/cover` : placeholderFor(bean.id),
        }}
      />
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
