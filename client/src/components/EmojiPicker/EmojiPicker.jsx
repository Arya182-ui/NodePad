import { useState, useRef, useEffect } from 'react';
import './EmojiPicker.css';

const EMOJIS = [
  '📄','📝','📋','📌','📍','🗒️','🗓️','🗃️',
  '💡','🔥','⭐','🎯','🚀','💎','🏆','✅','❤️','🎨',
  '📚','🔬','💻','🎵','🎬','🌍','🌟','⚡','🛠️','🔑',
  '🏠','🌈','🦋','🌸','🍀','🎃','🎄','🎉','🎊','🎁',
  '🤔','💪','👀','🙌','✨','🌙','☀️','🌊','🏔️','🌿',
  '📊','📈','📉','💰','🔒','🔓','📡','🧩','🎮','🏋️',
];

const PANEL_W = 280;

export default function EmojiPicker({ value, onChange }) {
  const [open, setOpen]   = useState(false);
  const [style, setStyle] = useState({});
  const triggerRef        = useRef(null);
  const panelRef          = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleToggle = () => {
    if (open) { setOpen(false); return; }

    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) { setOpen(true); return; }

    const vw  = window.innerWidth;
    const vh  = window.innerHeight;
    const gap = 8;

    // Clamp left so panel never goes off right edge
    const left = Math.min(
      Math.max(gap, rect.left),
      vw - PANEL_W - gap
    );

    // Flip up if not enough space below
    const spaceBelow = vh - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const flipUp     = spaceBelow < 340 && spaceAbove > spaceBelow;

    setStyle(flipUp
      ? { left, bottom: vh - rect.top + gap, top: 'auto' }
      : { left, top: rect.bottom + gap, bottom: 'auto' }
    );
    setOpen(true);
  };

  return (
    <div className="ep-wrap">
      <button
        ref={triggerRef}
        className="ep-trigger"
        onClick={handleToggle}
        title="Change icon"
      >
        {value
          ? <span className="ep-current">{value}</span>
          : <span className="ep-placeholder">+</span>
        }
      </button>

      {open && (
        <div ref={panelRef} className="ep-panel" style={style}>
          <div className="ep-grid">
            {EMOJIS.map(e => (
              <button
                key={e}
                className={`ep-item ${value === e ? 'ep-item--active' : ''}`}
                onClick={() => { onChange(e); setOpen(false); }}
              >
                {e}
              </button>
            ))}
          </div>
          {value && (
            <button
              className="ep-remove"
              onClick={() => { onChange(''); setOpen(false); }}
            >
              Remove icon
            </button>
          )}
        </div>
      )}
    </div>
  );
}
