// シールカード画像のうち、右下のレーダーチャート部分だけを切り出して見せる
// （現行の全銘柄で同一テンプレート。切り出し位置は x 36〜85% / y 56〜85%）
export default function ChartCrop({ url }) {
  return (
    <div
      role="img"
      aria-label="フレーバーのレーダーチャート"
      className="w-full"
      style={{
        aspectRatio: '1.217 / 1',
        backgroundImage: `url(${url})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '204% auto',
        backgroundPosition: '70.6% 78.9%',
      }}
    />
  );
}
