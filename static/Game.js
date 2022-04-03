console.log("GAME ON")
class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, $("#root").width() / $("#root").height(), 1, 10000)
        this.renderer = new THREE.WebGLRenderer();
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()
        this.axes = new THREE.AxesHelper(1000)
        this.root = document.getElementById("root")
        this.orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.x = 420.2291930623733
        this.y = 696.0008699667712
        this.z = 153.494173000202
        this.board = new THREE.Object3D();
        this.square_material_1 = new THREE.MeshBasicMaterial({
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('./img/b.png')
        });
        this.square_material_2 = new THREE.MeshBasicMaterial({
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('./img/dirt.jpg')
        });
        this.cylinder_material_1 = new THREE.MeshBasicMaterial({
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('./img/c1.png')
        });
        this.cylinder_material_2 = new THREE.MeshBasicMaterial({
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('./img/c2.png')
        });
        this.square_geo = new THREE.BoxGeometry(50, 50, 50);
        this.cylinder_geo = new THREE.CylinderGeometry(25, 25, 12.5, 32);
        this.board = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ];
        this.boardtiles = []
        this.cylinders = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];
        this.pawnsPosition = this.cylinders
        this.angle = 0
        this.selectedPawn
        this.jumpTarget = []
    }
    render() {
        requestAnimationFrame(game.render);
        game.renderer.render(game.scene, game.camera);
        game.orbitControl.update()
    }
    preload() {
        // game.orbitControl.autoRotate = true;
        $("#root").append(game.renderer.domElement);

        game.renderer.setClearColor(0xffffff, 1)
        game.renderer.setSize($("#root").width(), $("#root").height());

        game.camera.position.set(game.x, game.y, game.z)

        game.orbitControl.center.set(418.3993394563722, 72.45584596772032, 526.6548977962368)
        game.orbitControl.target.set(418.3993394563722, 71.45584596772032, 526.6548977962368)
        game.camera.lookAt(450, 282, 450)
        // game.scene.add(game.axes)

        game.render()
        game.onResizeHandle()
    }
    populateBoard() {
        let x, z, tile
        let y = 282
        for (var i = 0; i < game.board.length; i++) {
            z = 50 * (i + 5)
            for (var j = 0; j < game.board[i].length; j++) {
                x = 50 * (j + 5)
                if (game.cylinders[i][j] == 1 || game.cylinders[i][j] == 2) {
                    if (game.cylinders[i][j] == 1) tile = new Pawn(game.cylinder_geo, game.cylinder_material_1), tile.sname = "p2";
                    if (game.cylinders[i][j] == 2) tile = new Pawn(game.cylinder_geo, game.cylinder_material_2), tile.sname = "p1";

                    tile.position.set(x, y, z)
                    TweenMax.to(tile.position, 1, { x: x + 20, y: y + 20, z: z + 20, ease: Power4.easeInOut })
                    tile.boardPos = i + "x" + j
                    tile.name = i + "x" + j
                    tile.isSuper = false
                    game.scene.add(tile)

                    //tile.rotation.x = Math.PI / 2;

                }
            }
        }
    }
    createBoard() {
        let x, z, tile
        let y = 250
        for (var i = 0; i < game.cylinders.length; i++) {
            z = 50 * (i + 5)
            for (var j = 0; j < game.cylinders[i].length; j++) {
                x = 50 * (j + 5)
                if (game.board[i][j] == 1) {
                    tile = new Tile(game.square_geo, game.square_material_1)
                } else {
                    tile = new Tile(game.square_geo, game.square_material_2)
                    tile.sname = "odds"
                    tile.boardPos = i + "x" + j
                    game.boardtiles.push(tile)
                }
                tile.position.set(x, y, z)
                game.scene.add(tile)
            }
        }
    }
    orbitControls() {
        game.orbitControl.addEventListener('change', function () {
            game.renderer.render(game.scene, game.camera)
        });
    }
    onResizeHandle() {
        window.addEventListener('resize', function () {
            game.camera.aspect = $("#root").innerWidth() / $("#root").innerHeight();
            game.camera.updateProjectionMatrix();
            game.renderer.setSize($("#root").innerWidth(), $("#root").innerHeight());
        })
    }
    handleMouseDown() {
        window.addEventListener("mousedown", function (e) {
            game.mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
            game.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
            game.raycaster.setFromCamera(game.mouseVector, game.camera)

            let intersects = game.raycaster.intersectObjects(game.scene.children)
            if (intersects.length > 0) {
                let target = intersects[0].object
                console.log(target)
                if (playerdata.isPlayerRound == true) {
                    if ((playerdata.player == 0 && target.sname == "p1") || (playerdata.player == 1 && target.sname == "p2") && !playerdata.isPerformingAnotherJump) {
                        if (game.selectedPawn) {
                            game.clearSelected()
                        }
                        game.selectedPawn = target
                        target.material = target.material.clone()
                        target.material.color.setHex(0xff0000)
                    }
                    if (game.selectedPawn) {
                        let pos = game.selectedPawn.boardPos
                        let x = parseInt(pos[0])
                        let y = parseInt(pos[2])
                        //Movement of player one
                        if (playerdata.player == 0 && target.sname == "odds") {
                            let angleDeg = Math.atan2(target.boardPos[2] - y, target.boardPos[0] - x) * 180 / Math.PI;
                            console.log(angleDeg)
                            if (!game.selectedPawn.isSuper) {
                                if ((target.boardPos[0] == (x + 1)) && (target.boardPos[2] == (y - 1) || target.boardPos[2] == (y + 1))) {
                                    if (!game.scene.getObjectByName(target.boardPos, true)) game.move(target);
                                }
                                //Killing player two pawns and jumping over
                                else if ((target.boardPos[0] == (x + 2)) && (target.boardPos[2] == (y - 2) || target.boardPos[2] == (y + 2))) {
                                    game.checkforjumpANDkill(playerdata.player, x, y, target)
                                }
                            } else {
                                if (angleDeg == -45 || angleDeg == 45 || angleDeg == 135 || angleDeg == -135) {
                                    game.moveSuperPawn(target, angleDeg)
                                }
                            }

                        }
                        //Movement of player two
                        if (playerdata.player == 1 && target.sname == "odds") {
                            let angleDeg = Math.atan2(target.boardPos[2] - y, target.boardPos[0] - x) * 180 / Math.PI;
                            console.log(angleDeg)
                            if (!game.selectedPawn.isSuper) {
                                if ((target.boardPos[0] == (x - 1)) && (target.boardPos[2] == (y - 1) || target.boardPos[2] == (y + 1))) {
                                    if (!game.scene.getObjectByName(target.boardPos, true)) game.move(target);
                                }
                                //Killing player one pawns and jumping over
                                else if ((target.boardPos[0] == (x - 2)) && (target.boardPos[2] == (y - 2) || target.boardPos[2] == (y + 2))) {
                                    game.checkforjumpANDkill(playerdata.player, x, y, target)
                                }
                            } else {
                                if (angleDeg == -45 || angleDeg == 45 || angleDeg == 135 || angleDeg == -135) {
                                    game.moveSuperPawn(target, angleDeg)
                                }
                            }
                        }
                    }

                }
            }
        })
    }
    checkforjumpANDkill(player, x, y, target) {
        if (player == 0) {
            if (target.boardPos[2] == (y - 2) && game.scene.getObjectByName((x + 1) + "x" + (y - 1), true) && game.scene.getObjectByName((x + 1) + "x" + (y - 1), true).sname == "p2") {
                game.move(target, 1, game.scene.getObjectByName((x + 1) + "x" + (y - 1), true))
                game.scene.remove(game.scene.getObjectByName((x + 1) + "x" + (y - 1), true))
            }
            else if (target.boardPos[2] == (y + 2) && game.scene.getObjectByName((x + 1) + "x" + (y + 1), true) && game.scene.getObjectByName((x + 1) + "x" + (y + 1), true).sname == "p2") {
                game.move(target, 1, game.scene.getObjectByName((x + 1) + "x" + (y + 1), true))
                game.scene.remove(game.scene.getObjectByName((x + 1) + "x" + (y + 1), true))
            }
        } else {
            if (target.boardPos[2] == (y - 2) && game.scene.getObjectByName((x - 1) + "x" + (y - 1), true) && game.scene.getObjectByName((x - 1) + "x" + (y - 1), true).sname == "p1") {
                game.move(target, 1, game.scene.getObjectByName((x - 1) + "x" + (y - 1), true))
                game.scene.remove(game.scene.getObjectByName((x - 1) + "x" + (y - 1), true))
            }
            else if (target.boardPos[2] == (y + 2) && game.scene.getObjectByName((x - 1) + "x" + (y + 1), true) && game.scene.getObjectByName((x - 1) + "x" + (y + 1), true).sname == "p1") {
                game.move(target, 1, game.scene.getObjectByName((x - 1) + "x" + (y + 1), true))
                game.scene.remove(game.scene.getObjectByName((x - 1) + "x" + (y + 1), true))
            }
        }
    }
    checkforjumptarget(player, x, y) {
        if (player == 0) {
            if ((x + 2) <= 7 && (y - 2) >= 0 && !game.scene.getObjectByName((x + 2) + "x" + (y - 2), true) && game.scene.getObjectByName((x + 1) + "x" + (y - 1), true) && game.scene.getObjectByName((x + 1) + "x" + (y - 1), true).sname == "p2" && game.scene.getObjectByName((x + 1) + "x" + (y - 1), true).jump != true) {
                return game.scene.getObjectByName((x + 1) + "x" + (y - 1), true)
            }
            else if ((x + 2) <= 7 && (y + 2) <= 7 && !game.scene.getObjectByName((x + 2) + "x" + (y + 2), true) && game.scene.getObjectByName((x + 1) + "x" + (y + 1), true) && game.scene.getObjectByName((x + 1) + "x" + (y + 1), true).sname == "p2" && game.scene.getObjectByName((x + 1) + "x" + (y + 1), true).jump != true) {
                return game.scene.getObjectByName((x + 1) + "x" + (y + 1), true)
            }
        } else {
            if ((x - 2) >= 0 && (y - 2) >= 0 && !game.scene.getObjectByName((x - 2) + "x" + (y - 2), true) && game.scene.getObjectByName((x - 1) + "x" + (y - 1), true) && game.scene.getObjectByName((x - 1) + "x" + (y - 1), true).sname == "p1" && game.scene.getObjectByName((x - 1) + "x" + (y - 1), true).jump != true) {
                return game.scene.getObjectByName((x - 1) + "x" + (y - 1), true)
            }
            else if ((x - 2) >= 0 && (y + 2) <= 7 && !game.scene.getObjectByName((x - 2) + "x" + (y + 2), true) && game.scene.getObjectByName((x - 1) + "x" + (y + 1), true) && game.scene.getObjectByName((x - 1) + "x" + (y + 1), true).sname == "p1" && game.scene.getObjectByName((x - 1) + "x" + (y + 1), true).jump != true) {
                return game.scene.getObjectByName((x - 1) + "x" + (y + 1), true)
            }
        }
        return "Unavailable";
    }
    checkforjump(player, x, y) {
        if (game.checkforjumptarget(player, x, y) != "Unavailable") {
            let target = game.checkforjumptarget(player, x, y)
            target.material = target.material.clone()
            target.jump = true;
            game.jumpTarget.push(target)
            target.material.color.setHex(0x551A8B)
        }
    }
    move(target, kill, killedPawn) {
        game.selectedPawn.position.set((250 + target.boardPos[2] * 50), (282), (250 + target.boardPos[0] * 50))
        game.selectedPawn.boardPos = target.boardPos
        let data = {
            "name": game.selectedPawn.name,
            "pos": game.selectedPawn.boardPos,
            "killed": [],
            "player": playerdata.player,
        }
        // if (playerdata.isPerformingAnotherJump) {
        //     for (let i = 0; i < playerdata.lastmove.length; i++) {
        //         data.push(playerdata.lastmove[i])
        //     }
        // }
        playerdata.lastmove.push(data)
        game.selectedPawn.name = target.boardPos
        if (kill == 1 && killedPawn) {
            data.killed.push(killedPawn.name)
            playerdata.points++
            if (playerdata.points == 12) {
                ui.handleWinCondition(true)
            }
            //Check if another jump is possible
            let pos = game.selectedPawn.boardPos
            let x = parseInt(pos[0])
            let y = parseInt(pos[2])
            if (game.checkforjumptarget(playerdata.player, x, y) != "Unavailable") {
                game.checkforjump(playerdata.player, x, y)
                game.checkforjump(playerdata.player, x, y)
                playerdata.isPerformingAnotherJump = true;
                return
            } else {
                playerdata.isPerformingAnotherJump = false;
            }
        }
        if ((playerdata.player == 0 && target.boardPos[0] == 7) || (playerdata.player == 1 && target.boardPos[0] == 0)) {
            game.selectedPawn.rotation.x = Math.PI / 2;
            game.selectedPawn.isSuper = true;
            data[0].super = true
        }
        data = JSON.stringify(playerdata.lastmove)
        console.log(data)
        net.send_move(data)
        playerdata.isPlayerRound = false
        game.clearSelected()
        playerdata.inter = setInterval(net.query_move, 500)
        playerdata.lastmove = []
        $("#round").text("OPONENT ROUND")
    }
    moveSuperPawn() {

    }
    clearSelected() {
        if (playerdata.player == 0) {
            game.selectedPawn.material = game.cylinder_material_2
            game.jumpTarget.forEach(element => {
                element.material = game.cylinder_material_1
            });
        }
        else {
            game.selectedPawn.material = game.cylinder_material_1
            game.jumpTarget.forEach(element => {
                element.material = game.cylinder_material_2
            });
        }
        game.selectedPawn = undefined
    }
}
