console.log("UI ON")

class Ui {

    constructor() {
    }
    alert() {
        let alertbackground = document.createElement("div")
        let alertinner = document.createElement("div")
        let input = document.createElement("input")
        alertbackground.setAttribute("id", "alert")
        alertinner.setAttribute("id", "inneralert")
        let bok = document.createElement("button")
        let row = document.createElement("div")
        bok.id = "b1"
        alertinner.appendChild(input)
        alertinner.appendChild(row)
        row.appendChild(bok)
        row.classList.add("row")
        bok.classList.add("b")
        bok.innerText = "PLAY"
        input.id = "ide"
        let bok2 = document.createElement("button")
        bok2.id = "b2"
        row.appendChild(bok2)
        bok2.classList.add("b")
        bok2.innerText = "RESET"
        document.body.appendChild(alertbackground)
        document.body.appendChild(alertinner)
    }
    loginClick() {
        $("#b1").click(function () {
            var target = document.getElementById("ide")
            var logData = {
                "action": "login",
                "value": target.value,
            }
            logData = JSON.stringify(logData)
            net.sendData(logData)
        })
    }
    resetClick() {
        $("#b2").click(function () {
            var target = document.getElementById("ide")
            var logData = {
                "action": "reset",
            }
            logData = JSON.stringify(logData)
            net.reset(logData)
        })
    }
    status(status_number, data) {
        var target = document.getElementById("status")
        if (status_number == 1) {
            document.getElementById("alert").remove()
            document.getElementById("inneralert").remove()
            target.innerHTML = "PLAYER: " + data.nickname + " OPONENT: " + data.oponent
            game.populateBoard()
            playerdata.inter = setInterval(net.query_move, 500)
            $("#round").text("OPONENT ROUND")
        }
        else if (status_number == 2) {
            target.innerHTML = "STATUS: Nickname already being used"
        }
        else if (status_number == 3) {
            target.innerText = "STATUS: Lobby is full try again later"
        }
        else if (status_number == 4) {
            document.getElementById("inneralert").remove()
            target.innerHTML = "PLAYER: " + data.nickname + "           Waiting for second player...."
            playerdata.inter = setInterval(net.query_player, 500)
        }
        else {
            target.innerText = "STATUS: Standby"
        }
    }
    handleWinCondition(haveWon) {
        let alertbackground = document.createElement("div")
        let alertinner = document.createElement("div")
        alertbackground.setAttribute("id", "alert")
        alertinner.setAttribute("id", "inneralert")
        let h2 = document.createElement("h2")
        if (haveWon) {
            h2.innerHTML = "YOU WON!"
        } else {
            h2.innerHTML = "YOU LOST!"
        }
        alertinner.appendChild(h2)
        document.body.appendChild(alertbackground)
        document.body.appendChild(alertinner)
    }
}