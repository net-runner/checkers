console.log("TILES ARE READY")
class Tile extends THREE.Mesh {
    constructor(geometry, material) {
        super()
        this.geometry = geometry
        this.material = material
    }
    set boardPos(position) {
        this._bpos = position
    }
    get boardPos() {
        return this._bpos
    }
    set sname(name) {
        this._sname = name
    }
    get sname() {
        return this._sname
    }
    set kolor(val) {
        this._kolor = val
    }
    get kolor() {
        return this._kolor
    }
}