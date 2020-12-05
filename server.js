const express = require('express');
const path = require('path');
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

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/notes", function(req, res) {
    notes = JSON.parse(fs.readFile("./db/db.json"));
    res.json(notes);
})

app.post("/api/notes", function(req, res) {
    notes = JSON.parse(fs.readFileSync("./db/db.json", (err, data) =>{
        if (err) throw (err);
        console.log(data);
    }));
    let newNote = req.body;
    newNote.id = uuid.v4();
    notes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes));
    res.json(newNote);
})

app.delete("/api/notes/:id", function(req, res) {
    const find = notes.some(note => note.id === parseInt(req.params.id));
    res.json(notes.filter(note => note.id !== parseInt(req.params.id)));
})

app.listen(PORT, () => {
    console.log("App listening at http://localhost:" + PORT);
});