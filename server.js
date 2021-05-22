const express = require("express")
const db = require("./config/database")
const md5 = require("md5")
const cookieParser = require("cookie-parser")
const randomString = require("randomstring")
const router = require("./router/index")

const app = express()
const PORT = 3010

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(bodyParser.json())

router(app,db)

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`app started on port ${PORT}`)
    })
})

const adminCookie =  md5(randomString.generate())
const userCookie =  md5(randomString.generate())
