var http = require("http");
var qs = require("querystring");
var fs = require("fs");

require("dotenv").config();
const uWS = require('./dist/uws.js');
// var server = http.createServer(function (req, res) {
//     console.log(decodeURI(req.url))
//     switch (req.method) {
//         case "GET":
//             if (req.url == "/index.html" || req.url == "/index" || req.url == "/") {
//                 fs.readFile("static/index.html", function (error, data) {
//                     res.writeHead(200, { 'Content-Type': 'text/html' });
//                     res.write(data);
//                     res.end();
//                 })
//             }
//             else if (req.url === "/css.css") {
//                 fs.readFile("static/css.css", function (error, data) {
//                     res.writeHead(200, { 'Content-Type': 'text/css' });
//                     res.write(data);
//                     res.end();
//                 })
//             }
//             else if (req.url.indexOf(".js") != -1) {
//                 fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
//                     res.writeHead(200, { "Content-type": 'application/javascript' });
//                     res.write(data);
//                     res.end();
//                 })
//             }
//             else if (req.url.indexOf(".mp3") != -1) {
//                 fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
//                     res.writeHead(200, { "Content-type": "audio/mpeg" });
//                     res.write(data);
//                     res.end();
//                 })
//             }
//             else if (req.url.indexOf(".jpg") != -1) {
//                 fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
//                     res.writeHead(200, { "Content-type": "image/jpg" });
//                     res.write(data);
//                     res.end();
//                 })
//             }
//             else if (req.url.indexOf(".png") != -1) {
//                 fs.readFile(__dirname + decodeURI(req.url), function (error, data) {
//                     res.writeHead(200, { "Content-type": "image/png" });
//                     res.write(data);
//                     res.end();
//                 })
//             }
//             else {
//                 res.writeHead(404, { 'Content-Type': 'text/html' });
//                 res.write("<h1>404 :( </h1>");
//                 res.end();
//             }
//             break;
//         case "POST":
//             servResponse(req, res)
//             break;
//     }
// })
var players = []
function servResponse(req, res) {
    var send = {}
    var allData = "";
    send = {
        "status": undefined,
        "player": undefined,
        "nickname": undefined,
        "oponent": undefined,
    }
    req.on("data", function (data) {
        allData = JSON.parse(data)
        if (allData.action == "login") {
            if (players.length < 2) {
                if (players.includes(allData.value)) {
                    send.status = "already_registered"
                    send.player = undefined
                    send.nickname = undefined
                } else {
                    players.push(allData.value)
                    send.player = players.indexOf(allData.value)
                    send.nickname = allData.value
                    if (players.length == 1) {
                        send.status = "awaiting_player"
                        lastmove = undefined
                    } else {
                        send.status = "login_succesfull"
                        send.oponent = players[0]
                    }
                }
            }
            else {
                send.status = "lobby_full"
                send.player = undefined
                send.nickname = undefined
            }
        }
        if (allData.action == "query_player") {
            if (players.length == 2) {
                send.oponent = players[1]
            }
        }
        if (allData.action == "reset") {
            players = []
        }
        if (allData.action == "send_move") {
            lastmove = JSON.parse(allData.move)
        }
        if (allData.action == "query_move") {
            console.log(lastmove)
            if (lastmove != undefined) {
                send.lastmove = lastmove
            }
        }
        else {
        }
    })
    req.on("end", function (data) {
        res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
        setTimeout(function () { res.end(JSON.stringify(send, null, 4)); }, 10)
    })
}

var port = 80;
var players = []
const app = uWS.App().get("/", (res, req) => {

}).get("/*", (res, req) => {
    res.end(":)")
}).post("/", (res, req) => {
    req.end()

}).listen(process.env.PORT || port, (token) => {
    if (token) {
        console.log("[P:" + port + "] Minecraft Checkers Online")
    } else {
        console.log('Failed to listen to port ' + port);
    }
});
// server.listen(process.env.PORT || port, function () {
//     console.log("[P:" + port + "] Minecraft Checkers Online")
// });
