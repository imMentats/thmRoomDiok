const express = require("express");
const db = require("./config/database");
const md5 = require("md5");
const cookieParser = require("cookie-parser");
const randomString = require("randomstring");
const router = require("./router/index");
const path = require("path");
const puppeteer = require("puppeteer");
const chalk = require("chalk");
const cors = require("cors");

const app = express();
const PORT = 3010;

let messageService = true;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("./frontend"));

app.use(cors({
    credentials: true,
    origin: "http://localhost:3010"
}))

router(app, db);

app.get("/testCode", (req, res) => {
    res.status(666).json({
        message: "status code from hell",
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/index.html"));
});

app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/chat.html"));
});

app.get("/note", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/notes.html"));
});

app.get("/editUser", (req, res) => {
    console.log(chalk.red(req.cookie));
    res.sendFile(path.join(__dirname, "/frontend/editUser.html"));
});

app.get("/login", (req, res) => {
    console.log(chalk.red(req.cookie));
    res.sendFile(path.join(__dirname, "/frontend/login.html"));
});

// admin coookie authorization here
app.get("/status", (req, res) => {
    res.status(200).json({
        message: messageService,
    });
});

app.get("/aaa/:signal", (req, res) => {
    const signal = req.params.signal;
    messageService = !!parseInt(signal);
    res.status(200).json({
        message: `updated status as ${signal}`,
    });
});

db.sequelize.sync({force: true}).then(() => {
    app.listen(PORT, () => {
        console.log(`app started on port ${PORT}`);
    });
    db.users.create({
        token: "03124f34-8f0a-40f4-bd91-fc1ef3c1c611",
        username: "admin",
        password: md5(md5("@@@@@@!!das   dasd")),
        admin: true,
    });
    db.users.create({
        token: "ca9dd11a-bb8c-4b1e-8dcf-3f8387354d18",
        username: "user",
        password: md5(md5("@@@@@@!!abcdefgh   ijQQQQ")),
        admin: false,
    });
    db.messages.destroy({
        where: {},
        truncate: true,
    });
});
//
// const adminCookie = md5(randomString.generate())
// const userCookie = md5(randomString.generate())
const url = "http://localhost:3010";

// Oh well, it seems that you already knew of this, right?
async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        args: [
            "--disable-web-security",
            "--disable-features=IsolateOrigins",
            " --disable-site-isolation-trials",
        ],
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: "screenshot.png"});
    await browser.close();
}

setInterval(() => {
    db.messages.destroy({
        where: {},
        truncate: true,
    });
}, 60000);
