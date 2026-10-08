import { PURCHASE_URL, INSTAGRAM_URL } from '../lib/constants';

const BUTTON = 'flex items-center justify-center w-12 h-12 rounded-full transition-colors';

function IconLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={BUTTON}
      style={{ border: '1px solid #1A181A', color: '#1A181A' }}
    >
      {children}
    </a>
  );
}

// ページ最下部: オンラインストアと Instagram への導線（マークだけで伝わるアイコンボタン）
export default function SiteFooter() {
  return (
    <footer className="text-center px-6 pt-6 pb-28" style={{ borderTop: '0.5px solid #E0DCD6', maxWidth: '48rem', margin: '0 auto' }}>
      <div className="flex items-center justify-center gap-5 pt-8">
        <IconLink href={PURCHASE_URL} label="オンラインストア">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1 12H6L5 8z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>
        </IconLink>
        <IconLink href={INSTAGRAM_URL} label="Instagram">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17" cy="7" r="0.6" fill="currentColor" />
          </svg>
        </IconLink>
      </div>
      <p className="font-display font-light tracking-[0.14em] mt-8" style={{ fontSize: '14px', color: '#9a9080', margin: '2rem 0 0' }}>
        ABOUT US COFFEE
      </p>
    </footer>
  );
}
