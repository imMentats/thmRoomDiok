'use strict';
const md5 = require("md5");
const {v4: uuidv4} = require("uuid");
const chalk = require("chalk")

module.exports = (app, db) => {
    // GET all users
    app.get('/users', (req, res) => {
        // COOKIE PARSER written by a grasshopper (myself)
        const cookies = {}

        console.log(req.headers.cookie)

        req.headers.cookie.split(";").forEach(el => {
            cookies[el.split("=")[0].replace(" ", "")] = !!el.split("=")[1] ? el.split("=")[1].replace(" ", "") : ""
        })

        if (cookies.access === "03124f34-8f0a-40f4-bd91-fc1ef3c1c611") {
            db.users.findAll({})
                .then(users => {
                    // let data = users.map(el => el.username)
                    res.json({
                        "message": users
                    });
                })
                .catch(err => {
                    res.json({
                        "error": err.message
                    })
                })
        } else {
            res.status(403).json({
                "message": "You are not authorized."
            })
        }
    });

    // GET one user by id

    app.post('/user', (req, res) => {
        db.users.findOrCreate({
            where: {username: req.body.username}, defaults: {
                password: md5(req.body.password),
                token: uuidv4(),
                admin: false
            }
        })
            .then((user, created) => {
                let isNew = !!user[0]._options.isNewRecord
                if (!isNew) {
                    res.json({
                        "message": `User already exists`
                    });
                } else {
                    res.json({
                        "message": `User created successfully!`
                    });
                }
            }).catch(err => {
            res.json({
                "message": "error in database",
                "error": err.message
            });
            // console.log(err)
        })
    })
    app.post('/login', (req, res) => {
        db.users.findOne({
            where: {
                username: req.body.username,
                password: md5(req.body.password)
            }
        }).then(user => {
            if (!!user) {
                res.cookie('access', user.token, {maxAge: 900000, httpOnly: false}).json({
                    "message": user
                });
            } else {
                res.status(403).json({
                    "message": "invalid credentials"
                })
            }
        }).catch(() => {
            res.status(500).json({
                "message": "Something went wrong."
            })
        })
    })

    app.post("/editUser", (req, res) => {
        // COOKIE PARSER written by a grasshopper
        const cookies = {}
        console.log(req.headers)

        req.headers.cookie.split(";").forEach(el => {
            cookies[el.split("=")[0].replace(" ", "")] = el.split("=")[1].replace(" ", "")
        })


        if (cookies.token === "03124f34-8f0a-40f4-bd91-fc1ef3c1c611") {
            db.users.findOne({
                where: {
                    username: req.body.username
                }
            })
                .then((user) => {
                    if (user) {
                        user.update({
                            admin: req.body.admin
                        }).then(() => {
                            res.status(200).json({
                                "message": "User role updated succesfully!"
                            })
                        })
                    } else {
                        res.status(400).json({
                            "message": "User not found."
                        })
                    }
                })
        } else {
            res.status(403).json({
                "message": "You are not authorized."
            })
        }
    })


};

