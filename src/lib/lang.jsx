import { createContext, useContext, useState } from 'react';

const LangContext = createContext({ lang: 'ja', setLang: () => {}, tr: (ja) => ja });

function initialLang() {
  try {
    return localStorage.getItem('lang') === 'en' ? 'en' : 'ja';
  } catch {
    return 'ja';
  }
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('lang', l); } catch { /* 保存できなくても動作には影響しない */ }
  };
  const tr = (ja, en) => (lang === 'en' && en != null ? en : ja);
  return <LangContext.Provider value={{ lang, setLang, tr }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

export function LangToggle({ className = '', style }) {
  const { lang, setLang } = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
      className={`font-display text-[11px] tracking-[0.18em] ${className}`}
      style={{ color: '#6b5a45', ...style }}
      aria-label="Language"
    >
      <span style={{ opacity: lang === 'ja' ? 1 : 0.4 }}>JP</span>
      <span style={{ opacity: 0.4 }}> / </span>
      <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>EN</span>
    </button>
  );
}
