'use strict';
const md5 = require("md5");
const axios = require("axios");
const chalk = require("chalk");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = (app, db) => {
    app.get('/notes', (req, res) => {
        console.log(req.cookies)
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
                url: req.body.url,
            };

            var filter = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
            isHacking = filter.test(noteData.title + noteData.content)
            if (!!isHacking) {
                res.status(403).json({
                    "message": "WAF Exception: no special chars allowed."
                })
            } else {
                if (noteData.url) {
                    // here is a SSRF but whatever, nothing useful for the room itself
                    axios.get(noteData.url)
                        .then(function (response) {
                            let responseBody = response.data.message ? response.data.message.toString() : response.data.toString()
                            db.notes.create(
                                {
                                    title: noteData.title,
                                    content: noteData.title,
                                    url: responseBody,
                                }
                            )
                                .then(newNote => {
                                    res.json({
                                        "message": "Note created succesfully. Thanks for using aa",
                                        "noteId": newNote.id
                                    })
                                })
                        })
                        .catch(function (error) {
                            console.log(error);
                            res.status(403).json({
                                "errorCode": error.message
                            });
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
        }
    )
}