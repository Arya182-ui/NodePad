import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Clock, X, ArrowRight } from 'lucide-react';
import { notesAPI } from '../../services/api';
import './SearchModal.css';

export default function SearchModal({ onClose }) {
  const navigate   = useNavigate();
  const inputRef   = useRef(null);
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [recent, setRecent]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive]   = useState(0);
  const debounce              = useRef(null);

  // focus on open
  useEffect(() => { inputRef.current?.focus(); }, []);

  // load recent from localStorage
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem('np_recent') || '[]');
      setRecent(r.slice(0, 5));
    } catch { /* ignore */ }
  }, []);

  // search
  useEffect(() => {
    clearTimeout(debounce.current);
    if (!query.trim()) { setResults([]); return; }
    debounce.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await notesAPI.search(query);
        setResults(res.data || []);
        setActive(0);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 250);
  }, [query]);

  // keyboard nav
  useEffect(() => {
    const list = query ? results : recent;
    const handler = (e) => {
      if (e.key === 'ArrowDown')  { e.preventDefault(); setActive(a => Math.min(a + 1, list.length - 1)); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === 'Enter')      { if (list[active]) open(list[active]); }
      if (e.key === 'Escape')     { onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, results, recent, query]);

  const open = (note) => {
    // save to recent
    try {
      const prev = JSON.parse(localStorage.getItem('np_recent') || '[]');
      const next = [note, ...prev.filter(n => n.id !== note.id)].slice(0, 5);
      localStorage.setItem('np_recent', JSON.stringify(next));
    } catch { /* ignore */ }
    navigate(`/note/${note.id}`);
    onClose();
  };

  const list = query ? results : recent;
  const showRecent = !query && recent.length > 0;

  return (
    <div
      className="sm-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search notes"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="sm-modal">
        {/* input */}
        <div className="sm-input-row">
          <Search size={18} className="sm-search-icon" strokeWidth={2} aria-hidden="true" />
          <input
            ref={inputRef}
            className="sm-input"
            placeholder="Search notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search query"
            aria-autocomplete="list"
            aria-controls="sm-results"
            role="combobox"
            aria-expanded={list.length > 0}
          />
          {query && (
            <button className="sm-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={15} strokeWidth={2.5} />
            </button>
          )}
          <kbd className="sm-esc" onClick={onClose} aria-label="Close search">Esc</kbd>
        </div>

        {/* results */}
        <div className="sm-body" id="sm-results" role="listbox" aria-label="Search results">
          {loading && <div className="sm-loading" role="status" aria-live="polite">Searching…</div>}

          {!loading && showRecent && (
            <div className="sm-section">
              <div className="sm-section-label" aria-hidden="true">
                <Clock size={11} strokeWidth={2} /> Recent
              </div>
              {recent.map((note, i) => (
                <NoteRow
                  key={note.id}
                  note={note}
                  active={i === active}
                  onHover={() => setActive(i)}
                  onClick={() => open(note)}
                />
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="sm-empty" role="status" aria-live="polite">No results for "{query}"</div>
          )}

          {!loading && query && results.length > 0 && (
            <div className="sm-section">
              <div className="sm-section-label" aria-hidden="true">
                <Search size={11} strokeWidth={2} /> Results
              </div>
              {results.map((note, i) => (
                <NoteRow
                  key={note.id}
                  note={note}
                  active={i === active}
                  onHover={() => setActive(i)}
                  onClick={() => open(note)}
                  highlight={query}
                />
              ))}
            </div>
          )}

          {!query && recent.length === 0 && (
            <div className="sm-empty" role="status">Start typing to search your notes</div>
          )}
        </div>

        {/* footer */}
        <div className="sm-footer" aria-hidden="true">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

function NoteRow({ note, active, onHover, onClick, highlight }) {
  const preview = note.blocks?.find(b => b.content)?.content || note.content || '';
  const trimmed = preview.slice(0, 80) + (preview.length > 80 ? '…' : '');

  return (
    <button
      className={`sm-row ${active ? 'sm-row--active' : ''}`}
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <div className="sm-row__icon" aria-hidden="true">
        {note.icon || <FileText size={15} strokeWidth={2} />}
      </div>
      <div className="sm-row__info">
        <div className="sm-row__title">{note.title || 'Untitled'}</div>
        {trimmed && <div className="sm-row__preview">{trimmed}</div>}
      </div>
      <ArrowRight size={14} className="sm-row__arrow" strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
