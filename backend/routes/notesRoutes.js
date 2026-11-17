const { addNotes, getNotes, updateNotes, getNote , deleteNote } = require('../controllers/notesControllers');
const router = require('express').Router();


router.get('/', getNotes);
router.post('/', addNotes);
router.put('/:id', updateNotes);
router.delete('/:id', deleteNote);
router.get('/:id', getNote);

module.exports = router;