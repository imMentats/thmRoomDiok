const sqlite3 = require("sqlite3");
const md5 = require("md5");

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text, 
            content text 
            )`,
            (err) => {
                if (err) {
                    // Table already created
                    console.log("Table notes already created.")
                }else{
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO notes (title, content) VALUES (?,?)'
                    db.run(insert, ["fucking title","fucking content"])
                }
            });
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
            (err) => {
                if (err) {
                    console.log("Table user already created.")
                    // Table already created
                }else{
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                    db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                    db.run(insert, ["user","user@example.com",md5("user123456")])
                }
            });
    }
});


module.exports = db
