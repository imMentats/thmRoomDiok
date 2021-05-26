const express = require("express")
const db = require("./config/database")
const md5 = require("md5")
const cookieParser = require("cookie-parser")
const randomString = require("randomstring")
const router = require("./router/index")
const path = require("path")
const puppeteer = require("puppeteer")

const app = express()
const PORT = 3010

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static("./frontend"))

router(app, db)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/index.html"))
})

db.sequelize.sync({force: true}).then(() => {
    app.listen(PORT, () => {
        console.log(`app started on port ${PORT}`)
    })
});
//
// const adminCookie = md5(randomString.generate())
// const userCookie = md5(randomString.generate())
const url = "http://localhost:3010"


// Oh well, it seems that you already knew of this, right?
async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        args: ['--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials']
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: 'screenshot.png'});
    await browser.close();
}

// setInterval(() => run(), 5000);