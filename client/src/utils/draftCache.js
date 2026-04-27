// Lightweight offline draft cache using localStorage.
// Saves note drafts locally so edits aren't lost on network failure.

const KEY = (id) => `np_draft_${id}`;
const INDEX_KEY = 'np_draft_index';

export const saveDraft = (id, note) => {
  try {
    localStorage.setItem(KEY(id), JSON.stringify({ ...note, _savedAt: Date.now() }));
    // maintain an index of draft IDs
    const index = getDraftIndex();
    if (!index.includes(id)) {
      localStorage.setItem(INDEX_KEY, JSON.stringify([...index, id]));
    }
  } catch { /* storage full — silently ignore */ }
};

export const loadDraft = (id) => {
  try {
    const raw = localStorage.getItem(KEY(id));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const clearDraft = (id) => {
  try {
    localStorage.removeItem(KEY(id));
    const index = getDraftIndex().filter(x => x !== id);
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch { /* ignore */ }
};

export const getDraftIndex = () => {
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
  } catch { return []; }
};

export const hasDraft = (id) => !!loadDraft(id);
