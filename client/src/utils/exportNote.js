// Convert blocks to Markdown
export function blocksToMarkdown(title, blocks = [], icon = '') {
  const lines = [];

  if (icon) lines.push(`${icon}\n`);
  if (title) lines.push(`# ${title}\n`);
  lines.push('');

  for (const block of blocks) {
    const c = block.content || '';
    switch (block.type) {
      case 'heading1':   lines.push(`# ${c}`);       break;
      case 'heading2':   lines.push(`## ${c}`);      break;
      case 'heading3':   lines.push(`### ${c}`);     break;
      case 'bulletList': lines.push(`- ${c}`);       break;
      case 'numberList': lines.push(`1. ${c}`);      break;
      case 'todo':       lines.push(`- [${block.checked ? 'x' : ' '}] ${c}`); break;
      case 'quote':      lines.push(`> ${c}`);       break;
      case 'code':       lines.push(`\`\`\`\n${c}\n\`\`\``); break;
      case 'divider':    lines.push('---');           break;
      case 'callout':    lines.push(`> 💡 ${c}`);    break;
      case 'toggle':     lines.push(`**${c}**`);     break;
      default:           lines.push(c);              break;
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function downloadMarkdown(note) {
  const md       = blocksToMarkdown(note.title, note.blocks, note.icon);
  const blob     = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement('a');
  a.href         = url;
  a.download     = `${note.title || 'untitled'}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadText(note) {
  const text     = note.blocks?.map(b => b.content).filter(Boolean).join('\n\n') || '';
  const blob     = new Blob([`${note.title}\n\n${text}`], { type: 'text/plain;charset=utf-8' });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement('a');
  a.href         = url;
  a.download     = `${note.title || 'untitled'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
