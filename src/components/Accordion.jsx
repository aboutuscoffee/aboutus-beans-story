import { useState } from 'react';

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderTop: '0.5px solid #D0C8BE' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 cursor-pointer"
      >
        <span className="text-[12px] tracking-[0.15em]" style={{ color: '#2C1917' }}>{title}</span>
        <span
          className="text-[15px] leading-none transition-transform duration-200"
          style={{ color: '#9a9080', transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}
