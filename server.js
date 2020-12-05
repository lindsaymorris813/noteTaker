const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 8000;

let notes = [];

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    notes = JSON.parse(fs.readFileSync("db/db.json"));
    res.json(notes);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/notes", function(req, res) {
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

app.delete("/api/notes/:id", function(req, res) {
    res.json(notes.filter(note => note.id !== parseInt(req.params.id)));
})

app.listen(PORT, () => {
    console.log("App listening at http://localhost:" + PORT);
});