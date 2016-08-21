var team = {
    BLACK: 0,
    RED: 1
};

Piece.prototype.team = null;

Piece.prototype.col = null;

Piece.prototype.row = null;

Piece.prototype.mesh = null;

function Piece(team, col, row) {
    this.team = team;
    this.col = col;
    this.row = row;
}

Piece.prototype.setMesh = function(mesh) {
    this.mesh = mesh;
};

