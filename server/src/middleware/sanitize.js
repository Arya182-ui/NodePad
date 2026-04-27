const xss = require('xss');

// XSS options — strip all HTML tags from plain text fields
const strictOpts = {
  whiteList: {},       // no tags allowed
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
};

const sanitizeStr = (val) =>
  typeof val === 'string' ? xss(val, strictOpts) : val;

const sanitizeBlocks = (blocks) => {
  if (!Array.isArray(blocks)) return blocks;
  return blocks.map(b => ({
    ...b,
    content: sanitizeStr(b.content),
  }));
};

// Middleware: sanitize note fields in req.body
const sanitizeNote = (req, _res, next) => {
  const { title, content, tags, blocks } = req.body;

  if (title   !== undefined) req.body.title   = sanitizeStr(title);
  if (content !== undefined) req.body.content = sanitizeStr(content);
  if (tags    !== undefined) req.body.tags    = Array.isArray(tags)
    ? tags.map(sanitizeStr)
    : tags;
  if (blocks  !== undefined) req.body.blocks  = sanitizeBlocks(blocks);

  next();
};

module.exports = sanitizeNote;
