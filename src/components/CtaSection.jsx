import { pairingFor } from '../lib/curatedPairings';

// TODO: オンラインショップの実URLが決まり次第、PURCHASE_URL を差し替える
const PURCHASE_URL = '#';

export default function CtaSection({ bean }) {
  const pairing = pairingFor(bean);

  return (
    <section style={{ backgroundColor: '#1A181A' }} className="text-center px-6 py-20">
      <div className="max-w-md mx-auto">
        <p className="font-serif-jp text-lg mb-8 leading-relaxed" style={{ color: '#F8F6F2' }}>
          このコーヒーを、<br />もっと近くで。
        </p>

        <a
          href={PURCHASE_URL}
          className="inline-block px-10 py-4 text-[12px] tracking-[0.2em] mb-4"
          style={{ background: '#F8F6F2', color: '#1A181A' }}
        >
          オンラインショップで購入する
        </a>
        <p className="text-[11px] mb-14" style={{ color: 'rgba(248,246,242,0.55)' }}>
          店頭では、豆売り・ドリップどちらでもご注文いただけます。<br />
          気になる味わいがあれば、ぜひ2杯目もお試しください。
        </p>

        {pairing && (
          <div
            className="text-left rounded-lg overflow-hidden"
            style={{ background: 'rgba(248,246,242,0.06)', border: '0.5px solid rgba(248,246,242,0.14)' }}
          >
            <div className="px-6 py-5">
              <p className="text-[10px] tracking-[0.22em] mb-2" style={{ color: 'rgba(248,246,242,0.5)' }}>
                PAIRING — この一杯に合わせて
              </p>
              <p className="font-serif-jp text-[15px] mb-2" style={{ color: '#F8F6F2' }}>
                {pairing.sweet}
              </p>
              <p className="text-[12px] leading-[1.9]" style={{ color: 'rgba(248,246,242,0.7)' }}>
                {pairing.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
