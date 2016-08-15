var color = {
    DARK: 0,
    LIGHT: 1
};

function Tile() {
}

Tile.constructor = function (color) {
   this.color = color;
};

Tile.prototype.color = null;

Tile.prototype.piece = null;

Tile.prototype.placePiece = function (piece) {
    this.piece = piece;
};

Tile.prototype.removePiece = function() {
    this.piece = null;
};
