import { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import DOMPurify from 'dompurify';
// Register common languages only (keeps bundle small)
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python     from 'highlight.js/lib/languages/python';
import css        from 'highlight.js/lib/languages/css';
import xml        from 'highlight.js/lib/languages/xml'; // html
import json       from 'highlight.js/lib/languages/json';
import bash       from 'highlight.js/lib/languages/bash';
import sql        from 'highlight.js/lib/languages/sql';
import rust       from 'highlight.js/lib/languages/rust';
import go         from 'highlight.js/lib/languages/go';
import java       from 'highlight.js/lib/languages/java';
import cpp        from 'highlight.js/lib/languages/cpp';
import './CodeBlock.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python',     python);
hljs.registerLanguage('css',        css);
hljs.registerLanguage('html',       xml);
hljs.registerLanguage('json',       json);
hljs.registerLanguage('bash',       bash);
hljs.registerLanguage('sql',        sql);
hljs.registerLanguage('rust',       rust);
hljs.registerLanguage('go',         go);
hljs.registerLanguage('java',       java);
hljs.registerLanguage('cpp',        cpp);

const LANGUAGES = [
  'plaintext','javascript','typescript','python','html','css',
  'json','bash','sql','rust','go','java','cpp',
];

export default function CodeBlock({ block, isFocused, onUpdate, onFocus, onBlur, onKeyDown }) {
  const [editing, setEditing]   = useState(isFocused);
  const textareaRef             = useRef(null);
  const lang                    = block.language || 'plaintext';

  useEffect(() => {
    if (isFocused) { setEditing(true); textareaRef.current?.focus(); }
  }, [isFocused]);

  const highlighted = lang !== 'plaintext' && block.content
    ? DOMPurify.sanitize(
        hljs.highlight(block.content, { language: lang, ignoreIllegals: true }).value,
        { ALLOWED_TAGS: ['span'], ALLOWED_ATTR: ['class'] }
      )
    : escapeHtml(block.content || '');

  return (
    <div className="cb-wrap">
      <div className="cb-toolbar">
        <select
          className="cb-lang-select"
          value={lang}
          onChange={e => onUpdate({ language: e.target.value })}
          onMouseDown={e => e.stopPropagation()}
        >
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <button
          className="cb-copy-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(block.content || '');
          }}
          title="Copy code"
        >
          Copy
        </button>
      </div>

      {editing ? (
        <textarea
          ref={textareaRef}
          className="cb-textarea"
          value={block.content || ''}
          placeholder="// Write code here…"
          onChange={e => onUpdate({ content: e.target.value })}
          onKeyDown={(e) => {
            // Tab inserts 2 spaces instead of changing focus
            if (e.key === 'Tab') {
              e.preventDefault();
              const { selectionStart: s, selectionEnd: end, value } = e.target;
              const next = value.slice(0, s) + '  ' + value.slice(end);
              onUpdate({ content: next });
              // restore caret
              requestAnimationFrame(() => {
                e.target.selectionStart = e.target.selectionEnd = s + 2;
              });
              return;
            }
            onKeyDown?.(e);
          }}
          onFocus={onFocus}
          onBlur={() => { setEditing(false); onBlur?.(); }}
          spellCheck={false}
        />
      ) : (
        <pre
          className="cb-pre"
          onClick={() => { setEditing(true); setTimeout(() => textareaRef.current?.focus(), 0); }}
        >
          <code
            className={`hljs language-${lang}`}
            dangerouslySetInnerHTML={{ __html: highlighted || '<span class="cb-placeholder">// Write code here…</span>' }}
          />
        </pre>
      )}
    </div>
  );
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
