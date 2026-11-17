
const API_URL = '/api/notes';

// =========================
// DOM ELEMENTS
// =========================

const noteForm = document.getElementById('noteForm');
const noteFormSection = document.getElementById('noteFormSection');

const notesContainer = document.getElementById('notesContainer');
const pinnedNotesContainer = document.getElementById('pinnedNotesContainer');
const archivedNotesContainer = document.getElementById('archivedNotesContainer');

const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const noteCategory = document.getElementById('noteCategory');
const noteTags = document.getElementById('noteTags');

const formHeading = document.getElementById('formHeading');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');

const refreshBtn = document.getElementById('refreshBtn');
const message = document.getElementById('message');

const searchInput = document.getElementById('searchInput');

const newNoteBtn = document.getElementById('newNoteBtn');
const createNoteBtn = document.getElementById('createNoteBtn');

const pageTitle = document.getElementById('pageTitle');
const sectionHeading = document.getElementById('sectionHeading');
const notesHeading = document.getElementById('notesHeading');

const pinnedSection = document.getElementById('pinnedSection');
const activeNotesSection = document.getElementById('activeNotesSection');
const archivedSection = document.getElementById('archivedSection');

const sidebarLinks = document.querySelectorAll('.nav-link');

// Optional filters: these elements are not currently in your new HTML.
const categoryFilter = document.getElementById('categoryFilter');
const tagFilter = document.getElementById('tagFilter');
const sortFilter = document.getElementById('sortFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');


// =========================
// STATE
// =========================

let editingNoteId = null;

let currentView = 'all';
let currentCategory = null;

let searchTimeout;


// =========================
// GET ALL NOTES
// =========================

async function getNotes() {
    try {
        const params = new URLSearchParams();

        const search = searchInput.value.trim();

        if (search) {
            params.append('search', search);
        }

        // Support old filter controls if they are added again.
        if (categoryFilter && categoryFilter.value !== 'all') {
            params.append('category', categoryFilter.value);
        }

        if (tagFilter && tagFilter.value.trim()) {
            params.append('tag', tagFilter.value.trim());
        }

        if (sortFilter && sortFilter.value) {
            params.append('sort', sortFilter.value);
        }

        const queryString = params.toString();

        const url = queryString
            ? `${API_URL}?${queryString}`
            : API_URL;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }

        const notes = await response.json();

        displayNotes(notes);

        message.textContent = '';

    } catch (error) {
        console.error('Error fetching notes:', error);
        message.textContent = 'Unable to load notes. Please try again.';
    }
}


// =========================
// DISPLAY NOTES
// =========================

function displayNotes(notes) {

    pinnedNotesContainer.innerHTML = '';
    notesContainer.innerHTML = '';
    archivedNotesContainer.innerHTML = '';

    // Apply sidebar category filter.
    let filteredNotes = notes;

    if (currentCategory) {
        filteredNotes = notes.filter(note =>
            note.noteCategory === currentCategory
        );
    }

    const archivedNotes = filteredNotes.filter(note => note.isArchived);

    const activeNotes = filteredNotes.filter(note => !note.isArchived);

    const pinnedNotes = activeNotes.filter(note => note.isPinned);

    const otherNotes = activeNotes.filter(note => !note.isPinned);


    // Control which sections are visible.
    pinnedSection.style.display = 'block';
    activeNotesSection.style.display = 'block';
    archivedSection.style.display = 'block';


    if (currentView === 'pinned') {

        pinnedSection.style.display = 'block';
        activeNotesSection.style.display = 'none';
        archivedSection.style.display = 'none';

        renderEmptyOrNotes(
            pinnedNotes,
            pinnedNotesContainer,
            'No pinned notes.'
        );

        return;
    }


    if (currentView === 'archived') {

        pinnedSection.style.display = 'none';
        activeNotesSection.style.display = 'none';
        archivedSection.style.display = 'block';

        renderEmptyOrNotes(
            archivedNotes,
            archivedNotesContainer,
            'No archived notes.'
        );

        return;
    }


    // All Notes or a selected category.

    renderEmptyOrNotes(
        pinnedNotes,
        pinnedNotesContainer,
        'No pinned notes.'
    );

    renderEmptyOrNotes(
        otherNotes,
        notesContainer,
        'No other notes available.'
    );

    renderEmptyOrNotes(
        archivedNotes,
        archivedNotesContainer,
        'No archived notes.'
    );
}


// =========================
// RENDER EMPTY STATE OR NOTES
// =========================

function renderEmptyOrNotes(notes, container, emptyMessage) {

    container.innerHTML = '';

    if (notes.length === 0) {
        container.textContent = emptyMessage;
    } else {
        renderNotes(notes, container);
    }
}


// =========================
// RENDER NOTE CARDS
// =========================

function renderNotes(notes, container) {

    notes.forEach(note => {

        const card = document.createElement('div');
        card.className = 'note-card';


        // TITLE
        const title = document.createElement('h3');
        title.textContent = note.noteTitle;


        // CONTENT
        const content = document.createElement('p');
        content.textContent = note.noteContent;


        // CATEGORY
        const category = document.createElement('div');
        category.className = 'note-category';
        category.textContent = note.noteCategory || 'Uncategorized';


        // TAGS CONTAINER
        const tags = document.createElement('div');
        tags.className = 'note-tags';

        const tagList = Array.isArray(note.noteTags)
            ? note.noteTags
            : (note.noteTags ? [note.noteTags] : []);

        if (tagList.length === 0) {

            const noTags = document.createElement('span');
            noTags.className = 'note-tag';
            noTags.textContent = 'No tags';

            tags.appendChild(noTags);

        } else {

            tagList.forEach(tag => {

                const tagElement = document.createElement('span');
                tagElement.className = 'note-tag';
                tagElement.textContent = tag;

                tags.appendChild(tagElement);

            });
        }


        // ACTION BUTTONS
        const actions = document.createElement('div');
        actions.className = 'note-actions';


        // PIN BUTTON
        const pinBtn = document.createElement('button');

        pinBtn.textContent = note.isPinned ? 'Unpin' : 'Pin';

        pinBtn.addEventListener('click', () => {
            togglePin(note);
        });


        // EDIT BUTTON
        const editBtn = document.createElement('button');

        editBtn.textContent = 'Edit';

        editBtn.addEventListener('click', () => {
            editNote(note);
        });


        // DELETE BUTTON
        const deleteBtn = document.createElement('button');

        deleteBtn.textContent = 'Delete';

        deleteBtn.addEventListener('click', () => {
            deleteNote(note.id);
        });


        // ARCHIVE BUTTON
        const archiveBtn = document.createElement('button');

        archiveBtn.textContent = note.isArchived
            ? 'Unarchive'
            : 'Archive';

        archiveBtn.addEventListener('click', () => {
            toggleArchive(note);
        });


        actions.append(pinBtn, editBtn, archiveBtn, deleteBtn);

        card.append(title, category, content, tags, actions);

        container.appendChild(card);
    });
}


// =========================
// OPEN NOTE FORM
// =========================

function openNoteForm() {

    noteForm.reset();

    editingNoteId = null;

    formHeading.textContent = 'Create a New Note';
    submitBtn.textContent = 'Save Note';

    noteFormSection.style.display = 'block';

    noteFormSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    noteTitle.focus();
}


// =========================
// CLOSE NOTE FORM
// =========================

function closeNoteForm() {

    resetForm();

    noteFormSection.style.display = 'none';
}


// =========================
// CREATE / UPDATE NOTE
// =========================

noteForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const noteData = {

        noteTitle: noteTitle.value.trim(),

        noteContent: noteContent.value.trim(),

        noteCategory: noteCategory.value.trim(),

        noteTags: noteTags.value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '')

    };


    try {

        const url = editingNoteId
            ? `${API_URL}/${editingNoteId}`
            : API_URL;

        const method = editingNoteId ? 'PUT' : 'POST';


        const response = await fetch(url, {

            method,

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(noteData)

        });


        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Operation failed');
        }


        message.textContent = result.message;

        closeNoteForm();

        getNotes();


    } catch (error) {

        message.textContent = error.message;

    }

});


// =========================
// EDIT NOTE
// =========================

function editNote(note) {

    // Switch back to All Notes view.
    currentView = 'all';
    currentCategory = null;

    updateSidebarActiveState('all');

    updatePageHeading('All Notes');

    editingNoteId = note.id;


    noteTitle.value = note.noteTitle;

    noteContent.value = note.noteContent;

    noteCategory.value = note.noteCategory || '';

    noteTags.value = Array.isArray(note.noteTags)
        ? note.noteTags.join(', ')
        : note.noteTags || '';


    formHeading.textContent = 'Edit Note';

    submitBtn.textContent = 'Update Note';


    noteFormSection.style.display = 'block';

    noteFormSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

}


// =========================
// RESET FORM
// =========================

function resetForm() {

    noteForm.reset();

    editingNoteId = null;

    formHeading.textContent = 'Create a New Note';

    submitBtn.textContent = 'Save Note';

}


// =========================
// DELETE NOTE
// =========================

async function deleteNote(id) {

    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });


        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to delete note');
        }


        message.textContent = result.message;

        getNotes();


    } catch (error) {

        message.textContent = error.message;

    }
}


// =========================
// PIN / UNPIN NOTE
// =========================

async function togglePin(note) {

    try {

        const response = await fetch(`${API_URL}/${note.id}`, {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                isPinned: !note.isPinned
            })

        });


        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to update pin');
        }


        getNotes();


    } catch (error) {

        message.textContent = error.message;

    }
}


// =========================
// ARCHIVE / UNARCHIVE NOTE
// =========================

async function toggleArchive(note) {

    try {

        const response = await fetch(`${API_URL}/${note.id}`, {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                isArchived: !note.isArchived
            })

        });


        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to archive note');
        }


        getNotes();


    } catch (error) {

        message.textContent = error.message;

    }
}


// =========================
// SIDEBAR NAVIGATION
// =========================

function updateSidebarActiveState(selectedView, selectedCategory = null) {

    sidebarLinks.forEach(link => {

        link.classList.remove('active');

        const linkView = link.dataset.view;
        const linkCategory = link.dataset.category;

        if (
            linkView === selectedView &&
            !selectedCategory
        ) {
            link.classList.add('active');
        }

        if (
            linkCategory &&
            linkCategory === selectedCategory
        ) {
            link.classList.add('active');
        }

    });

}


function updatePageHeading(heading) {

    pageTitle.textContent = heading;

    sectionHeading.textContent = heading;

    if (heading === 'All Notes') {
        notesHeading.textContent = 'Your Notes';
    } else {
        notesHeading.textContent = heading;
    }

}


sidebarLinks.forEach(link => {

    link.addEventListener('click', (e) => {

        e.preventDefault();

        const view = link.dataset.view;
        const category = link.dataset.category;


        if (view) {

            currentView = view;
            currentCategory = null;

            updatePageHeading(
                view === 'all'
                    ? 'All Notes'
                    : view === 'pinned'
                        ? 'Pinned Notes'
                        : 'Archived Notes'
            );

            updateSidebarActiveState(view);

        } else if (category) {

            currentView = 'all';
            currentCategory = category;

            updatePageHeading(category);

            updateSidebarActiveState(null, category);

        }


        getNotes();

    });

});


// =========================
// NEW NOTE BUTTONS
// =========================

newNoteBtn.addEventListener('click', openNoteForm);

createNoteBtn.addEventListener('click', openNoteForm);


// =========================
// CANCEL BUTTONS
// =========================

cancelBtn.addEventListener('click', closeNoteForm);

cancelFormBtn.addEventListener('click', closeNoteForm);


// =========================
// REFRESH NOTES
// =========================

refreshBtn.addEventListener('click', getNotes);


// =========================
// SEARCH
// =========================

searchInput.addEventListener('input', () => {

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        getNotes();
    }, 300);

});


// =========================
// OPTIONAL FILTER CONTROLS
// =========================

if (categoryFilter) {
    categoryFilter.addEventListener('change', getNotes);
}

if (tagFilter) {

    let tagTimeout;

    tagFilter.addEventListener('input', () => {

        clearTimeout(tagTimeout);

        tagTimeout = setTimeout(() => {
            getNotes();
        }, 300);

    });

}

if (sortFilter) {
    sortFilter.addEventListener('change', getNotes);
}

if (clearFiltersBtn) {

    clearFiltersBtn.addEventListener('click', () => {

        searchInput.value = '';

        if (categoryFilter) categoryFilter.value = 'all';

        if (tagFilter) tagFilter.value = '';

        if (sortFilter) sortFilter.value = 'newest';

        getNotes();

    });

}


// =========================
// INITIALIZATION
// =========================

noteFormSection.style.display = 'none';

updateSidebarActiveState('all');

updatePageHeading('All Notes');

getNotes();
