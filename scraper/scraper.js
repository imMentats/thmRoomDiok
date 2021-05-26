const puppeteer = require("puppeteer");
const getUrls = require("get-urls")
let catchedUrls = []


const url = process.argv[2];
if (!url) {
    throw "Please provide a URL as the first argument";
}

async function run(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: ['--disable-web-security']
            });

            const cookie = {
                name: "testCookie2",
                value: "testCookie",
                domain: "localhost:3010",   //please write full domain here, otherwise it will not work
                url: "http://localhost:3010",
                path: "/",
                "Max-Age": "31536000", //year
            };

            const page = await browser.newPage()
            await page.setCookie(cookie);
            const response = await page.goto(url)
            const source = await response.text()

            if (response.url().includes("localhost")) {
                let hyperlinks = getUrls(source)
                hyperlinks.forEach(el => {
                })
                // let validHyperlink = hyperlinks.split(".")
                // let checkMask = `${validHyperlink[1]}${validHyperlink[2]}`
                // console.log(checkMask)
            }

            browser.close()
            return resolve()
        } catch (e) {
            return reject(e)
        }
    })
}

run(url)
    .then((res) => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })