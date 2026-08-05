// bean-images には印刷用シールカード（ロゴのみ）と実写ライフスタイル写真が混在しているため、
// 表示に適した実写を明示的に選ぶための一時的なオーバーライド。
// TODO: 全銘柄展開時は内部管理アプリ側に「掲載用メイン画像」を選べるフィールドを追加し、ここは廃止する
export const CURATED_IMAGES = {
  18: {
    hero: 'https://wejzwflqswvqepvhruic.supabase.co/storage/v1/object/public/bean-images/18-1784537705265.jpeg',
    gallery: ['https://wejzwflqswvqepvhruic.supabase.co/storage/v1/object/public/bean-images/18-1784537687681.jpeg'],
  },
};

export function heroImageFor(bean) {
  return CURATED_IMAGES[bean.id]?.hero ?? bean.image_urls?.[0] ?? null;
}

export function galleryImagesFor(bean) {
  return CURATED_IMAGES[bean.id]?.gallery ?? bean.image_urls?.slice(1) ?? [];
}
