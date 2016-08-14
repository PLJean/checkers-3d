var colors = {
    DARK: 0,
    LIGHT: 1
};

function Tile() {

}

Tile.prototype.color = null;

Tile.prototype.piece = null;

Tile.constructor = function (color) {
   this.color = color;
};

Tile.prototype.placePiece = function (piece) {
    this.piece = piece;
};

Tile.prototype.removePiece = function() {
    this.piece = null;
};
