var http = require("http");
var qs = require("querystring");
var fs = require("fs");

const HyperExpress = require('hyper-express');
const server = new HyperExpress.Server();

require("dotenv").config();

/* Helper function for reading a posted JSON body */
function readJson(res, cb, err) {
    let buffer;
    /* Register data cb */
    res.onData((ab, isLast) => {
        let chunk = Buffer.from(ab);
        if (isLast) {
            let json;
            if (buffer) {
                try {
                    json = JSON.parse(Buffer.concat([buffer, chunk]));
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            } else {
                try {
                    json = JSON.parse(chunk);
                } catch (e) {
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                cb(json);
            }
        } else {
            if (buffer) {
                buffer = Buffer.concat([buffer, chunk]);
            } else {
                buffer = Buffer.concat([chunk]);
            }
        }
    });

    /* Register error cb */
    res.onAborted(err);
}
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
    })
    req.on("end", function (data) {
        res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
        setTimeout(function () { res.end(JSON.stringify(send, null, 4)); }, 10)
    })
}
let listenSocket;
var port = 80;
var players = []
var games = [];
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
    res.header("Access-Control-Allow-Origin", "*")
        .header("content-type", "text/html;charset=utf-8")
        .send(JSON.stringify(send, null, 4));


})
server.upgrade('/connect', async (request, response) => {
    // Do some kind of asynchronous verification here

    // Upgrade the incoming request with some context
    response.upgrade({
        user_id: 'some_user_id',
        event: 'news_updates'
    });
});
server.ws('/connect', (ws) => {
    // Log when a connection has opened for debugging
    console.log('User ' + ws.context.user_id + ' has connected');

    // Handle incoming messages to perform changes in consumption
    ws.on('message', (message) => {
        // Make some changes to which events user consumes based on incoming message
    });

    // Do some cleanup once websocket connection closes
    ws.on('close', (code, message) => {
        console.log('User' + ws.context.user_id + ' is no longer listening for news events.');
        // You may do some cleanup here regarding analytics
    });
});
server.listen(process.env.PORT || 80)
    .then(() => console.log("[Minecraft Checkers Online]"))
    .catch((error) => console.log("Failed to start server: " + error))