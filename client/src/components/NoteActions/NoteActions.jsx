import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal, Copy, Trash2, Download,
  FileText, FileCode, Sun, Moon, History, Share2, Link2, X
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
  const [showShareModal, setShowShareModal] = useState(false);
  const ref           = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const noteId = note.id || note.savedId;
  const hasNoteId = !!noteId; // Check if note has been saved

  const duplicate = async () => {
    if (!hasNoteId) {
      toast.error('Please save the note first');
      setOpen(false);
      return;
    }
    try {
      const res = await notesAPI.duplicate(noteId);
      toast.success('Page duplicated');
      onRefresh?.();
      navigate(`/note/${res.data.id}`);
    } catch { toast.error('Failed to duplicate'); }
    setOpen(false);
  };

  const moveToTrash = async () => {
    if (!hasNoteId) {
      toast.error('Please save the note first');
      setOpen(false);
      return;
    }
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

  const openShareModal = () => {
    if (!hasNoteId) {
      toast.error('Please save the note first');
      setOpen(false);
      return;
    }
    setShowShareModal(true);
    setOpen(false);
  };

  const ITEMS = [
    { icon: Share2,   label: 'Share',              action: openShareModal, disabled: !hasNoteId },
    { icon: Copy,     label: 'Duplicate page',    action: duplicate, disabled: !hasNoteId },
    { icon: History,  label: 'Version history',   action: () => { 
      if (!hasNoteId) {
        toast.error('Please save the note first');
        setOpen(false);
        return;
      }
      setShowHistory(true); 
      setOpen(false); 
    }, disabled: !hasNoteId },
    { icon: FileCode, label: 'Export as Markdown', action: exportMd },
    { icon: FileText, label: 'Export as Text',     action: exportTxt },
    { divider: true },
    { icon: theme === 'dark' ? Sun : Moon,
                      label: theme === 'dark' ? 'Light mode' : 'Dark mode',
                      action: () => { toggle(); setOpen(false); } },
    { divider: true },
    { icon: Trash2,   label: 'Move to trash',      action: moveToTrash, danger: true, disabled: !hasNoteId },
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
                  className={`na-item ${item.danger ? 'na-item--danger' : ''} ${item.disabled ? 'na-item--disabled' : ''}`}
                  onClick={item.action}
                  disabled={item.disabled}
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

      {showShareModal && noteId && (
        <ShareModal
          noteId={noteId}
          note={note}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}

// ── Share Modal ───────────────────────────────────────────────────────────────
function ShareModal({ noteId, note, onClose }) {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState(note.shareId ? 
    `${window.location.origin}/shared/${note.shareId}` : null);
  const [copied, setCopied] = useState(false);

  const createLink = async () => {
    try {
      setLoading(true);
      const res = await notesAPI.createShareLink(noteId);
      setShareUrl(res.data.shareUrl);
      toast.success('Share link created');
    } catch {
      toast.error('Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  const revokeLink = async () => {
    if (!window.confirm('Revoke share link? The current link will stop working.')) return;
    try {
      setLoading(true);
      await notesAPI.revokeShareLink(noteId);
      setShareUrl(null);
      toast.success('Share link revoked');
    } catch {
      toast.error('Failed to revoke link');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="na-modal-overlay" onClick={onClose}>
      <div className="na-modal" onClick={(e) => e.stopPropagation()}>
        <div className="na-modal-header">
          <div>
            <h2 className="na-modal-title">Share Note</h2>
            <p className="na-modal-subtitle">Anyone with the link can view (read-only)</p>
          </div>
          <button className="na-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="na-modal-body">
          {!shareUrl ? (
            <button 
              className="na-share-create-btn" 
              onClick={createLink}
              disabled={loading}
            >
              <Link2 size={16} />
              Create Share Link
            </button>
          ) : (
            <div className="na-share-link-box">
              <div className="na-share-link-input">
                <Link2 size={14} className="na-share-link-icon" />
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="na-share-link-field"
                />
              </div>
              <div className="na-share-actions">
                <button 
                  className="na-share-copy-btn" 
                  onClick={copyLink}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button 
                  className="na-share-revoke-btn" 
                  onClick={revokeLink}
                  disabled={loading}
                >
                  Revoke
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
