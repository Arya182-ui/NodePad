import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { notesAPI } from '../services/api';
import NoteCard from '../components/NoteCard/NoteCard';
import toast from 'react-hot-toast';
import { FileText, Plus, Loader2, Trash2, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [notes, setNotes]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor]   = useState(null);
  const [selected, setSelected]       = useState(new Set()); // bulk selection
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchParams]                = useSearchParams();
  const searchQuery                   = searchParams.get('search');
  const tagFilter                     = searchParams.get('tag');

  // Safely get context (Layout provides real-time notes for sidebar)
  let refreshNotes = () => {};
  try {
    const ctx = useOutletContext();
    refreshNotes = ctx?.refreshNotes || (() => {});
  } catch { /* context not available */ }

  const fetchNotes = useCallback(async (cursor = null) => {
    try {
      cursor ? setLoadingMore(true) : setLoading(true);
      let response;

      if (searchQuery || tagFilter) {
        response = await notesAPI.search(searchQuery, tagFilter);
        setNotes(response.data);
        setNextCursor(null); // search results are not paginated
      } else {
        response = await notesAPI.getAll(cursor);
        setNotes(prev => cursor ? [...prev, ...response.data] : response.data);
        setNextCursor(response.nextCursor || null);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, tagFilter]);

  useEffect(() => {
    setNotes([]);
    setNextCursor(null);
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id) => {
    try {
      await notesAPI.delete(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      toast.success('Note moved to trash');
      refreshNotes();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(selected.size === notes.length ? new Set() : new Set(notes.map(n => n.id)));
  };

  const bulkDelete = async () => {
    if (!window.confirm(`Move ${selected.size} note(s) to trash?`)) return;
    try {
      setBulkLoading(true);
      await notesAPI.bulkDelete([...selected]);
      setNotes(prev => prev.filter(n => !selected.has(n.id)));
      setSelected(new Set());
      toast.success(`${selected.size} note(s) moved to trash`);
      refreshNotes();
    } catch { toast.error('Bulk delete failed'); }
    finally { setBulkLoading(false); }
  };

  const pageTitle = tagFilter
    ? `Tag: #${tagFilter}`
    : searchQuery
    ? `Search: "${searchQuery}"`
    : 'All Notes';

  if (loading) {
    return (
      <div className="home-page">
        <div className="notes-grid-new">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="note-card-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header-new">
          <div className="header-content">
            <h1 className="home-title-new">{pageTitle}</h1>
            <p className="home-subtitle-new">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              {nextCursor ? '+' : ''}
            </p>
          </div>
          <div className="home-header-actions">
            {selected.size > 0 && (
              <div className="bulk-toolbar">
                <span className="bulk-count">{selected.size} selected</span>
                <button className="btn btn-ghost" onClick={selectAll}>
                  {selected.size === notes.length ? <CheckSquare size={15} /> : <Square size={15} />}
                  {selected.size === notes.length ? 'Deselect all' : 'Select all'}
                </button>
                <button className="btn btn-danger" onClick={bulkDelete} disabled={bulkLoading}>
                  {bulkLoading ? <Loader2 size={15} className="ne-spinner" /> : <Trash2 size={15} />}
                  Delete
                </button>
              </div>
            )}
            <button
              className="btn btn-primary desktop-only"
              onClick={() => navigate('/note/new')}
            >
              <Plus size={18} />
              New Note
            </button>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state-new">
            <div className="empty-icon">
              <FileText size={80} />
            </div>
            <h2>No notes yet</h2>
            <p>
              {searchQuery || tagFilter
                ? 'No notes found matching your search'
                : 'Create your first note to get started'}
            </p>
            {!searchQuery && !tagFilter && (
              <button
                className="btn btn-primary"
                onClick={() => navigate('/note/new')}
              >
                <Plus size={18} />
                Create Note
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="notes-grid-new">
              {notes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDelete}
                  selected={selected.has(note.id)}
                  onSelect={toggleSelect}
                />
              ))}
            </div>

            {nextCursor && (
              <div className="load-more-row">
                <button
                  className="btn btn-secondary"
                  onClick={() => fetchNotes(nextCursor)}
                  disabled={loadingMore}
                >
                  {loadingMore
                    ? <><Loader2 size={15} className="ne-spinner" /> Loading…</>
                    : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <button
        className="fab"
        onClick={() => navigate('/note/new')}
        aria-label="Create new note"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default Home;
