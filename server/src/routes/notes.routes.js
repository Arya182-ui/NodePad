const express = require('express');
const { body } = require('express-validator');
const {
  getAllNotes, getNoteById, createNote, updateNote, deleteNote,
  restoreNote, permanentDelete, getTrash, duplicateNote, searchNotes,
  getVersions, restoreVersion,
} = require('../controllers/notes.controller');
const validateRequest = require('../middleware/validateRequest');
const authenticate    = require('../middleware/auth.middleware');
const sanitizeNote    = require('../middleware/sanitize');

const router = express.Router();
router.use(authenticate);

const noteValidation = [
  body('title').optional().trim().isLength({ max: 200 }),
  body('content').optional().trim().isLength({ max: 100000 }),
  body('tags').optional().isArray(),
  body('tags.*').optional().trim().isLength({ max: 30 }),
];

router.get('/search',                           searchNotes);
router.get('/trash',                            getTrash);
router.get('/',                                 getAllNotes);
router.get('/:id',                              getNoteById);
router.post('/',                                noteValidation, validateRequest, sanitizeNote, createNote);
router.put('/:id',                              noteValidation, validateRequest, sanitizeNote, updateNote);
router.delete('/:id',                           deleteNote);
router.post('/:id/restore',                     restoreNote);
router.delete('/:id/permanent',                 permanentDelete);
router.post('/:id/duplicate',                   duplicateNote);
router.get('/:id/versions',                     getVersions);
router.post('/:id/versions/:versionId/restore', restoreVersion);

module.exports = router;