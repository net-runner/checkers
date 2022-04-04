
const HyperExpress = require('hyper-express');
const server = new HyperExpress.Server();

require("dotenv").config();
var players = []

server.post("/", async (req, res) => {

    var send = {}
    send = {
        "status": undefined,
        "player": undefined,
        "nickname": undefined,
        "oponent": undefined,
    }
    let allData = await req.json();
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
    res.header("Access-Control-Allow-Origin", "https://threejs-checkers.netlify.app/")
        .header("content-type", "text/html;charset=utf-8")
        .send(JSON.stringify(send, null, 4));


})
server.listen(process.env.PORT || 80)
    .then(() => console.log("[Minecraft Checkers Online]"))
    .catch((error) => console.log("Failed to start server: " + error))