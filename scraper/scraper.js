const puppeteer = require("puppeteer");
const getUrls = require("get-urls")


const url = process.argv[2];
if (!url) {
    throw "Please provide a URL as the first argument";
}

async function run(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
            });

            const cookie = {
                name: "testCookie",
                value: "testCookie",
                domain: "localhost",   //please write full domain here, otherwise it will not work
                url: "http://localhost/",
                path: "/",
                "Max-Age": "31536000", //year
            };

            const page = await browser.newPage()
            const response = await page.goto(url)
            await page.setCookie(cookie);
            const source = await response.text()

            if (response.url().includes("localhost")) {
                let hyperlinks = getUrls(source)
                console.log(hyperlinks)
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