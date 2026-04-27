import { useState, useEffect, useRef } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { notesAPI } from '../../services/api';
import './MentionMenu.css';

export default function MentionMenu({ query, rect, onSelect, onClose }) {
  const [notes, setNotes]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const menuRef             = useRef(null);

  useEffect(() => {
    setActive(0);
    if (!query && query !== '') return;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await notesAPI.search(query || ' ');
        setNotes((res.data || []).slice(0, 8));
      } catch { setNotes([]); }
      finally { setLoading(false); }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, notes.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === 'Enter')     { e.preventDefault(); if (notes[active]) onSelect(notes[active]); }
      if (e.key === 'Escape')    { onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, notes, onSelect, onClose]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const style = rect ? {
    position: 'fixed',
    top:  Math.min(rect.bottom + 6, window.innerHeight - 280),
    left: Math.min(rect.left, window.innerWidth - 260),
  } : {};

  return (
    <div ref={menuRef} className="mm-menu" style={style} role="listbox" aria-label="Link to a note">
      <div className="mm-header">LINK TO PAGE</div>
      {loading && <div className="mm-loading"><Loader2 size={14} className="ne-spinner" /></div>}
      {!loading && notes.length === 0 && (
        <div className="mm-empty">No notes found</div>
      )}
      {!loading && notes.map((note, i) => (
        <button
          key={note.id}
          className={`mm-item ${i === active ? 'mm-item--active' : ''}`}
          role="option"
          aria-selected={i === active}
          onMouseEnter={() => setActive(i)}
          onMouseDown={(e) => { e.preventDefault(); onSelect(note); }}
        >
          <span className="mm-item__icon">
            {note.icon || <FileText size={14} strokeWidth={2} />}
          </span>
          <span className="mm-item__title">{note.title || 'Untitled'}</span>
        </button>
      ))}
    </div>
  );
}
