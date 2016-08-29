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

Tile.all = [];

Tile.prototype.placePiece = function (piece) {
    this.piece = piece;
    if (piece != null && piece.mesh != null)
        piece.mesh.position.set(this.position.x, this.position.y, this.piece.mesh.position.z);
};

Tile.prototype.removePiece = function() {
    this.piece = null;
};

Tile.prototype.setMesh = function(mesh) {
    this.mesh = mesh;
};

Tile.prototype.make = function(geometry, material, position) {
    this.setPosition(position);
    this.setMesh(new THREE.Mesh(geometry, material));
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh['checkersObject'] = 'Tile';
    this.mesh['row'] = this.row;
    this.mesh['col'] = this.col;
};

Tile.prototype.setPosition = function (vector) {
    this.position = vector;
};
