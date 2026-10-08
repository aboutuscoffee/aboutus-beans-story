import { flowText } from './text';
import { tasteFor } from './curatedTaste';

// description_ja は「農園 → ロット → 味わい」の順で書かれていることが多いため、
// 「今回/このコーヒー」などロットの話に切り替わる文を境に前後を分ける。
const LOT_MARKER = /今回|このコーヒー|このロット|このお豆/;

function toSentences(text) {
  return (text.match(/[^。！？]+[。！？]?/g) ?? []).map((s) => s.trim()).filter(Boolean);
}

function toParagraphs(sentences) {
  if (sentences.length === 0) return [];
  const per = sentences.length <= 3 ? sentences.length : 2;
  const out = [];
  for (let i = 0; i < sentences.length; i += per) out.push(sentences.slice(i, i + per).join(''));
  return out;
}

export function buildStoryBlocks(bean, farm) {
  const sentences = toSentences(flowText(bean.description_ja || farm?.overview || ''));

  let farmSentences = sentences;
  let lotSentences = [];
  if (sentences.length > 1) {
    let split = sentences.findIndex((s, i) => i >= 1 && LOT_MARKER.test(s));
    if (split === -1) split = Math.ceil(sentences.length / 2);
    farmSentences = sentences.slice(0, split);
    lotSentences = sentences.slice(split);
  }

  const tasteSentences = toSentences(tasteFor(bean));

  return [
    { key: 'farm', eyebrow: 'THE FARM — 農園について', paragraphs: toParagraphs(farmSentences) },
    { key: 'lot', eyebrow: 'THE LOT — このロットについて', paragraphs: toParagraphs(lotSentences) },
    { key: 'taste', eyebrow: 'THE CUP — 味わい', paragraphs: toParagraphs(tasteSentences) },
  ].filter((b) => b.paragraphs.length > 0);
}
