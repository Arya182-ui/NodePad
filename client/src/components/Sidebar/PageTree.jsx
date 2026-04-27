import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, FileText, Plus, Trash2 } from 'lucide-react';
import { notesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './PageTree.css';

export default function PageTree({ notes = [], onRefresh, onClose }) {
  // Build tree: root pages only (no parentId)
  const roots = notes.filter(n => !n.parentId);
  const children = (parentId) => notes.filter(n => n.parentId === parentId);

  return (
    <div className="pt-root">
      {roots.length === 0 ? (
        <div className="pt-empty">No pages yet</div>
      ) : (
        roots.map(note => (
          <PageNode
            key={note.id}
            note={note}
            children={children(note.id)}
            allNotes={notes}
            depth={0}
            onRefresh={onRefresh}
            onClose={onClose}
          />
        ))
      )}
    </div>
  );
}

function PageNode({ note, children, allNotes, depth, onRefresh, onClose }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover]       = useState(false);
  const hasChildren = children.length > 0;

  const createChild = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await notesAPI.create({
        title: 'Untitled',
        parentId: note.id,
        blocks: [{ id: Date.now().toString(), type: 'text', content: '' }],
      });
      onRefresh();
      setExpanded(true);
      navigate(`/note/${res.data.id}`);
      onClose();
    } catch {
      toast.error('Failed to create page');
    }
  };

  const deleteNote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this page?')) return;
    try {
      await notesAPI.delete(note.id);
      onRefresh();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const grandchildren = (id) => allNotes.filter(n => n.parentId === id);

  return (
    <div className="pt-node">
      <div
        className="pt-row"
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* expand arrow */}
        <button
          className={`pt-arrow ${hasChildren ? '' : 'pt-arrow--hidden'} ${expanded ? 'pt-arrow--open' : ''}`}
          onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
        >
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>

        {/* page link */}
        <Link
          to={`/note/${note.id}`}
          className="pt-link"
          onClick={onClose}
        >
          <span className="pt-icon">
            {note.icon || <FileText size={14} strokeWidth={2} />}
          </span>
          <span className="pt-title">{note.title || 'Untitled'}</span>
        </Link>

        {/* actions */}
        {hover && (
          <div className="pt-actions">
            <button className="pt-btn" onClick={createChild} title="Add sub-page">
              <Plus size={13} strokeWidth={2.5} />
            </button>
            <button className="pt-btn pt-btn--del" onClick={deleteNote} title="Delete">
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* children */}
      {expanded && hasChildren && (
        <div className="pt-children">
          {children.map(child => (
            <PageNode
              key={child.id}
              note={child}
              children={grandchildren(child.id)}
              allNotes={allNotes}
              depth={depth + 1}
              onRefresh={onRefresh}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}
