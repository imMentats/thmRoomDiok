const puppeteer = require("puppeteer")
const axios = require("axios")

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
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--disable-web-security'],
            ignoreHTTPSErrors: true
        });
        try {
            const page = await browser.newPage()
            console.log(url)
            const response = await page.goto(url, {timeout: 2000})
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
                                    relatedTo: message.uid
                                },
                            ).then(res => {
                                console.log(message.uid)
                            }).catch(err => {
                                console.log(err)
                            })
                        } else { //Not https
                            checkUrls(message.url)
                                .then(res => {
                                    // csrf page response status
                                    if (res._status === 200) {
                                        axios.post(`http://127.0.0.1:3010/message`, {
                                                body: `I've taken a look at the page you sent me but I'm not sure about what you're trying to tell me. I will probably (hopefully) get in contact with you tomorrow.`,
                                                fromAdmin: true,
                                                relatedTo: message.uid
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
                                            relatedTo: message.uid
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
                                    relatedTo: message.uid
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
        })()

    }).catch(err => {
    console.log(err)
}).finally(() => {
    axios.get("http://localhost:3010/aaa/1")
        .then(res => {
            console.log("health check")
        })
        .catch(err => {
            console.log(err)
        })
})