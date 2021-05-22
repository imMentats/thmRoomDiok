const express = require("express")
const db = require("./config/database")
const md5 = require("md5")
const cookieParser = require("cookie-parser")
const randomString = require("randomstring")
const axios = require("axios").default

const app = express()
const PORT = 3010

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extend:false}))
app.use(cookieParser())
app.use(bodyParser.json())

app.listen(PORT, () => {
    console.log(`app started on port ${PORT}`)
})

const adminCookie =  md5(randomString.generate())
const userCookie =  md5(randomString.generate())

app.get("/", (req,res,next)=> {
    let welcomeMessage
    if (!req.cookies.customAuth){
        console.log("req without cookies logged!")
        // res.setHeader('Set-Cookie',`customAuth=${userCookie}; Max-Age=3000;`);
    }

    if (req.cookies.customAuth === adminCookie)
        welcomeMessage = "Welcome admin!"
    else
        welcomeMessage = "not authorized!"
    res.json({
        "message": welcomeMessage
    })
    console.log(adminCookie);
})
app.get("/api/users", (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});
app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});
app.post("/api/user/", (req, res, next) => {
    var errors = []
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
    var params =[data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})


app.get("/api/notes", (req, res, next) => {
    var sql = "select * from notes"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"all notes success!",
            "data":rows
        })
    });
});
app.post("/api/note/", (req, res, next) => {
    var errors = []

    if (!req.body.title){
        errors.push("No title");
    }

    if (!req.body.content){
        errors.push("No body");
    }

    // XSS PROTECTION
    [...req.body.content].forEach((el,i) => {
        let isHacking = false
        if ([...'<>""@!-/#&`='].includes(el)) {
            isHacking = true
            console.log(isHacking)
        }
    if ( i === [...req.body.content].length - 1) {
        if (!isHacking) {
            var data = {
                title: req.body.title,
                content: req.body.content
            }
            var sql ='INSERT INTO notes (title, content) VALUES (?,?)'
            var params =[data.title, data.content]
            db.run(sql, params, function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({
                    "message": "note successfully note!",
                    "data": data,
                    "id" : this.lastID
                })
            });
        }
        else {
            res.status(403).json({
                "message":"GTFO"
            })
            console.log(`this dude is hacking`)
        }
    }
    })

})

app.use((req,res) => {
    res.status(404)
})