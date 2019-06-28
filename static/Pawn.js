console.log("PAWNS ARE READY")
class Pawn extends THREE.Mesh {
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
    set isSuper(isitsuper) {
        this._isSuper = isitsuper
    }
    get isSuper() {
        return this._isSuper
    }
    set sname(name) {
        this._sname = name
    }
    get sname() {
        return this._sname
    }
    set jump(name) {
        this._jump = name
    }
    get jump() {
        return this._jump
    }
    set kolor(val) {
        this._kolor = val
    }
    get kolor() {
        return this._kolor
    }
}