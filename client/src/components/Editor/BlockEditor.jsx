import { useState, useRef, useEffect, useCallback } from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SlashMenu from './SlashMenu';
import FormatToolbar from './FormatToolbar';
import CodeBlock from './CodeBlock';
import TableBlock, { defaultTable } from './TableBlock';
import MentionMenu from './MentionMenu';
import './BlockEditor.css';

// ─── helpers ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);

const emptyBlock = (type = 'text') => ({
  id: uid(),
  type,
  content: '',
  checked: false,
  level: 1,
  ...(type === 'table' ? { table: defaultTable() } : {}),
});

// ─── main component ──────────────────────────────────────────────────────────
export default function BlockEditor({ blocks = [], onChange, readOnly = false }) {
  const navigate                      = useNavigate();
  const [focusId, setFocusId]         = useState(null);
  const [slashState, setSlashState]   = useState(null);
  const [mentionState, setMentionState] = useState(null); // { blockId, query, rect }
  const [toolbar, setToolbar]         = useState(null);
  const [dragIdx, setDragIdx]         = useState(null);
  const [overIdx, setOverIdx]         = useState(null);
  const editorRef                     = useRef(null);

  // ensure at least one block
  useEffect(() => {
    if (!readOnly && blocks.length === 0) onChange([emptyBlock()]);
  }, [readOnly]);

  // ── block ops ──────────────────────────────────────────────────────────────
  const update = useCallback((id, patch) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...patch } : b));
  }, [blocks, onChange]);

  const insertAfter = useCallback((afterId, type = 'text') => {
    const idx  = blocks.findIndex(b => b.id === afterId);
    const nb   = emptyBlock(type);
    const next = [...blocks];
    next.splice(idx + 1, 0, nb);
    onChange(next);
    setTimeout(() => setFocusId(nb.id), 0);
    return nb.id;
  }, [blocks, onChange]);

  const remove = useCallback((id) => {
    if (blocks.length === 1) { update(id, { content: '', type: 'text' }); return; }
    const idx  = blocks.findIndex(b => b.id === id);
    const prev = blocks[idx - 1];
    onChange(blocks.filter(b => b.id !== id));
    if (prev) setTimeout(() => setFocusId(prev.id), 0);
  }, [blocks, onChange, update]);

  const changeType = useCallback((id, type) => {
    update(id, { type, content: '' });
    setTimeout(() => setFocusId(id), 0);
  }, [update]);

  // ── drag & drop ────────────────────────────────────────────────────────────
  const onDragStart = (idx) => setDragIdx(idx);
  const onDragOver  = (e, idx) => { e.preventDefault(); setOverIdx(idx); };
  const onDrop      = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...blocks];
    const [item] = next.splice(dragIdx, 1);
    next.splice(idx, 0, item);
    onChange(next);
    setDragIdx(null);
    setOverIdx(null);
  };
  const onDragEnd   = () => { setDragIdx(null); setOverIdx(null); };

  // ── selection toolbar ──────────────────────────────────────────────────────
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setToolbar(null);
      return;
    }
    const range = sel.getRangeAt(0);
    const rect  = range.getBoundingClientRect();
    setToolbar({ rect });
  };

  return (
    <div
      className="be-root"
      ref={editorRef}
      onMouseUp={readOnly ? undefined : handleMouseUp}
    >
      {blocks.map((block, idx) => (
        <BlockRow
          key={block.id}
          block={block}
          index={idx}
          isFocused={!readOnly && focusId === block.id}
          isDragging={!readOnly && dragIdx === idx}
          isOver={!readOnly && overIdx === idx}
          readOnly={readOnly}
          onFocus={() => !readOnly && setFocusId(block.id)}
          onBlur={() => !readOnly && setFocusId(null)}
          onUpdate={(patch) => !readOnly && update(block.id, patch)}
          onDelete={() => !readOnly && remove(block.id)}
          onInsertAfter={(type) => !readOnly && insertAfter(block.id, type)}
          onSlashOpen={(query, rect) => !readOnly && setSlashState({ blockId: block.id, query, rect })}
          onSlashClose={() => !readOnly && setSlashState(null)}
          onMentionOpen={(query, rect) => !readOnly && setMentionState({ blockId: block.id, query, rect })}
          onMentionClose={() => !readOnly && setMentionState(null)}
          onDragStart={() => !readOnly && onDragStart(idx)}
          onDragOver={(e) => !readOnly && onDragOver(e, idx)}
          onDrop={(e) => !readOnly && onDrop(e, idx)}
          onDragEnd={!readOnly ? onDragEnd : undefined}
        />
      ))}

      {/* Slash command menu */}
      {slashState && (
        <SlashMenu
          query={slashState.query}
          rect={slashState.rect}
          onSelect={(type) => {
            changeType(slashState.blockId, type);
            setSlashState(null);
          }}
          onClose={() => setSlashState(null)}
        />
      )}

      {/* @mention note link menu */}
      {mentionState && (
        <MentionMenu
          query={mentionState.query}
          rect={mentionState.rect}
          onSelect={(note) => {
            // Insert an inline link chip into the block content
            const block = blocks.find(b => b.id === mentionState.blockId);
            if (block) {
              const atIdx = block.content.lastIndexOf('@');
              const before = block.content.slice(0, atIdx);
              const link   = `@[${note.title || 'Untitled'}](/note/${note.id})`;
              update(mentionState.blockId, { content: before + link });
            }
            setMentionState(null);
          }}
          onClose={() => setMentionState(null)}
        />
      )}

      {/* Inline format toolbar */}
      {toolbar && (
        <FormatToolbar
          rect={toolbar.rect}
          onClose={() => setToolbar(null)}
        />
      )}
    </div>
  );
}

// ─── single block row ─────────────────────────────────────────────────────────
function BlockRow({
  block, index, isFocused, isDragging, isOver, readOnly = false,
  onFocus, onBlur, onUpdate, onDelete, onInsertAfter,
  onSlashOpen, onSlashClose,
  onMentionOpen, onMentionClose,
  onDragStart, onDragOver, onDrop, onDragEnd,
}) {
  const ref        = useRef(null);
  const [hover, setHover] = useState(false);
  const slashStart = useRef(null); // caret position where / was typed

  // focus management
  useEffect(() => {
    if (isFocused && ref.current && document.activeElement !== ref.current) {
      ref.current.focus();
      placeCaret(ref.current, 'end');
    }
  }, [isFocused]);

  // sync content into DOM when block changes externally
  useEffect(() => {
    if (ref.current && ref.current.textContent !== block.content && !isFocused) {
      ref.current.textContent = block.content;
    }
  }, [block.content, isFocused]);

  const handleInput = (e) => {
    const text = e.currentTarget.textContent;

    const sel   = window.getSelection();
    const caret = sel?.focusOffset ?? 0;
    const slice = text.slice(0, caret);

    // detect slash command
    const slashIdx = slice.lastIndexOf('/');
    if (slashIdx !== -1 && (slashIdx === 0 || slice[slashIdx - 1] === ' ')) {
      const query = slice.slice(slashIdx + 1);
      const range = sel.getRangeAt(0);
      const rect  = range.getBoundingClientRect();
      slashStart.current = slashIdx;
      onSlashOpen(query, rect);
      onMentionClose();
    } else {
      // detect @mention
      const atIdx = slice.lastIndexOf('@');
      if (atIdx !== -1 && (atIdx === 0 || /\s/.test(slice[atIdx - 1]))) {
        const query = slice.slice(atIdx + 1);
        const range = sel.getRangeAt(0);
        const rect  = range.getBoundingClientRect();
        onMentionOpen(query, rect);
        onSlashClose();
      } else {
        slashStart.current = null;
        onSlashClose();
        onMentionClose();
      }
    }

    onUpdate({ content: text });
  };

  const handleKeyDown = (e) => {
    const el   = e.currentTarget;
    const text = el.textContent;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onInsertAfter('text');
      return;
    }

    if (e.key === 'Backspace' && text === '') {
      e.preventDefault();
      onDelete();
      return;
    }

    if (e.key === 'Escape') {
      onSlashClose();
      return;
    }

    // Tab → indent (todo / bullet)
    if (e.key === 'Tab') {
      e.preventDefault();
      // future: nested blocks
      return;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const placeholder = getPlaceholder(block.type);

  if (block.type === 'divider') {
    return (
      <div
        className={`be-row ${isOver ? 'be-row--over' : ''}`}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <RowActions hover={hover} onAdd={() => onInsertAfter()} onDelete={onDelete} onDragStart={onDragStart} onDragEnd={onDragEnd} />
        <div className="be-divider" />
      </div>
    );
  }

  if (block.type === 'callout') {
    return (
      <div
        className={`be-row ${isOver ? 'be-row--over' : ''} ${isDragging ? 'be-row--dragging' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <RowActions hover={hover} onAdd={() => onInsertAfter()} onDelete={onDelete} onDragStart={onDragStart} onDragEnd={onDragEnd} />
        <div className="be-callout">
          <span className="be-callout__icon">💡</span>
          <div
            ref={ref}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className="be-callout__text"
            data-placeholder={placeholder}
            onInput={readOnly ? undefined : handleInput}
            onKeyDown={readOnly ? undefined : handleKeyDown}
            onPaste={readOnly ? undefined : handlePaste}
            onFocus={readOnly ? undefined : onFocus}
            onBlur={readOnly ? undefined : onBlur}
          />
        </div>
      </div>
    );
  }

  if (block.type === 'table') {
    return (
      <div
        className={`be-row ${isOver ? 'be-row--over' : ''} ${isDragging ? 'be-row--dragging' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <RowActions hover={hover} onAdd={() => onInsertAfter()} onDelete={onDelete} onDragStart={onDragStart} onDragEnd={onDragEnd} />
        <div style={{ flex: 1 }}>
          <TableBlock block={block} onUpdate={onUpdate} />
        </div>
      </div>
    );
  }

  if (block.type === 'code') {    return (
      <div
        className={`be-row ${isOver ? 'be-row--over' : ''} ${isDragging ? 'be-row--dragging' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <RowActions hover={hover} onAdd={() => onInsertAfter()} onDelete={onDelete} onDragStart={onDragStart} onDragEnd={onDragEnd} />
        <div className="be-block be-block--code" style={{ flex: 1 }}>
          <CodeBlock
            block={block}
            isFocused={isFocused}
            onUpdate={onUpdate}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onSlashClose();
            }}
          />
        </div>
      </div>
    );
  }

  if (block.type === 'toggle') {    return (
      <div
        className={`be-row ${isOver ? 'be-row--over' : ''} ${isDragging ? 'be-row--dragging' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <RowActions hover={!readOnly && hover} onAdd={() => onInsertAfter()} onDelete={onDelete} onDragStart={onDragStart} onDragEnd={onDragEnd} />
        <div className="be-toggle">
          <button
            className={`be-toggle__arrow ${block.open ? 'open' : ''}`}
            onClick={() => !readOnly && onUpdate({ open: !block.open })}
            disabled={readOnly}
          >▶</button>
          <div
            ref={ref}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className="be-toggle__summary"
            data-placeholder="Toggle"
            onInput={readOnly ? undefined : handleInput}
            onKeyDown={readOnly ? undefined : handleKeyDown}
            onPaste={readOnly ? undefined : handlePaste}
            onFocus={readOnly ? undefined : onFocus}
            onBlur={readOnly ? undefined : onBlur}
          />
        </div>
      </div>
    );
  }

  const Tag = getTag(block.type);

  return (
    <div
      className={`be-row ${isOver ? 'be-row--over' : ''} ${isDragging ? 'be-row--dragging' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <RowActions
        hover={hover}
        onAdd={() => onInsertAfter()}
        onDelete={onDelete}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />

      <div className={`be-block be-block--${block.type}`}>
        {block.type === 'todo' && (
          <input
            type="checkbox"
            className="be-todo__check"
            checked={!!block.checked}
            onChange={() => !readOnly && onUpdate({ checked: !block.checked })}
            disabled={readOnly}
          />
        )}
        {block.type === 'bulletList' && <span className="be-bullet">•</span>}
        {block.type === 'numberList' && <span className="be-number">{index + 1}.</span>}

        <Tag
          ref={ref}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className={`be-content${block.checked ? ' be-content--checked' : ''}`}
          data-placeholder={placeholder}
          onInput={readOnly ? undefined : handleInput}
          onKeyDown={readOnly ? undefined : handleKeyDown}
          onPaste={readOnly ? undefined : handlePaste}
          onFocus={readOnly ? undefined : onFocus}
          onBlur={readOnly ? undefined : onBlur}
        />
      </div>
    </div>
  );
}

// ─── row action buttons ───────────────────────────────────────────────────────
function RowActions({ hover, onAdd, onDelete, onDragStart, onDragEnd }) {
  if (!hover) return null; // Don't render if not hovering
  
  return (
    <div className={`be-actions ${hover ? 'be-actions--visible' : ''}`}>
      <button
        className="be-action-btn"
        title="Drag to reorder"
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <GripVertical size={14} strokeWidth={2} />
      </button>
      <button className="be-action-btn" title="Add block below" onClick={onAdd}>
        <Plus size={14} strokeWidth={2.5} />
      </button>
      <button className="be-action-btn be-action-btn--del" title="Delete block" onClick={onDelete}>
        <Trash2 size={13} strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── utils ────────────────────────────────────────────────────────────────────
function getTag(type) {
  const map = {
    heading1: 'h1',
    heading2: 'h2',
    heading3: 'h3',
    quote:    'blockquote',
    code:     'pre',
  };
  return map[type] || 'p';
}

function getPlaceholder(type) {
  const map = {
    text:       "Type '/' for commands",
    heading1:   'Heading 1',
    heading2:   'Heading 2',
    heading3:   'Heading 3',
    bulletList: 'List item',
    numberList: 'List item',
    todo:       'To-do',
    quote:      'Quote',
    code:       'Code',
    callout:    'Callout',
    toggle:     'Toggle',
  };
  return map[type] || '';
}

function placeCaret(el, pos = 'end') {
  if (!el) return;
  const range = document.createRange();
  const sel   = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(pos !== 'end');
  sel?.removeAllRanges();
  sel?.addRange(range);
}
