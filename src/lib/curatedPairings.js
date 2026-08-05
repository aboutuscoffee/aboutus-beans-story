// 豆ごとのペアリング提案。フレーバーノートに基づく手動キュレーションのため、
// 未作成の豆はCTAセクションでペアリングブロックごと非表示にする。
export const CURATED_PAIRINGS = {
  18: {
    sweet: '紅茶バスクチーズケーキ',
    text: 'アッサムティーを思わせるこの豆の紅茶感は、紅茶バスクチーズケーキの香りと呼応します。レッドカラントやシトラスの明るい酸がクリーミーな口当たりを軽やかに引き締め、共通するブラウンシュガーのような甘さが余韻で重なります。',
  },
};

export function pairingFor(bean) {
  return CURATED_PAIRINGS[bean.id] ?? null;
}
