
var net;
var ui;
var playerdata = {
    "isPlayerRound": false,
    "lastmove": [],
    "timePassedWaiting": 0,
    "points": 0,
    "enemy_points": 0,
};
var serverdata;
$(document).ready(function () {

    net = new Net()
    ui = new Ui()
    game = new Game()

    console.log("MAIN RDY")

    ui.alert()
    ui.loginClick()
    ui.resetClick()

    game.preload()
    game.createBoard()
    // game.orbitControls()
    game.handleMouseDown()
})

