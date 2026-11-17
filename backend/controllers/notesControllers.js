const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, '../data/notes.json');

const addNotes = async(req,res) => {
    const newNotes = {
        id: Date.now(),
        noteTitle: req.body.noteTitle,
        noteContent: req.body.noteContent,
        noteCategory: req.body.noteCategory,
        noteTags: req.body.noteTags,
        isPinned: false,
        isArchived: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    const notes = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    notes.push(newNotes);
    await fs.writeFile(filePath, JSON.stringify(notes, null, 2));
    res.status(201).json({
        message: 'Note created successfully',
        note: newNotes
    });
}


const getNotes = async (req, res) => {
    try {
        // Read all notes
        let notes = JSON.parse(await fs.readFile(filePath, 'utf-8'));

        // Get filter values from URL query parameters
        const search = (req.query.search || '').trim().toLowerCase();
        const category = (req.query.category || '').trim().toLowerCase();
        const tag = (req.query.tag || '').trim().toLowerCase();
        const sort = req.query.sort || 'newest';

        // 1. Search by title, content, or tags
        if (search) {
            notes = notes.filter(note => {
                const title = (note.noteTitle || '').toLowerCase();
                const content = (note.noteContent || '').toLowerCase();

                const tags = Array.isArray(note.noteTags)
                    ? note.noteTags
                    : typeof note.noteTags === 'string'
                        ? note.noteTags.split(',')
                        : [];

                const tagMatches = tags.some(item =>
                    String(item).toLowerCase().includes(search)
                );

                return (
                    title.includes(search) ||
                    content.includes(search) ||
                    tagMatches
                );
            });
        }

        // 2. Filter by category
        if (category && category !== 'all') {
            notes = notes.filter(note =>
                (note.noteCategory || '').toLowerCase() === category
            );
        }

        // 3. Filter by exact tag
        if (tag) {
            notes = notes.filter(note => {
                const tags = Array.isArray(note.noteTags)
                    ? note.noteTags
                    : typeof note.noteTags === 'string'
                        ? note.noteTags.split(',')
                        : [];

                return tags.some(item =>
                    String(item).trim().toLowerCase() === tag
                );
            });
        }

        // 4. Sort notes
        notes.sort((a, b) => {
            switch (sort) {
                case 'oldest':
                    return (a.createdAt || 0) - (b.createdAt || 0);

                case 'title-asc':
                    return (a.noteTitle || '').localeCompare(b.noteTitle || '');

                case 'title-desc':
                    return (b.noteTitle || '').localeCompare(a.noteTitle || '');

                case 'newest':
                default:
                    return (b.updatedAt || b.createdAt || 0) -
                           (a.updatedAt || a.createdAt || 0);
            }
        });

        res.status(200).json(notes);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching notes',
            error: error.message
        });
    }
};



const updateNotes = async (req, res) => {
    try {
        const notes = JSON.parse(await fs.readFile(filePath, 'utf-8'));

        const note = notes.find(note => note.id == req.params.id);

        if (!note) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        const allowedFields = [
            'noteTitle',
            'noteContent',
            'noteCategory',
            'noteTags',
            'isPinned',
            'isArchived',
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                note[field] = req.body[field];
            }
        });

        await fs.writeFile(
            filePath,
            JSON.stringify(notes, null, 2)
        );

        res.status(200).json({
            message: 'Note updated successfully',
            note
        });

    } catch (error) {
        res.status(500).json({
            message: 'Unable to update note',
            error: error.message
        });
    }
};


const getNote = async(req,res) => {
    const notes = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const note = notes.find(note => note.id == req.params.id);
    res.status(200).json(note);
}

const deleteNote = async(req,res) => {
    const notes = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const updatedNotes = notes.filter(
        note => note.id != req.params.id
    );
    await fs.writeFile(filePath, JSON.stringify(updatedNotes, null, 2));
    res.status(200).json({
        message: 'Note deleted successfully'
    });
}

module.exports = {addNotes, getNotes, updateNotes, getNote, deleteNote}