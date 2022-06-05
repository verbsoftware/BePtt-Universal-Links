const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const port = process.env.PORT || 8080

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(port);
console.log("Listening on port: " + port);

app.get("/.well-known/assetlinks.json" , function (req, res) {
    const pathName = `[GET] /assetlinks.json`
    const aasa = path.join(__dirname, './assetlinks.json')

    res.status(200)
    res.sendFile(aasa)
})

app.get("/.well-known/apple-app-site-association" , function (req, res) {
    const pathName = `[GET] /apple-app-site-association`
    const aasa = path.join(__dirname, './apple-app-site-association')

    res.status(200)
    res.sendFile(aasa)
})

app.get("/redirect" , function (req, res) {
    console.log('[GET] /redirect');
    res.sendStatus(204).send("success")
})

app.get("/favicon.ico" , function (req, res) {
    console.log('[GET] /favicon.ico');
    res.sendStatus(404)
})

app.get("/" , function (req, res) {
    console.log('[GET] /');
    const index = path.join(__dirname, './index.html')

    res.status(200)
    res.sendFile(index)
})

app.get("/:boardName", function (req, res) {
    const pathName = `[GET][Board] /${req.params.boardName}`
    console.log(pathName)

    const base_url = "https://www.ptt.cc/bbs/"
    const board_name = `${req.params.boardName}`
    const file_name = `/index.html`

    var new_url = base_url + board_name

    if (!file_name.endsWith(file_name)) {
        new_url = new_url + "/" + file_name
    } 

    console.log(`[Redirect][Board] ${new_url}`)

    res.status(301)
    res.location(new_url)
    res.end(`[Redirect] ${new_url}`)

})

app.get("/:boardName/:filenName" , function (req, res) {
    const pathName = `[GET] /${req.params.boardName}/${req.params.filenName}`
    console.log(pathName)

    const userAgent = req.headers['user-agent']

    if (userAgent != null && userAgent.match(/iPhone|iPad|iPod/i)) {
        console.log(`[Redirect][iOS] ${pathName}`)
        const file = path.join(__dirname, './redirect.html')
        res.sendFile(file)
    } else {
        const base_url = "https://www.ptt.cc/bbs/"
        const board_name = `${req.params.boardName}`
        const file_name = `${req.params.filenName}` 
    
        var new_url = base_url + board_name
    
        if (file_name.endsWith(".html")) {
            new_url = new_url + "/" + file_name
        } else {
            new_url = new_url + "/" + file_name + ".html"
        }

        if (userAgent.match(/Android/i)) {
            console.log(`[Redirect][Android] ${new_url}`)
        } else {
            console.log(`[Redirect][Other] ${new_url}`)
        }

        res.status(301)
        res.location(new_url)
        res.end(`[Redirect] ${new_url}`)
    }
})
