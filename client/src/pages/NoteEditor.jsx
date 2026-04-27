import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, Loader2, ChevronRight, LayoutTemplate } from 'lucide-react';
import BlockEditor from '../components/Editor/BlockEditor';
import CoverImage from '../components/CoverImage/CoverImage';
import NoteActions from '../components/NoteActions/NoteActions';
import EmojiPicker from '../components/EmojiPicker/EmojiPicker';
import TemplatesModal from '../components/Templates/TemplatesModal';
import { saveDraft, loadDraft, clearDraft, hasDraft } from '../utils/draftCache';
import './NoteEditor.css';

const AUTOSAVE_DELAY = 1500;

export default function NoteEditor() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isNew    = id === 'new';

  const [note, setNote]           = useState({
    title: '', blocks: [{ id: '1', type: 'text', content: '' }],
    tags: [], images: [], icon: '', cover: '', parentId: null,
  });
  const [parent, setParent]       = useState(null);
  const [status, setStatus]       = useState('idle');
  const [loading, setLoading]     = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const saveTimer  = useRef(null);
  const noteRef    = useRef(note);
  const savedIdRef = useRef(null);
  const titleRef   = useRef(null);

  useEffect(() => { noteRef.current = note; }, [note]);

  useEffect(() => {
    if (!isNew && id) { setLoading(true); loadNote(); }
  }, [id]);

  const loadNote = async () => {
    try {
      const res  = await notesAPI.getById(id);
      const data = res.data;
      if (data.content && !data.blocks?.length) {
        data.blocks = [{ id: '1', type: 'text', content: data.content }];
      }
      if (!data.blocks?.length) data.blocks = [{ id: '1', type: 'text', content: '' }];
      setNote(data);
      savedIdRef.current = data.id;

      // load parent if exists
      if (data.parentId) {
        try {
          const pr = await notesAPI.getById(data.parentId);
          setParent(pr.data);
        } catch { /* parent deleted */ }
      }
    } catch {
      // Try to restore from local draft cache
      const draft = loadDraft(id);
      if (draft) {
        setNote(draft);
        savedIdRef.current = draft.id || id;
        toast('Restored from local draft — you were offline', { icon: '💾' });
      } else {
        toast.error('Failed to load note');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── autosave ──────────────────────────────────────────────────────────────
  const scheduleSave = useCallback(() => {
    clearTimeout(saveTimer.current);
    setStatus('idle');
    saveTimer.current = setTimeout(doSave, AUTOSAVE_DELAY);
  }, []);

  const doSave = async () => {
    const n = noteRef.current;
    if (!n.title && n.blocks.every(b => !b.content)) return;
    try {
      setStatus('saving');
      const payload = {
        ...n,
        content: n.blocks.map(b => b.content).filter(Boolean).join('\n\n'),
      };
      if (isNew && !savedIdRef.current) {
        const res = await notesAPI.create(payload);
        savedIdRef.current = res.data.id;
        clearDraft('new');
        navigate(`/note/${res.data.id}`, { replace: true });
      } else {
        await notesAPI.update(savedIdRef.current || id, payload);
        clearDraft(savedIdRef.current || id);
      }
      setStatus('saved');
    } catch {
      setStatus('error');
      // Save to draft cache so work isn't lost
      saveDraft(savedIdRef.current || id || 'new', noteRef.current);
    }
  };

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const updateNote = (patch) => {
    setNote(prev => {
      const next = { ...prev, ...patch };
      // persist draft locally on every change
      saveDraft(savedIdRef.current || id || 'new', next);
      return next;
    });
    scheduleSave();
  };

  const applyTemplate = (template) => {
    const uid = () => Math.random().toString(36).slice(2, 9);
    const blocks = template.blocks.map(b => ({ ...b, id: uid() }));
    updateNote({
      title: note.title || template.label,
      icon:  note.icon  || template.icon,
      tags:  [...new Set([...note.tags, ...template.tags])],
      blocks,
    });
  };

  // ── title sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (titleRef.current && !isNew) {
      titleRef.current.textContent = note.title;
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="ne-loading">
        <Loader2 size={24} className="ne-spinner" />
      </div>
    );
  }

  return (
    <>
    <div className="ne-page">

      {/* ── topbar ── */}
      <div className="ne-topbar" role="toolbar" aria-label="Note actions">
        <button className="ne-icon-btn" onClick={() => navigate('/')} aria-label="Back to all notes">
          <ArrowLeft size={17} strokeWidth={2} />
        </button>

        {/* breadcrumb */}
        <div className="ne-breadcrumb">
          <Link to="/" className="ne-crumb">All Notes</Link>
          {parent && (
            <>
              <ChevronRight size={13} className="ne-crumb-sep" />
              <Link to={`/note/${parent.id}`} className="ne-crumb">
                {parent.icon && <span>{parent.icon}</span>}
                {parent.title || 'Untitled'}
              </Link>
            </>
          )}
          <ChevronRight size={13} className="ne-crumb-sep" />
          <span className="ne-crumb ne-crumb--active">
            {note.icon && <span>{note.icon}</span>}
            {note.title || 'Untitled'}
          </span>
        </div>

        <div className="ne-topbar-right">
          <StatusBadge status={status} />
          {isNew && (
            <button
              className="ne-icon-btn ne-templates-btn"
              onClick={() => setShowTemplates(true)}
              title="Use a template"
              aria-label="Choose template"
            >
              <LayoutTemplate size={16} strokeWidth={2} />
            </button>
          )}
          <NoteActions
            note={{ ...note, id: savedIdRef.current || id }}
            onRefresh={() => {}}
          />
        </div>
      </div>

      {/* ── cover ── */}
      <CoverImage
        cover={note.cover}
        onChange={(cover) => updateNote({ cover })}
      />

      {/* ── body ── */}
      <div className="ne-body">

        {/* icon + title row */}
        <div className="ne-header">
          <EmojiPicker
            value={note.icon}
            onChange={(icon) => updateNote({ icon })}
          />
          <div
            ref={titleRef}
            className="ne-title"
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Untitled"
            role="textbox"
            aria-label="Note title"
            aria-multiline="false"
            onInput={(e) => updateNote({ title: e.currentTarget.textContent })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('.be-content')?.focus();
              }
            }}
          />
        </div>

        {/* tags */}
        <TagsRow tags={note.tags} onChange={(tags) => updateNote({ tags })} />

        {/* page properties */}
        <PageProperties note={note} parent={parent} />

        {/* blocks */}
        <BlockEditor
          blocks={note.blocks}
          onChange={(blocks) => updateNote({ blocks })}
        />
      </div>
    </div>

    {showTemplates && (
      <TemplatesModal
        onSelect={applyTemplate}
        onClose={() => setShowTemplates(false)}
      />
    )}
  </>
  );
}

// ── status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'saving') return (
    <span className="ne-status ne-status--saving">
      <Loader2 size={11} className="ne-spinner" /> Saving
    </span>
  );
  if (status === 'saved') return (
    <span className="ne-status ne-status--saved">
      <Check size={11} /> Saved
    </span>
  );
  if (status === 'error') return (
    <span className="ne-status ne-status--error">Failed</span>
  );
  return null;
}

// ── page properties ───────────────────────────────────────────────────────────
function PageProperties({ note, parent }) {
  const [open, setOpen] = useState(false);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }) : '—';

  return (
    <div className="ne-props">
      <button className="ne-props__toggle" onClick={() => setOpen(!open)}>
        {open ? 'Hide properties' : 'Add properties'}
      </button>
      {open && (
        <div className="ne-props__table">
          <div className="ne-prop">
            <span className="ne-prop__key">Created</span>
            <span className="ne-prop__val">{fmt(note.createdAt)}</span>
          </div>
          <div className="ne-prop">
            <span className="ne-prop__key">Updated</span>
            <span className="ne-prop__val">{fmt(note.updatedAt)}</span>
          </div>
          {parent && (
            <div className="ne-prop">
              <span className="ne-prop__key">Parent</span>
              <span className="ne-prop__val">
                {parent.icon} {parent.title || 'Untitled'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── tags row ──────────────────────────────────────────────────────────────────
function TagsRow({ tags = [], onChange }) {
  const [input, setInput] = useState('');

  const add = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const tag = input.trim().replace(/,$/, '');
      if (!tags.includes(tag)) onChange([...tags, tag]);
      setInput('');
    }
  };

  return (
    <div className="ne-tags">
      {tags.map(t => (
        <span key={t} className="ne-tag">
          {t}
          <button className="ne-tag__remove" onClick={() => onChange(tags.filter(x => x !== t))}>×</button>
        </span>
      ))}
      <input
        className="ne-tags__input"
        placeholder={tags.length === 0 ? 'Add tags…' : ''}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={add}
      />
    </div>
  );
}
