import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Trash2, RotateCcw, X, FileText, AlertTriangle, CheckSquare, Square, Loader2 } from 'lucide-react';
import './Trash.css';

const RETENTION_DAYS = 30;

function daysLeft(deletedAt) {
  if (!deletedAt) return RETENTION_DAYS;
  const diff = Date.now() - new Date(deletedAt).getTime();
  const days = RETENTION_DAYS - Math.floor(diff / 86400000);
  return Math.max(0, days);
}

export default function Trash() {
  const navigate = useNavigate();
  const [notes, setNotes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await notesAPI.getTrash();
      setNotes(res.data || []);
    } catch { toast.error('Failed to load trash'); }
    finally { setLoading(false); }
  };

  const restore = async (id) => {
    try {
      await notesAPI.restore(id);
      setNotes(n => n.filter(x => x.id !== id));
      setSelected(s => { const n = new Set(s); n.delete(id); return n; });
      toast.success('Page restored');
    } catch { toast.error('Failed to restore'); }
  };

  const perm = async (id) => {
    if (!window.confirm('Permanently delete? This cannot be undone.')) return;
    try {
      await notesAPI.permanentDelete(id);
      setNotes(n => n.filter(x => x.id !== id));
      setSelected(s => { const n = new Set(s); n.delete(id); return n; });
      toast.success('Permanently deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () =>
    setSelected(selected.size === notes.length ? new Set() : new Set(notes.map(n => n.id)));

  const bulkRestore = async () => {
    try {
      setBulkLoading(true);
      await notesAPI.bulkRestore([...selected]);
      setNotes(n => n.filter(x => !selected.has(x.id)));
      toast.success(`${selected.size} note(s) restored`);
      setSelected(new Set());
    } catch { toast.error('Bulk restore failed'); }
    finally { setBulkLoading(false); }
  };

  const bulkDelete = async () => {
    if (!window.confirm(`Permanently delete ${selected.size} note(s)? This cannot be undone.`)) return;
    try {
      setBulkLoading(true);
      await notesAPI.bulkPermanentDelete([...selected]);
      setNotes(n => n.filter(x => !selected.has(x.id)));
      toast.success(`${selected.size} note(s) deleted`);
      setSelected(new Set());
    } catch { toast.error('Bulk delete failed'); }
    finally { setBulkLoading(false); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }) : '';

  return (
    <div className="trash-page">
      <div className="trash-container">
        <div className="trash-header">
          <div className="trash-header__left">
            <Trash2 size={20} strokeWidth={2} />
            <h1>Trash</h1>
          </div>
          <button className="trash-back" onClick={() => navigate('/')}>
            Back to notes
          </button>
        </div>

        {notes.length > 0 && (
          <div className="trash-warning">
            <AlertTriangle size={14} strokeWidth={2} />
            Pages in trash are permanently deleted after {RETENTION_DAYS} days.
          </div>
        )}

        {/* Bulk toolbar */}
        {notes.length > 0 && (
          <div className="trash-bulk-bar">
            <button className="trash-select-all" onClick={selectAll}>
              {selected.size === notes.length && notes.length > 0
                ? <CheckSquare size={14} />
                : <Square size={14} />}
              {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
            </button>
            {selected.size > 0 && (
              <div className="trash-bulk-actions">
                <button className="trash-btn trash-btn--restore" onClick={bulkRestore} disabled={bulkLoading}>
                  {bulkLoading ? <Loader2 size={13} className="ne-spinner" /> : <RotateCcw size={13} strokeWidth={2} />}
                  Restore
                </button>
                <button className="trash-btn trash-btn--delete" onClick={bulkDelete} disabled={bulkLoading}>
                  {bulkLoading ? <Loader2 size={13} className="ne-spinner" /> : <X size={13} strokeWidth={2.5} />}
                  Delete
                </button>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="trash-empty"><Loader2 size={24} className="ne-spinner" /></div>
        ) : notes.length === 0 ? (
          <div className="trash-empty">
            <Trash2 size={48} strokeWidth={1.5} />
            <p>Trash is empty</p>
          </div>
        ) : (
          <div className="trash-list">
            {notes.map(note => {
              const days = daysLeft(note.deletedAt);
              const urgent = days <= 3;
              return (
                <div
                  key={note.id}
                  className={`trash-item ${selected.has(note.id) ? 'trash-item--selected' : ''}`}
                  onClick={() => toggleSelect(note.id)}
                >
                  <div className="trash-item__check">
                    {selected.has(note.id)
                      ? <CheckSquare size={15} style={{ color: 'var(--brand)' }} />
                      : <Square size={15} style={{ color: 'var(--tx-muted)' }} />}
                  </div>
                  <div className="trash-item__icon">
                    {note.icon || <FileText size={16} strokeWidth={2} />}
                  </div>
                  <div className="trash-item__info">
                    <div className="trash-item__title">{note.title || 'Untitled'}</div>
                    <div className="trash-item__meta">
                      <span className="trash-item__date">Deleted {fmt(note.deletedAt)}</span>
                      <span className={`trash-item__days ${urgent ? 'trash-item__days--urgent' : ''}`}>
                        {days === 0 ? 'Deletes today' : `${days}d left`}
                      </span>
                    </div>
                  </div>
                  <div className="trash-item__actions" onClick={e => e.stopPropagation()}>
                    <button
                      className="trash-btn trash-btn--restore"
                      onClick={() => restore(note.id)}
                      title="Restore"
                    >
                      <RotateCcw size={13} strokeWidth={2} />
                      Restore
                    </button>
                    <button
                      className="trash-btn trash-btn--delete"
                      onClick={() => perm(note.id)}
                      title="Delete permanently"
                    >
                      <X size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
