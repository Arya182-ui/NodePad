import { X, FileText } from 'lucide-react';
import './TemplatesModal.css';

const TEMPLATES = [
  {
    id: 'meeting',
    label: 'Meeting Notes',
    icon: '📋',
    tags: ['meeting'],
    blocks: [
      { type: 'heading1', content: 'Meeting Notes' },
      { type: 'text',     content: '' },
      { type: 'heading2', content: 'Attendees' },
      { type: 'bulletList', content: '' },
      { type: 'heading2', content: 'Agenda' },
      { type: 'numberList', content: '' },
      { type: 'heading2', content: 'Action Items' },
      { type: 'todo', content: '', checked: false },
      { type: 'todo', content: '', checked: false },
      { type: 'heading2', content: 'Notes' },
      { type: 'text', content: '' },
    ],
  },
  {
    id: 'todo',
    label: 'To-Do List',
    icon: '✅',
    tags: ['tasks'],
    blocks: [
      { type: 'heading1', content: 'To-Do List' },
      { type: 'text',     content: '' },
      { type: 'heading2', content: 'Today' },
      { type: 'todo', content: '', checked: false },
      { type: 'todo', content: '', checked: false },
      { type: 'todo', content: '', checked: false },
      { type: 'heading2', content: 'This Week' },
      { type: 'todo', content: '', checked: false },
      { type: 'todo', content: '', checked: false },
      { type: 'heading2', content: 'Someday' },
      { type: 'todo', content: '', checked: false },
    ],
  },
  {
    id: 'journal',
    label: 'Daily Journal',
    icon: '📔',
    tags: ['journal'],
    blocks: [
      { type: 'heading1', content: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) },
      { type: 'heading2', content: 'Gratitude' },
      { type: 'bulletList', content: '' },
      { type: 'heading2', content: "Today's Focus" },
      { type: 'callout', content: '' },
      { type: 'heading2', content: 'Notes' },
      { type: 'text', content: '' },
      { type: 'heading2', content: 'End of Day Reflection' },
      { type: 'text', content: '' },
    ],
  },
  {
    id: 'project',
    label: 'Project Plan',
    icon: '🚀',
    tags: ['project'],
    blocks: [
      { type: 'heading1', content: 'Project Plan' },
      { type: 'callout', content: 'Describe the project goal here.' },
      { type: 'heading2', content: 'Overview' },
      { type: 'text', content: '' },
      { type: 'heading2', content: 'Goals' },
      { type: 'bulletList', content: '' },
      { type: 'heading2', content: 'Timeline' },
      { type: 'table', table: {
        headers: ['Phase', 'Task', 'Owner', 'Due Date'],
        rows: [['', '', '', ''], ['', '', '', '']],
      }},
      { type: 'heading2', content: 'Risks' },
      { type: 'bulletList', content: '' },
    ],
  },
  {
    id: 'readme',
    label: 'README / Docs',
    icon: '📖',
    tags: ['docs'],
    blocks: [
      { type: 'heading1', content: 'Project Name' },
      { type: 'text', content: 'Short description of what this project does.' },
      { type: 'heading2', content: 'Getting Started' },
      { type: 'code', content: 'npm install\nnpm run dev', language: 'bash' },
      { type: 'heading2', content: 'Features' },
      { type: 'bulletList', content: '' },
      { type: 'heading2', content: 'Contributing' },
      { type: 'text', content: '' },
    ],
  },
  {
    id: 'blank',
    label: 'Blank Page',
    icon: '📄',
    tags: [],
    blocks: [{ type: 'text', content: '' }],
  },
];

export { TEMPLATES };

export default function TemplatesModal({ onSelect, onClose }) {
  return (
    <div
      className="tm-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Choose a template"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="tm-modal">
        <div className="tm-header">
          <span className="tm-title">Start from a template</span>
          <button className="tm-close" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="tm-grid">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              className="tm-card"
              onClick={() => { onSelect(t); onClose(); }}
            >
              <span className="tm-card__icon">{t.icon}</span>
              <span className="tm-card__label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
