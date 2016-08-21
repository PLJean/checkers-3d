var color = {
    DARK: 0,
    LIGHT: 1
};

function Tile(color, col, row) {
    this.color = color;
    this.col = col;
    this.row = row;
}

Tile.SIZE = 1.5;

Tile.prototype.color = null;

Tile.prototype.piece = null;

Tile.prototype.row = null;

Tile.prototype.col = null;

Tile.prototype.position = null;

Tile.prototype.mesh = null;

Tile.prototype.placePiece = function (piece) {
    this.piece = piece;
};

Tile.prototype.removePiece = function() {
    this.piece = null;
};

Tile.prototype.setMesh = function(mesh) {
    this.mesh = mesh;
};

Tile.prototype.isClicked = function(x, y) {
    // console.log(x + ", " + y);
    var margin = Tile.SIZE / 2;
    // console.log(this.position.x);
    if (this.position.x  - margin >= x && x < this.position.x + margin &&
        this.position.y - margin >= y && y < this.position.y + margin) {
        return true;
    }

    return false;
};

Tile.prototype.setPosition = function (vector) {
    this.position = vector;
};
