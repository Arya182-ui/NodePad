import { describe, it, expect } from 'vitest';
import { blocksToMarkdown } from '../utils/exportNote';

describe('blocksToMarkdown', () => {
  it('renders title as H1', () => {
    const md = blocksToMarkdown('My Note', []);
    expect(md).toContain('# My Note');
  });

  it('renders heading blocks', () => {
    const blocks = [
      { type: 'heading1', content: 'Big' },
      { type: 'heading2', content: 'Medium' },
      { type: 'heading3', content: 'Small' },
    ];
    const md = blocksToMarkdown('', blocks);
    expect(md).toContain('# Big');
    expect(md).toContain('## Medium');
    expect(md).toContain('### Small');
  });

  it('renders todo with checked state', () => {
    const blocks = [
      { type: 'todo', content: 'Done', checked: true },
      { type: 'todo', content: 'Pending', checked: false },
    ];
    const md = blocksToMarkdown('', blocks);
    expect(md).toContain('- [x] Done');
    expect(md).toContain('- [ ] Pending');
  });

  it('renders code block with fences', () => {
    const blocks = [{ type: 'code', content: 'console.log("hi")' }];
    const md = blocksToMarkdown('', blocks);
    expect(md).toContain('```');
    expect(md).toContain('console.log("hi")');
  });

  it('renders bullet and number lists', () => {
    const blocks = [
      { type: 'bulletList', content: 'Item A' },
      { type: 'numberList', content: 'Item B' },
    ];
    const md = blocksToMarkdown('', blocks);
    expect(md).toContain('- Item A');
    expect(md).toContain('1. Item B');
  });

  it('renders divider as ---', () => {
    const blocks = [{ type: 'divider', content: '' }];
    const md = blocksToMarkdown('', blocks);
    expect(md).toContain('---');
  });

  it('renders quote with >', () => {
    const blocks = [{ type: 'quote', content: 'Wise words' }];
    const md = blocksToMarkdown('', blocks);
    expect(md).toContain('> Wise words');
  });

  it('includes icon when provided', () => {
    const md = blocksToMarkdown('Title', [], '📝');
    expect(md).toContain('📝');
  });

  it('handles empty blocks array', () => {
    const md = blocksToMarkdown('Empty', []);
    expect(md).toContain('# Empty');
  });
});
