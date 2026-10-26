import { useEffect, useState } from 'react';
import { fetchReleasedBeans } from '../lib/data';
import HomeMap from '../components/HomeMap';
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
      const failDetail = result?.details?.find((d) => !d.ok);
      setStatus(
        `${result?.succeeded ?? 0} / ${result?.attempted ?? 0} 件成功` +
          (failDetail ? `（失敗理由: ${failDetail.error}）` : '')
      );
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
      <div className="max-w-xl mx-auto">
        <header className="text-center px-6 pt-8 pb-4">
          <p className="font-display font-light tracking-[0.14em]" style={{ fontSize: '20px', color: '#1A181A' }}>
            ABOUT US COFFEE
          </p>
          <p className="text-[10px] tracking-[0.16em] mt-2" style={{ color: '#9a9080' }}>
            世界地図で、いま飲めるコーヒーを巡る
          </p>
        </header>

        {error && <p className="text-center text-sm text-stone-400 py-10">{error}</p>}
        {!error && !beans && <div style={{ aspectRatio: '372 / 262' }} className="animate-pulse bg-stone-100" />}
        {beans && <HomeMap beans={beans} />}
      </div>
      {showPushTest && <PushTestPanel />}
    </div>
  );
}
