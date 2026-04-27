const sanitizeNote = require('../middleware/sanitize');

// Helper: run middleware synchronously
const run = (body) => {
  const req  = { body };
  const next = jest.fn();
  sanitizeNote(req, {}, next);
  return { req, next };
};

describe('sanitizeNote middleware', () => {
  it('strips script tags from title', () => {
    const { req } = run({ title: '<script>alert(1)</script>Hello' });
    expect(req.body.title).not.toContain('<script>');
    expect(req.body.title).toContain('Hello');
  });

  it('strips HTML from content', () => {
    const { req } = run({ content: '<img src=x onerror=alert(1)>text' });
    expect(req.body.content).not.toContain('<img');
    expect(req.body.content).toContain('text');
  });

  it('sanitizes each tag in the tags array', () => {
    const { req } = run({ tags: ['<b>bold</b>', 'normal'] });
    expect(req.body.tags[0]).not.toContain('<b>');
    expect(req.body.tags[1]).toBe('normal');
  });

  it('sanitizes block content', () => {
    const { req } = run({
      blocks: [{ id: '1', type: 'text', content: '<script>evil()</script>safe' }],
    });
    expect(req.body.blocks[0].content).not.toContain('<script>');
    expect(req.body.blocks[0].content).toContain('safe');
  });

  it('preserves non-string fields in blocks', () => {
    const { req } = run({
      blocks: [{ id: '1', type: 'todo', content: 'task', checked: true }],
    });
    expect(req.body.blocks[0].checked).toBe(true);
    expect(req.body.blocks[0].id).toBe('1');
  });

  it('calls next()', () => {
    const { next } = run({ title: 'clean' });
    expect(next).toHaveBeenCalled();
  });

  it('handles missing fields gracefully', () => {
    const { req, next } = run({});
    expect(next).toHaveBeenCalled();
    expect(req.body.title).toBeUndefined();
  });
});
