import { stripWiki } from './wikitext';

// DBの本文は固定幅テキストエリアからの流し込みで、文中に強制改行(\n)が入っている
// （段落区切りではなく単なる折り返し）ため、地の文として読ませる時は詰めて1段落にする
export function flowText(text) {
  if (!text) return '';
  return stripWiki(text).replace(/\n+/g, '');
}

// taste_ja の「フレーバーは、〜を感じていただけると思います」からフレーバー語を抽出してタグ化する
export function extractFlavorTags(tasteText) {
  if (!tasteText) return [];
  const joined = flowText(tasteText);
  const match = joined.match(/フレーバー[^、]*、(.+?)を(?:感じ|思わせる)/);
  if (!match) return [];
  return match[1]
    .split(/[、,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
