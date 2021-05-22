'use strict';
const md5 = require("md5");

module.exports = (app, db) => {
    // GET all users
    app.get('/users', (req, res) => {
        db.users.findAll({
        })
            .then(users => {
                res.json(users);
            })
        .catch(err => {
            res.json({
                "error":err.message
            })
        })
    });

    // GET one user by id
    app.get('/user/:id', (req, res) => {
        const id = req.params.id;
        db.users.find({
            where: { id: id }
        })
            .then(user => {
                res.json(user);
            });
    });

    // POST single user
    app.post('/register', (req, res) => {
        console.log(req.body)
        const userData = {
         name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password),
        }
        db.users.create(userData)
            .then(newUser => {
                res.json(newUser);
            })
    });
};