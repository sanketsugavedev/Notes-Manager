const express = require('express');
const path = require('path');
const notesRoutes = require('./routes/notesRoutes');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname , '../frontend')))

app.use('/api/notes', notesRoutes);

module.exports = app;