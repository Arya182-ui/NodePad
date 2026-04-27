import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, CheckSquare, Square } from 'lucide-react';
import './NoteCard.css';

function NoteCard({ note, onDelete, selected = false, onSelect }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // If in selection mode (any card selected) or shift-click, toggle selection
    if (e.shiftKey || selected) { onSelect?.(note.id); return; }
    navigate(`/note/${note.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Move this note to trash?')) onDelete(note.id);
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect?.(note.id);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const preview = note.blocks?.find(b => b.content)?.content || note.content || '';

  return (
    <div
      className={`note-card ${selected ? 'note-card--selected' : ''}`}
      onClick={handleClick}
    >
      {/* Selection checkbox */}
      {onSelect && (
        <button className="note-card-select" onClick={handleSelect} title="Select">
          {selected ? <CheckSquare size={15} /> : <Square size={15} />}
        </button>
      )}

      {/* Cover */}
      {note.cover && (
        <div
          className="note-card-cover"
          style={
            note.cover.startsWith('linear-gradient') || note.cover.startsWith('radial-gradient')
              ? { background: note.cover }
              : { backgroundImage: `url(${note.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          }
        />
      )}

      <div className="note-card-inner">
        {note.icon && <div className="note-card-icon">{note.icon}</div>}

        <div className="note-card-header">
          <h3 className="note-card-title">{note.title || 'Untitled'}</h3>
          <div className="note-card-actions">
            <button className="icon-btn" onClick={(e) => { e.stopPropagation(); navigate(`/note/${note.id}`); }} title="Edit">
              <Edit size={14} />
            </button>
            <button className="icon-btn delete" onClick={handleDelete} title="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="note-card-content">{preview || 'No content'}</div>

        <div className="note-card-footer">
          <div className="note-card-tags">
            {note.tags?.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
          <span className="note-card-date">{formatDate(note.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
