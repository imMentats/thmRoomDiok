const puppeteer = require("puppeteer")
const axios = require("axios")
const chalk = require("chalk")

const url = process.argv[2];
if (!url) {
    throw "Please provide a URL as the first argument";
}

const flagVisit = (uid) => {
    axios.get(`http://127.0.0.1:3010/a009e6d1f00b19460609249ddecee763/${uid}`)
        .then(res => {
            console.log(`flagged ${uid} as visited.`)
        })
}


async function checkUrls(url) {
    console.log(chalk.red(url))
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--disable-web-security'],
            ignoreHTTPSErrors: true
        });
        try {
            const cookies = [
                {
                    "domain": "127.0.0.1:3010", // google.com, yahoo.com etc. Without the host
                    "name": "access", // here is the actual cookie name
                    "path": "/",
                    "value": "03124f34-8f0a-40f4-bd91-fc1ef3c1c611", // and the value
                    "id": 1
                }
            ]

            const page = await browser.newPage()
            console.log(url)
            let response = await page.goto(url, {timeout: 2000})
            await page.setCookie(...cookies)
            await page.click('input[type="submit"]');
            await console.log(response)
            page.close()
            browser.close()
            return resolve(response)
        } catch (e) {
            browser.close()
            return reject(e)
        }
    })
}

axios.get("http://127.0.0.1:3010/messages")
    .then(res => {
        // let messages = JSON.parse(res.data)
        (async function (message) {
            for await (message of res.data) {
                // Check if url exists, prefix is valid and not already visited
                if (!message.fromAdmin && !message.visited) {
                    if (message.url && (message.url.substring(0, 5) === "https" || message.url.substring(0, 5) === "http:")) {
                        // Check if https or not
                        if (!(message.url.substring(0, 5) === "https")) {
                            axios.post(`http://127.0.0.1:3010/message`, {
                                    body: `Sorry, but I'm not authorized to visit non secure websites outside the company network.`,
                                    fromAdmin: true,
                                    relatedTo: message.uid,
                                    token: "03124f34-8f0a-40f4-bd91-fc1ef3c1c611"
                                }
                            ).then(res => {
                                console.log(message.uid)
                            }).catch(err => {
                                console.log(err)
                            })
                        } else { // HTTPS
                            console.log(chalk.blue("url in else statement: " + message.url))
                            checkUrls(message.url)
                                .then(res => {
                                    // csrf page response status
                                    if (res._status === 200) {
                                        axios.post(`http://127.0.0.1:3010/message`, {
                                                body: `I've taken a look at the page you sent me but I'm not sure about what you're trying to tell me. I will probably (hopefully) get in contact with you tomorrow.`,
                                                fromAdmin: true,
                                                relatedTo: message.uid,
                                                token: "03124f34-8f0a-40f4-bd91-fc1ef3c1c611"
                                            },
                                        ).then(() => {
                                            console.log("visited OK")
                                        }).catch(err => {
                                            console.log(err)
                                        })
                                    } else {
                                        // response from csrf not valid
                                        console.log("visited KO2")
                                    }
                                })
                                .catch(err => {
                                    axios.post(`http://127.0.0.1:3010/message`, {
                                            body: `I tried visiting the website but it seems broken...`,
                                            fromAdmin: true,
                                            relatedTo: message.uid,
                                            token: "03124f34-8f0a-40f4-bd91-fc1ef3c1c611"
                                        },
                                    ).then(() => {
                                        console.log("visited OK")
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                })
                                .finally(() => {
                                    console.log("finally")
                                    flagVisit(message.uid)
                                })

                        }
                    } else {
                        if (!message.fromAdmin && !message.visited) {
                            axios.post(`http://127.0.0.1:3010/message`, {
                                    body: `The url doesn't seems to be valid. Double check stuff before submitting them.`,
                                    fromAdmin: true,
                                    relatedTo: message.uid,
                                    token: "03124f34-8f0a-40f4-bd91-fc1ef3c1c611"
                                },
                            ).then(() => {
                                flagVisit(message.uid)
                                console.log("visited KO")
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    }
                }
            }
        })
        ()

    }).catch(err => {
    console.log(err)
}).finally(() => {
    axios.get("http://127.0.0.1:3010/aaa/1")
        .then(res => {
            console.log("health check")
        })
        .catch(err => {
            console.log(err)
        })
})