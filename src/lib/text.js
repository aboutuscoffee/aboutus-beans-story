import { stripWiki } from './wikitext';

// DBの本文は固定幅テキストエリアからの流し込みで、文中に強制改行(\n)が入っている
// （段落区切りではなく単なる折り返し）ため、地の文として読ませる時は詰めて1段落にする。
// ただし \n\n（空行）は書き手が意図した本当の段落区切りなので、繋げず区切りとして残す。
export function flowText(text) {
  if (!text) return '';
  return stripWiki(text).replace(/\n{2,}/g, '　').replace(/\n/g, '');
}

// taste_ja の「フレーバーは、〜を感じていただけると思います / お楽しみいただけます」からフレーバー語を抽出してタグ化する
export function extractFlavorTags(tasteText) {
  if (!tasteText) return [];
  const joined = flowText(tasteText);
  const match = joined.match(/フレーバー[^、]*、(.+?)を(?:感じ|思わせる|お楽しみいただけ)/);
  if (!match) return [];
  return match[1]
    .split(/[、,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
