# Notes Manager

A full-stack Notes Manager application that helps users create, organize, search, and manage their personal notes.

## Features

- **Create Notes** – Create notes with a title, content, category, and tags.
- **Edit Notes** – Update existing notes.
- **Delete Notes** – Permanently delete notes.
- **Pin Notes** – Pin important notes for quick access.
- **Archive Notes** – Archive notes without deleting them.
- **Search Notes** – Find notes using the search functionality.
- **Organize by Category** – Organize notes into predefined categories.
- **Tags** – Add custom tags to notes.
- **Responsive UI** – Dark-themed interface with a sidebar-based layout.

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Fetch API

### Backend
- Node.js
- Express.js
- REST API
- File System (`fs/promises`)

### Data Storage
- JSON file-based storage

## Project Structure

```text
NotesManager/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── data/
│   │   └── notes.json
│   ├── app.js
│   └── server.js
│
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/NotesManager.git
```

### 2. Navigate to the project

```bash
cd NotesManager
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Start the backend server

```bash
node server.js
```

### 5. Run the frontend

Open `frontend/index.html` using VS Code Live Server or another local development server.

Make sure the API URL configured in the frontend matches the backend server address.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:id` | Get a specific note |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

## Data Model

Each note contains:

```json
{
  "id": 123456789,
  "noteTitle": "Learning Node.js",
  "noteContent": "Understanding Express and APIs.",
  "noteCategory": "Programming",
  "noteTags": ["JavaScript", "Node.js"],
  "isPinned": false,
  "isArchived": false,
  "createdAt": 123456789,
  "updatedAt": 123456789
}
```

## Future Improvements

- User authentication and authorization
- Database integration with MongoDB
- Rich-text editing
- Image and file attachments
- Cloud deployment

## Author

**Sanket Sugave**

- GitHub: [@sanketsugavedev](https://github.com/sanketsugavedev)
- LinkedIn: [Sanket Sugave](https://www.linkedin.com/in/sanket-sugave/)

---

*Built as a full-stack web development practice project.*
