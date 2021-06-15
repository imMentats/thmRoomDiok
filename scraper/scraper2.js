const puppeteer = require("puppeteer")
const axios = require("axios")
const chalk = require("chalk")

const url = process.argv[2];
if (!url) {
    throw "Please provide a URL as the first argument";
}


async function visitPage(url) {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--disable-web-security'],
            ignoreHTTPSErrors: true
        });
        try {
            const cookies = [
                {
                    "domain": "127.0.0.1", // google.com, yahoo.com etc. Without the host
                    "name": "access", // here is the actual cookie name
                    "path": "/",
                    "value": "ca9dd11a-bb8c-4b1e-8dcf-3f8387354d18", // and the value
                    "id": 1
                }
            ]

            const page = await browser.newPage()
            await page.setCookie(...cookies)
            let response = await page.goto(url, {timeout: 2000})
            await page.close()
            await browser.close()
            return resolve(response)
        } catch (e) {
            browser.close()
            return reject(e)
        }
    })
}

visitPage(url)
    .then(res => {
        return res
    })
    .catch(err => {
        console.log(err)
    })