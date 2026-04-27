import { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Code, Link } from 'lucide-react';
import './FormatToolbar.css';

export default function FormatToolbar({ rect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    onClose();
  };

  const style = rect ? {
    position: 'fixed',
    top:  rect.top - 44,
    left: rect.left + rect.width / 2,
    transform: 'translateX(-50%)',
  } : {};

  const btns = [
    { icon: Bold,      cmd: 'bold',      title: 'Bold (⌘B)' },
    { icon: Italic,    cmd: 'italic',    title: 'Italic (⌘I)' },
    { icon: Underline, cmd: 'underline', title: 'Underline (⌘U)' },
    { icon: Code,      cmd: 'formatBlock', value: 'pre', title: 'Code' },
  ];

  return (
    <div ref={ref} className="fmt-toolbar" style={style}>
      {btns.map(({ icon: Icon, cmd, value, title }) => (
        <button
          key={cmd}
          className="fmt-btn"
          title={title}
          onMouseDown={(e) => { e.preventDefault(); exec(cmd, value); }}
        >
          <Icon size={14} strokeWidth={2.5} />
        </button>
      ))}
      <div className="fmt-sep" />
      <button
        className="fmt-btn"
        title="Link"
        onMouseDown={(e) => {
          e.preventDefault();
          const url = prompt('Enter URL:');
          if (url) exec('createLink', url);
          else onClose();
        }}
      >
        <Link size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
