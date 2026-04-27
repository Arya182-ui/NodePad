import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import BlockEditor from '../components/Editor/BlockEditor';
import CoverImage from '../components/CoverImage/CoverImage';
import './NoteEditor.css';
import './SharedNote.css';

export default function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSharedNote();
  }, [shareId]);

  const loadSharedNote = async () => {
    try {
      setLoading(true);
      const res = await notesAPI.getSharedNote(shareId);
      const data = res.data;
      
      if (!data.blocks?.length && data.content) {
        data.blocks = [{ id: '1', type: 'text', content: data.content }];
      }
      if (!data.blocks?.length) {
        data.blocks = [{ id: '1', type: 'text', content: '' }];
      }
      
      setNote(data);
    } catch (err) {
      setError(err.message || 'Failed to load shared note');
      toast.error('Failed to load shared note');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ne-loading">
        <Loader2 size={24} className="ne-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-error">
        <div className="shared-error-content">
          <Lock size={48} className="shared-error-icon" />
          <h1 className="shared-error-title">Note Not Found</h1>
          <p className="shared-error-message">{error}</p>
          <Link to="/landing" className="shared-error-btn">
            Go to NodePad
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ne-page shared-note-page">
      {/* Topbar */}
      <div className="ne-topbar">
        <Link to="/landing" className="ne-icon-btn" aria-label="Go to NodePad">
          <ArrowLeft size={17} strokeWidth={2} />
        </Link>
        
        <div className="shared-badge">
          <Lock size={12} />
          Read-only
        </div>

        <div style={{ flex: 1 }} />

        <Link to="/signup" className="shared-signup-btn">
          Create your own notes
        </Link>
      </div>

      {/* Cover */}
      {note.cover && (
        <CoverImage cover={note.cover} onChange={() => {}} readOnly />
      )}

      {/* Body */}
      <div className="ne-body">
        {/* Icon + Title */}
        <div className="ne-header">
          {note.icon && (
            <div className="emoji-picker-btn" style={{ cursor: 'default' }}>
              {note.icon}
            </div>
          )}
          <div className="ne-title" style={{ cursor: 'default' }}>
            {note.title || 'Untitled'}
          </div>
        </div>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="ne-tags">
            {note.tags.map(tag => (
              <span key={tag} className="ne-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Blocks (read-only) */}
        <BlockEditor
          blocks={note.blocks}
          onChange={() => {}}
          readOnly
        />
      </div>
    </div>
  );
}
