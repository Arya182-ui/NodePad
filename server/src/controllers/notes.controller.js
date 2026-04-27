const { getFirestore } = require('../config/firebase');
const { deleteImage }  = require('../config/cloudinary');

const db = getFirestore();

// helper: user's notes collection
const userNotes = (uid) => db.collection('users').doc(uid).collection('notes');

// ── helpers ──────────────────────────────────────────────────────────────────

// Extract all Cloudinary public IDs from a note's blocks + images array
const extractPublicIds = (note) => {
  const ids = [];
  if (Array.isArray(note.images)) {
    note.images.forEach(img => { if (img.publicId) ids.push(img.publicId); });
  }
  if (Array.isArray(note.blocks)) {
    note.blocks.forEach(b => { if (b.publicId) ids.push(b.publicId); });
  }
  return ids;
};

// ── getAllNotes (with cursor-based pagination) ────────────────────────────────
const getAllNotes = async (req, res, next) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 50, 100);
    const cursor = req.query.cursor; // last doc updatedAt ISO string

    console.log('Fetching notes for user:', req.user.uid);

    let query = userNotes(req.user.uid)
      .where('deleted', '==', false)
      .orderBy('updatedAt', 'desc')
      .limit(limit + 1); // fetch one extra to detect next page

    if (cursor) {
      query = query.startAfter(cursor);
    }

    const snapshot = await query.get();
    const docs     = snapshot.docs;
    const hasMore  = docs.length > limit;
    const results  = (hasMore ? docs.slice(0, limit) : docs)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    const nextCursor = hasMore ? results[results.length - 1].updatedAt : null;

    console.log('Found', results.length, 'notes');
    res.json({ success: true, count: results.length, data: results, nextCursor });
  } catch (err) { 
    console.error('Get all notes error:', err);
    next(err); 
  }
};

// ── getNoteById ───────────────────────────────────────────────────────────────
const getNoteById = async (req, res, next) => {
  try {
    const doc = await userNotes(req.user.uid).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (err) { next(err); }
};

// ── createNote ────────────────────────────────────────────────────────────────
const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, blocks, icon, cover, parentId } = req.body;
    const now = new Date().toISOString();

    const noteData = {
      title:     title    || 'Untitled',
      content:   content  || '',
      blocks:    blocks   || [],
      tags:      tags     || [],
      images:    [],
      icon:      icon     || '',
      cover:     cover    || '',
      parentId:  parentId || null,
      deleted:   false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    console.log('Creating note for user:', req.user.uid);
    console.log('Note data:', JSON.stringify(noteData, null, 2));

    const ref = await userNotes(req.user.uid).add(noteData);
    console.log('Note created with ID:', ref.id);
    
    res.status(201).json({ success: true, data: { id: ref.id, ...noteData } });
  } catch (err) { 
    console.error('Create note error:', err);
    next(err); 
  }
};

// ── updateNote (saves a version snapshot before updating) ────────────────────
const MAX_VERSIONS = 20;

const updateNote = async (req, res, next) => {
  try {
    const col = userNotes(req.user.uid);
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Note not found' });

    const prev = doc.data();
    const { title, content, tags, images, blocks, icon, cover, parentId } = req.body;
    const patch = {
      ...(title    !== undefined && { title }),
      ...(content  !== undefined && { content }),
      ...(tags     !== undefined && { tags }),
      ...(images   !== undefined && { images }),
      ...(blocks   !== undefined && { blocks }),
      ...(icon     !== undefined && { icon }),
      ...(cover    !== undefined && { cover }),
      ...(parentId !== undefined && { parentId }),
      updatedAt: new Date().toISOString(),
    };

    console.log('Updating note:', req.params.id, 'for user:', req.user.uid);
    console.log('Update data:', JSON.stringify(patch, null, 2));

    // Save version snapshot (fire-and-forget, don't block the response)
    const versionsCol = col.doc(req.params.id).collection('versions');
    versionsCol.add({
      title:     prev.title,
      blocks:    prev.blocks || [],
      content:   prev.content || '',
      savedAt:   new Date().toISOString(),
    }).then(async () => {
      // Prune old versions — keep only the latest MAX_VERSIONS
      const snap = await versionsCol.orderBy('savedAt', 'desc').offset(MAX_VERSIONS).get();
      const batch = db.batch();
      snap.docs.forEach(d => batch.delete(d.ref));
      if (!snap.empty) await batch.commit();
    }).catch((err) => {
      console.error('Version save error:', err);
    });

    await col.doc(req.params.id).update(patch);
    const updated = await col.doc(req.params.id).get();
    console.log('Note updated successfully');
    
    res.json({ success: true, data: { id: updated.id, ...updated.data() } });
  } catch (err) { 
    console.error('Update note error:', err);
    next(err); 
  }
};

// ── deleteNote (soft delete) ──────────────────────────────────────────────────
const deleteNote = async (req, res, next) => {
  try {
    const col = userNotes(req.user.uid);
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Note not found' });

    await col.doc(req.params.id).update({
      deleted:   true,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, message: 'Note moved to trash' });
  } catch (err) { next(err); }
};

// ── restoreNote ───────────────────────────────────────────────────────────────
const restoreNote = async (req, res, next) => {
  try {
    const col = userNotes(req.user.uid);
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Note not found' });

    await col.doc(req.params.id).update({
      deleted:   false,
      deletedAt: null,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, message: 'Note restored' });
  } catch (err) { next(err); }
};

// ── permanentDelete (hard delete + Cloudinary cleanup) ────────────────────────
const permanentDelete = async (req, res, next) => {
  try {
    const col = userNotes(req.user.uid);
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Note not found' });

    // Clean up Cloudinary images before deleting the document
    const publicIds = extractPublicIds(doc.data());
    await Promise.allSettled(publicIds.map(id => deleteImage(id)));

    await col.doc(req.params.id).delete();
    res.json({ success: true, message: 'Note permanently deleted' });
  } catch (err) { next(err); }
};

// ── getTrash ──────────────────────────────────────────────────────────────────
const getTrash = async (req, res, next) => {
  try {
    const snapshot = await userNotes(req.user.uid)
      .where('deleted', '==', true)
      .orderBy('deletedAt', 'desc')
      .get();
    const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: notes });
  } catch (err) { next(err); }
};

// ── duplicateNote ─────────────────────────────────────────────────────────────
const duplicateNote = async (req, res, next) => {
  try {
    const col = userNotes(req.user.uid);
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Note not found' });

    const data = doc.data();
    const now  = new Date().toISOString();
    const copy = {
      ...data,
      title:     `${data.title || 'Untitled'} (Copy)`,
      images:    [], // don't copy image references — they belong to the original
      createdAt: now,
      updatedAt: now,
      deleted:   false,
      deletedAt: null,
    };

    const ref = await col.add(copy);
    res.status(201).json({ success: true, data: { id: ref.id, ...copy } });
  } catch (err) { next(err); }
};

// ── searchNotes (server-side Firestore query) ─────────────────────────────────
// Firestore doesn't support full-text search natively, so we use a title prefix
// query for fast results + a tag array-contains for tag search.
// For content search we fall back to a filtered scan (acceptable for moderate data).
const searchNotes = async (req, res, next) => {
  try {
    const { q, tag } = req.query;
    if (!q && !tag) return res.status(400).json({ success: false, message: 'Query required' });

    const col = userNotes(req.user.uid);

    if (tag) {
      // Exact tag search — Firestore array-contains is efficient
      const snapshot = await col
        .where('deleted', '!=', true)
        .where('tags', 'array-contains', tag)
        .orderBy('deleted')
        .orderBy('updatedAt', 'desc')
        .get();
      const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, count: notes.length, data: notes });
    }

    // Title prefix search using Firestore range query (case-sensitive, fast)
    const term      = q.trim();
    const termUpper = term + '\uf8ff'; // Unicode sentinel for prefix range

    const [titleSnap, contentSnap] = await Promise.all([
      col
        .where('deleted', '!=', true)
        .where('title', '>=', term)
        .where('title', '<=', termUpper)
        .orderBy('deleted')
        .orderBy('title')
        .limit(50)
        .get(),
      // Content search: still needs a scan but limited to non-deleted notes
      col
        .where('deleted', '!=', true)
        .orderBy('deleted')
        .orderBy('updatedAt', 'desc')
        .limit(200) // cap scan at 200 docs
        .get(),
    ]);

    const termLower = term.toLowerCase();
    const titleIds  = new Set();
    const results   = [];

    titleSnap.docs.forEach(doc => {
      titleIds.add(doc.id);
      results.push({ id: doc.id, ...doc.data() });
    });

    contentSnap.docs.forEach(doc => {
      if (titleIds.has(doc.id)) return; // already included
      const d = doc.data();
      const matches =
        d.content?.toLowerCase().includes(termLower) ||
        d.tags?.some(t => t.toLowerCase().includes(termLower));
      if (matches) results.push({ id: doc.id, ...d });
    });

    res.json({ success: true, count: results.length, data: results });
  } catch (err) { next(err); }
};

// ── getVersions ───────────────────────────────────────────────────────────────
const getVersions = async (req, res, next) => {
  try {
    const snap = await userNotes(req.user.uid)
      .doc(req.params.id)
      .collection('versions')
      .orderBy('savedAt', 'desc')
      .limit(20)
      .get();
    const versions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, data: versions });
  } catch (err) { next(err); }
};

// ── restoreVersion ────────────────────────────────────────────────────────────
const restoreVersion = async (req, res, next) => {
  try {
    const col     = userNotes(req.user.uid);
    const noteDoc = await col.doc(req.params.id).get();
    if (!noteDoc.exists) return res.status(404).json({ success: false, message: 'Note not found' });

    const verDoc = await col.doc(req.params.id).collection('versions').doc(req.params.versionId).get();
    if (!verDoc.exists) return res.status(404).json({ success: false, message: 'Version not found' });

    const ver = verDoc.data();
    await col.doc(req.params.id).update({
      title:     ver.title,
      blocks:    ver.blocks,
      content:   ver.content,
      updatedAt: new Date().toISOString(),
    });

    const updated = await col.doc(req.params.id).get();
    res.json({ success: true, data: { id: updated.id, ...updated.data() } });
  } catch (err) { next(err); }
};

// ── createShareLink ───────────────────────────────────────────────────────────
const createShareLink = async (req, res, next) => {
  try {
    const col = userNotes(req.user.uid);
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Note not found' });

    // Generate a unique share ID
    const shareId = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
    
    const shareData = {
      noteId: req.params.id,
      ownerId: req.user.uid,
      shareId,
      createdAt: new Date().toISOString(),
      expiresAt: null, // No expiration by default
    };

    // Store share link in a separate collection
    await db.collection('sharedNotes').doc(shareId).set(shareData);

    // Update note with share info
    await col.doc(req.params.id).update({
      shared: true,
      shareId,
      updatedAt: new Date().toISOString(),
    });

    res.json({ 
      success: true, 
      data: { 
        shareId,
        shareUrl: `${req.protocol}://${req.get('host')}/shared/${shareId}`
      } 
    });
  } catch (err) { next(err); }
};

// ── getSharedNote (public access, no auth required) ───────────────────────────
const getSharedNote = async (req, res, next) => {
  try {
    const shareDoc = await db.collection('sharedNotes').doc(req.params.shareId).get();
    if (!shareDoc.exists) {
      return res.status(404).json({ success: false, message: 'Shared note not found' });
    }

    const shareData = shareDoc.data();
    
    // Check if expired
    if (shareData.expiresAt && new Date(shareData.expiresAt) < new Date()) {
      return res.status(410).json({ success: false, message: 'Share link has expired' });
    }

    // Get the actual note
    const noteDoc = await db
      .collection('users')
      .doc(shareData.ownerId)
      .collection('notes')
      .doc(shareData.noteId)
      .get();

    if (!noteDoc.exists || noteDoc.data().deleted) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const noteData = noteDoc.data();
    
    // Return read-only version (remove sensitive fields)
    res.json({ 
      success: true, 
      data: {
        id: noteDoc.id,
        title: noteData.title,
        content: noteData.content,
        blocks: noteData.blocks,
        icon: noteData.icon,
        cover: noteData.cover,
        tags: noteData.tags,
        createdAt: noteData.createdAt,
        updatedAt: noteData.updatedAt,
        readOnly: true,
      }
    });
  } catch (err) { next(err); }
};

// ── revokeShareLink ───────────────────────────────────────────────────────────
const revokeShareLink = async (req, res, next) => {
  try {
    const col = userNotes(req.user.uid);
    const doc = await col.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Note not found' });

    const noteData = doc.data();
    if (noteData.shareId) {
      // Delete from shared collection
      await db.collection('sharedNotes').doc(noteData.shareId).delete();
    }

    // Update note
    await col.doc(req.params.id).update({
      shared: false,
      shareId: null,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Share link revoked' });
  } catch (err) { next(err); }
};

module.exports = {
  getAllNotes, getNoteById, createNote, updateNote, deleteNote,
  restoreNote, permanentDelete, getTrash, duplicateNote, searchNotes,
  getVersions, restoreVersion, createShareLink, getSharedNote, revokeShareLink,
};
