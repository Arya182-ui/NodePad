import { useEffect } from 'react';
import { X } from 'lucide-react';
import './ShortcutsModal.css';

const SHORTCUTS = [
  {
    group: 'Navigation',
    items: [
      { keys: ['⌘', 'K'],    desc: 'Open search' },
      { keys: ['⌘', 'N'],    desc: 'New page' },
      { keys: ['⌘', '/'],    desc: 'Toggle shortcuts' },
    ],
  },
  {
    group: 'Editor',
    items: [
      { keys: ['/'],          desc: 'Insert block' },
      { keys: ['@'],          desc: 'Link to a note' },
      { keys: ['Enter'],      desc: 'New block' },
      { keys: ['Backspace'],  desc: 'Delete empty block' },
      { keys: ['Tab'],        desc: 'Indent in code block' },
      { keys: ['Esc'],        desc: 'Close menu' },
    ],
  },
  {
    group: 'Formatting',
    items: [
      { keys: ['⌘', 'B'],    desc: 'Bold' },
      { keys: ['⌘', 'I'],    desc: 'Italic' },
      { keys: ['⌘', 'U'],    desc: 'Underline' },
      { keys: ['⌘', 'E'],    desc: 'Inline code' },
    ],
  },
  {
    group: 'Blocks (via /)',
    items: [
      { keys: ['/code'],      desc: 'Code block with syntax highlighting' },
      { keys: ['/table'],     desc: 'Insert table' },
      { keys: ['/todo'],      desc: 'Checkbox task' },
      { keys: ['/toggle'],    desc: 'Collapsible block' },
      { keys: ['/callout'],   desc: 'Callout / highlight' },
    ],
  },
];

export default function ShortcutsModal({ onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="sc-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sc-modal">
        <div className="sc-header">
          <span className="sc-title">Keyboard Shortcuts</span>
          <button className="sc-close" onClick={onClose}>
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="sc-body">
          {SHORTCUTS.map(group => (
            <div key={group.group} className="sc-group">
              <div className="sc-group-label">{group.group}</div>
              {group.items.map(item => (
                <div key={item.desc} className="sc-row">
                  <span className="sc-desc">{item.desc}</span>
                  <div className="sc-keys">
                    {item.keys.map((k, i) => (
                      <kbd key={i} className="sc-key">{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
