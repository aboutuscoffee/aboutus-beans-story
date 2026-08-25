import { useEffect, useState } from 'react';
import { fetchReleasedBeans } from '../lib/data';
import WorldMap from '../components/WorldMap';
import BeanCard from '../components/BeanCard';
import { subscribeToPush, sendTestNotification } from '../lib/push';

function PushTestPanel() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  async function handleSubscribe() {
    setError('');
    setStatus('登録中…');
    try {
      await subscribeToPush();
      setStatus('通知を有効化しました');
    } catch (e) {
      setStatus('');
      setError(e.message);
    }
  }

  async function handleTestSend() {
    setError('');
    setStatus('送信中…');
    try {
      const result = await sendTestNotification();
      setStatus(`送信しました（${result?.sent ?? 0}件）`);
    } catch (e) {
      setStatus('');
      setError(e.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 border-t border-stone-200 mt-6">
      <p className="text-[10px] tracking-[0.22em] mb-3" style={{ color: '#9a9080' }}>
        PUSH NOTIFICATION TEST
      </p>
      <div className="flex gap-3">
        <button onClick={handleSubscribe} className="border border-stone-300 px-4 py-2 text-sm">
          通知を有効化
        </button>
        <button onClick={handleTestSend} className="border border-stone-300 px-4 py-2 text-sm">
          テスト通知を送信
        </button>
      </div>
      {status && <p className="text-xs mt-2 text-stone-500">{status}</p>}
      {error && <p className="text-xs mt-2 text-red-500">{error}</p>}
    </div>
  );
}

export default function Home() {
  const [beans, setBeans] = useState(null);
  const [error, setError] = useState(null);
  const showPushTest = new URLSearchParams(window.location.search).get('test') === 'push';

  useEffect(() => {
    fetchReleasedBeans().then(setBeans).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="min-h-screen font-sans-jp" style={{ backgroundColor: '#FAFAF8' }}>
      <header className="text-center px-6 pt-14 pb-8">
        <p className="font-display font-light tracking-[0.14em]" style={{ fontSize: '22px', color: '#1A181A' }}>
          ABOUT US COFFEE
        </p>
        <p className="text-[11px] tracking-[0.18em] mt-3" style={{ color: '#9a9080' }}>
          世界地図で、いま飲めるコーヒーを巡る
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        {error && <p className="text-center text-sm text-stone-400 py-10">{error}</p>}
        {!error && !beans && <div style={{ aspectRatio: '1000 / 320' }} className="animate-pulse bg-stone-100 rounded-lg" />}
        {beans && <WorldMap beans={beans} />}
      </div>

      {beans && beans.length > 0 && (
        <div className="mt-10 pb-20">
          <p className="text-[10px] tracking-[0.22em] px-6 mb-4" style={{ color: '#9a9080' }}>
            NOW RELEASING — いま飲める{beans.length}銘柄
          </p>
          <div className="flex gap-4 overflow-x-auto px-6 pb-2" style={{ scrollbarWidth: 'none' }}>
            {beans.map(({ bean, country }, i) => (
              <BeanCard key={bean.id} bean={bean} country={country} index={i} />
            ))}
          </div>
        </div>
      )}
      {showPushTest && <PushTestPanel />}
    </div>
  );
}
