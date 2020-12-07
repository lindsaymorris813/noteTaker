//require express, path, fs, uuid
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
//create express server & set port
const app = express();
const PORT = process.env.PORT || 8000;
//express app to handle data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
//empty notes array to push/filter to
let notes = [];
//route to HTML pages
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});
//route for API of notes using database data
app.get("/api/notes", function(req, res) {
    notes = JSON.parse(fs.readFileSync("db/db.json"));
    res.json(notes);
});
//anything not designated routed to index.html
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

//post to API notes
app.post("/api/notes", function(req, res) {
    notes = JSON.parse(fs.readFileSync("db/db.json"));
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuid.v4()
    }
    console.log(newNote);
    notes.push(newNote);
    fs.writeFileSync("db/db.json", JSON.stringify(notes));
    res.json(newNote);
})
//delete entry from API notes using unique ID
app.delete("/api/notes/:id", function(req, res) {
    notes = JSON.parse(fs.readFileSync("db/db.json"));
    notes = notes.filter(note => note.id !== req.params.id)
    fs.writeFileSync("db/db.json", JSON.stringify(notes));
    res.json(notes);
})
//listener for port
app.listen(PORT, () => {
    console.log("App listening at http://localhost:" + PORT);
});

module.exports = notes;