var team = {
    BLACK: 0,
    RED: 1
};

Piece.prototype.team = null;

Piece.prototype.mesh = null;

Piece.prototype.king = false;

Piece.teamBlack = [];

Piece.teamRed = [];

function Piece(team, col, row) {
    this.team = team;
    this.col = col;
    this.row = row;
}

Piece.prototype.setMesh = function(mesh) {
    this.mesh = mesh;
};

Piece.prototype.setPosition = function(col, row) {
    this.col = col;
    this.row = row;
};

Piece.prototype.King = function() {

};
