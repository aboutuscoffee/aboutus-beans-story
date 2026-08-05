const WIKI_RE = /\[\[([^|\]]+)\|(\w+):([\w-]+)\]\]/g;

// [[表示名|type:slug]] 記法をプレーンな表示テキストに変換する（顧客向けページでは編集リンクは表示しない）
export function stripWiki(text) {
  if (!text) return '';
  return text.replace(WIKI_RE, (_, label) => label);
}

// 指定タイプの最初のスラッグを抽出する（例: extractSlug(bean.region, 'farm')）
export function extractSlug(text, type) {
  if (!text) return null;
  WIKI_RE.lastIndex = 0;
  let match;
  while ((match = WIKI_RE.exec(text)) !== null) {
    if (match[2] === type) return match[3];
  }
  return null;
}
