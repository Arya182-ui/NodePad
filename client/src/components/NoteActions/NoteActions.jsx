import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal, Copy, Trash2, Download,
  FileText, FileCode, Sun, Moon, History
} from 'lucide-react';
import { notesAPI } from '../../services/api';
import { downloadMarkdown, downloadText } from '../../utils/exportNote';
import { useTheme } from '../../context/ThemeContext';
import VersionHistory from '../VersionHistory/VersionHistory';
import toast from 'react-hot-toast';
import './NoteActions.css';

export default function NoteActions({ note, onRefresh }) {
  const navigate      = useNavigate();
  const { theme, toggle } = useTheme();
  const [open, setOpen]       = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const ref           = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const noteId = note.id || note.savedId;

  const duplicate = async () => {
    try {
      const res = await notesAPI.duplicate(noteId);
      toast.success('Page duplicated');
      onRefresh?.();
      navigate(`/note/${res.data.id}`);
    } catch { toast.error('Failed to duplicate'); }
    setOpen(false);
  };

  const moveToTrash = async () => {
    if (!window.confirm('Move to trash?')) return;
    try {
      await notesAPI.delete(noteId);
      toast.success('Moved to trash');
      navigate('/');
      onRefresh?.();
    } catch { toast.error('Failed to delete'); }
    setOpen(false);
  };

  const exportMd  = () => { downloadMarkdown(note); setOpen(false); };
  const exportTxt = () => { downloadText(note); setOpen(false); };

  const ITEMS = [
    { icon: Copy,     label: 'Duplicate page',    action: duplicate },
    { icon: History,  label: 'Version history',   action: () => { setShowHistory(true); setOpen(false); } },
    { icon: FileCode, label: 'Export as Markdown', action: exportMd },
    { icon: FileText, label: 'Export as Text',     action: exportTxt },
    { divider: true },
    { icon: theme === 'dark' ? Sun : Moon,
                      label: theme === 'dark' ? 'Light mode' : 'Dark mode',
                      action: () => { toggle(); setOpen(false); } },
    { divider: true },
    { icon: Trash2,   label: 'Move to trash',      action: moveToTrash, danger: true },
  ];

  return (
    <>
      <div className="na-wrap" ref={ref}>
        <button
          className="ne-icon-btn"
          onClick={() => setOpen(!open)}
          title="More options"
        >
          <MoreHorizontal size={17} strokeWidth={2} />
        </button>

        {open && (
          <div className="na-menu">
            {ITEMS.map((item, i) => {
              if (item.divider) return <div key={i} className="na-divider" />;
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`na-item ${item.danger ? 'na-item--danger' : ''}`}
                  onClick={item.action}
                >
                  <Icon size={15} strokeWidth={2} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showHistory && noteId && (
        <VersionHistory
          noteId={noteId}
          onRestore={(data) => onRefresh?.(data)}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}
