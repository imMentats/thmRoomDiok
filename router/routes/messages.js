'use strict';
const md5 = require("md5");
const axios = require("axios");
const chalk = require("chalk");

module.exports = (app, db) => {
    // GET all messages
    app.get('/messages', (req, res) => {
        db.messages.findAll({})
            .then(messages => {
                res.json(messages);
            })
            .catch(err => {
                res.json({
                    "error": err.message
                })
            })
    });


    // POST single message
    app.post('/message', (req, res) => {
        const cookies = {}

        console.log(req.headers.cookie)

        req.headers.cookie.split(";").forEach(el => {
            cookies[el.split("=")[0].replace(" ", "")] = !!el.split("=")[1] ? el.split("=")[1].replace(" ", "") : ""
        })

        if (cookies.access === "ca9dd11a-bb8c-4b1e-8dcf-3f8387354d18") {
            let serviceStatus
            axios.get("http://localhost:3010/status")
                .then(res => {
                    serviceStatus = res.data.message
                })
                .catch(err => {
                    console.log(err)
                }).finally(() => {
                const messageData = {
                    body: req.body.body,
                    fromAdmin: req.body.fromAdmin,
                    url: req.body.url,
                    uid: md5(Date.now()),
                    relatedTo: req.body.relatedTo
                }

                if (serviceStatus) {
                    db.messages.create(messageData)
                        .then(newMessage => {
                            res.json({
                                "message": "message submitted!"
                            });
                        }).catch(err => {
                        res.json({
                            "message": "error in database"
                        });
                        // console.log(err)
                    })
                } else {
                    res.status(403).send("Please be patient. You can submit reports only if the admin has already checked the previous.")
                }
                if (!messageData.fromAdmin) {
                    axios.get("http://127.0.0.1:3010/aaa/0")
                        .then(res => {
                            // console.log(res)
                        }).catch(err => {
                        // console.log(err)
                    })
                }
            })
        } else {
            res.status(403).json({
                "message": "You are not authorized to directly contact the administrator."
            })
        }

    })

    app.get('/a009e6d1f00b19460609249ddecee763/:uid', (req, res) => {
        const uid = req.params.uid;
        db.messages.findOne({
            where: {uid: uid}
        })
            .then(message => {
                message.update({
                    visited: true,
                })
                res.json({
                    message: `visited ${uid}`
                })
            });
    });
};