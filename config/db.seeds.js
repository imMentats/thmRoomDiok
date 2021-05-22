// config/db.seed.js
const db = require("./database");
const User = require("../models/user");

const seed = async () => {
    await db.sync({ force: true });

    const users = [{
        username:"admin",
        password:"password",
        email: "admin@a.a",
        isAdmin: true
    },{
        username:"user",
        password:"password",
        email: "user@a.a",
        isAdmin: false
    },
    ]

    users.forEach(user => {
        User.create(user)
            .then((user) => {
            console.log("seeded user", user);
            User.findOne({ where: { email: `${user.email}` } })
                .then((user) => {
                    console.log("found in db after adding");
                    db.close();
                })
                .catch((error) => {
                    console.error("error looking for new user in db: ", error);
                    db.close();
                });
        })
            .catch((error) => {
                console.error("failed to seed, ", error);
                db.close();
            });
    })
};

module.exports = seed