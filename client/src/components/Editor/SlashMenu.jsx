import { useState, useEffect, useRef } from 'react';
import {
  Type, Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare, Quote,
  Code, Minus, Lightbulb, ChevronRight, FileText, Table
} from 'lucide-react';
import './SlashMenu.css';

const ALL_ITEMS = [
  { type: 'text',       icon: Type,         label: 'Text',        desc: 'Plain paragraph' },
  { type: 'heading1',   icon: Heading1,     label: 'Heading 1',   desc: 'Large heading' },
  { type: 'heading2',   icon: Heading2,     label: 'Heading 2',   desc: 'Medium heading' },
  { type: 'heading3',   icon: Heading3,     label: 'Heading 3',   desc: 'Small heading' },
  { type: 'bulletList', icon: List,         label: 'Bullet list', desc: 'Unordered list' },
  { type: 'numberList', icon: ListOrdered,  label: 'Numbered list', desc: 'Ordered list' },
  { type: 'todo',       icon: CheckSquare,  label: 'To-do',       desc: 'Checkbox task' },
  { type: 'quote',      icon: Quote,        label: 'Blockquote',  desc: 'Blockquote' },
  { type: 'callout',    icon: Lightbulb,    label: 'Callout',     desc: 'Highlighted note' },
  { type: 'toggle',     icon: ChevronRight, label: 'Toggle',      desc: 'Collapsible block' },
  { type: 'code',       icon: Code,         label: 'Code',        desc: 'Code with syntax highlighting' },
  { type: 'table',      icon: Table,        label: 'Table',       desc: 'Simple table' },
  { type: 'divider',    icon: Minus,        label: 'Divider',     desc: 'Horizontal rule' },
  { type: 'page',       icon: FileText,     label: 'Sub-page',    desc: 'Nested page link' },
];

export default function SlashMenu({ query = '', rect, onSelect, onClose }) {
  const [active, setActive] = useState(0);
  const menuRef = useRef(null);

  const items = ALL_ITEMS.filter(item =>
    !query || item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, items.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === 'Enter')     { e.preventDefault(); if (items[active]) onSelect(items[active].type); }
      if (e.key === 'Escape')    { onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, items, onSelect, onClose]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const style = rect ? {
    position: 'fixed',
    top:  Math.min(rect.bottom + 6, window.innerHeight - 320),
    left: Math.min(rect.left, window.innerWidth - 260),
  } : {};

  if (items.length === 0) return null;

  return (
    <div ref={menuRef} className="slash-menu" style={style}>
      <div className="slash-menu__header">BLOCKS</div>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <button
            key={item.type}
            className={`slash-menu__item ${i === active ? 'slash-menu__item--active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onMouseDown={(e) => { e.preventDefault(); onSelect(item.type); }}
          >
            <span className="slash-menu__icon"><Icon size={16} strokeWidth={2} /></span>
            <span className="slash-menu__info">
              <span className="slash-menu__label">{item.label}</span>
              <span className="slash-menu__desc">{item.desc}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
