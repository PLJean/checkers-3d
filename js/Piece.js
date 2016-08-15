var team = {
    BLACK: 0,
    RED: 1
};

function Piece() {
}


Piece.constructor = function (team) {
    this.team = team;
};

Piece.prototype.team = null;
