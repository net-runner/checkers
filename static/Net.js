console.log("NET ON")

const url = " https://js-checkers.herokuapp.com/"
class Net {
    socket;
    constructor() {
        //this.handleData()
        this.socket = new WebSocket("ws://js-checkers.herokuapp.com/connect")
        // this.sendData()

    }

    handleData() {
        $.ajax({
            url: "/:80",
            data: "load",
            type: "POST",
            success: function (data) {
                var parsd = JSON.parse(data)
                ui.genRight(parsd)
                ui.genLeft(parsd)
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    reset(target) {
        $.ajax({
            url,
            data: target,
            type: "POST",
            success: function (data) {
                var parsd = JSON.parse(data)
                console.log("LOBBY EMPTIED")
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    sendData(target) {
        $.ajax({
            url,
            data: target,
            type: "POST",
            success: function (data) {
                var parsd = JSON.parse(data)
                console.log(parsd)
                if (parsd.player) {
                    if (parsd.player == 1) {
                        //Rotating camera for the second player
                        game.camera.position.set(438.2929313656675, 672.7969750202755, 809.5039316683562)
                        game.orbitControl.center.set(433.4270165906245, 210.61873382759634, 392.32923383730304)
                        game.orbitControl.target.set(433.4270165906245, 210.61873382759634, 392.32923383730304)

                        game.renderer.render(game.scene, game.camera);
                        game.orbitControl.update()
                    }
                    if (parsd.oponent) {
                        playerdata.oponent = data.oponent
                    }
                }
                net.handleLoginStatus(parsd)
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    handleLoginStatus(data) {
        if (data.status == "login_succesfull") { ui.status(1, data), playerdata.player = data.player, playerdata.nickname = data.nickname, playerdata.oponent = data.oponent }
        else if (data.status == "already_registered") { ui.status(2) }
        else if (data.status == "lobby_full") { ui.status(3) }
        else if (data.status == "awaiting_player") { ui.status(4, data), playerdata.player = data.player, playerdata.nickname = data.nickname }
        else { ui.status(5) }
    }
    query_player() {
        $.ajax({
            url,
            data: JSON.stringify({ "action": "query_player" }),
            type: "POST",
            success: function (data) {
                var parsd = JSON.parse(data)
                console.log(parsd)
                playerdata.timePassedWaiting += 0.5
                $("#secs").text(playerdata.timePassedWaiting)
                if (parsd.oponent) {
                    playerdata.oponent = parsd.oponent
                    playerdata.isPlayerRound = true
                    document.getElementById("alert").remove()
                    clearInterval(playerdata.inter)
                    $("#status").text("PLAYER: " + playerdata.nickname + " Oponent: " + parsd.oponent)
                    $("#round").text("YOUR ROUND")
                    game.populateBoard()
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    query_move() {
        $.ajax({
            url,
            data: JSON.stringify({ "action": "query_move" }),
            type: "POST",
            success: function (data) {
                var parsd = JSON.parse(data)
                playerdata.timePassedWaiting += 0.5
                $("#secs").text(playerdata.timePassedWaiting)
                console.log("AWAITING OPONENT MOVE")
                if (parsd.lastmove != undefined && playerdata.player != parsd.lastmove[0].player) {
                    console.log(parsd)
                    console.log("OK")
                    clearInterval(playerdata.inter)
                    playerdata.isPlayerRound = true

                    if (parsd.lastmove[0].super) {
                        let target = game.scene.getObjectByName(parsd.lastmove[0].name, true)
                        target.isSuper = true
                        target.rotation.x = Math.PI / 2;
                    }
                    for (let i = 0; i < parsd.lastmove.length; i++) {
                        let target = game.scene.getObjectByName(parsd.lastmove[i].name, true);
                        gsap.to(target.position, {
                            x: (250 + parsd.lastmove[i].pos[2] * 50), z: (250 + parsd.lastmove[i].pos[0] * 50), duration: 0.6, onComplete: () => {
                            }
                        })
                        if (parsd.lastmove[i].killed != []) {
                            for (let j = 0; j < parsd.lastmove[i].killed.length; j++) {
                                let toKill = game.scene.getObjectByName(parsd.lastmove[i].killed[j], true)
                                console.log("XD---");
                                console.log(toKill);
                                gsap.to(toKill.position, {
                                    y: 40, duration: 0.7, onComplete: () => {
                                        game.scene.remove(toKill)
                                        console.log("?_?")
                                    }
                                })
                                playerdata.enemy_points++
                                if (playerdata.enemy_points == 12) {
                                    ui.handleWinCondition(false)
                                }
                            }
                        }
                        target.boardPos = parsd.lastmove[i].pos
                        target.name = parsd.lastmove[i].pos

                    }


                    $("#round").text("YOUR ROUND")
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    send_move(move) {
        $.ajax({
            url,
            data: JSON.stringify({ "action": "send_move", "move": move }),
            type: "POST",
            success: function (data) {
                console.log("MOVE SENT")
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
}
