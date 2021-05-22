'use strict';
const md5 = require("md5");

module.exports = (app, db) => {
    app.get('/notes', (req, res) => {
        db.notes.findAll({})
            .then(notes => {
                res.json(notes);
            })
            .catch(err => {
                res.json({
                    "error": err.message
                })
            })
    });

    // POST single user
    app.post('/note', (req, res) => {

            let isHacking = false;

            const noteData = {
                title: req.body.title,
                content: req.body.content,
                css: req.body.css,
            };

            var filter = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
            isHacking = filter.test(noteData.title + noteData.content)
            if (!!isHacking) {
                res.status(403).json({
                    "message": "WAF Exception: no special chars allowed."
                })
            } else {
                db.notes.create(noteData)
                    .then(newNote => {
                        res.json({
                            "message": "Note created succesfully. Thanks for using aa",
                            "noteId": newNote.id
                        })
                    })
            }
        }
    )
}