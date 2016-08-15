function Board() {
    var TILE_SIZE = 1;
}

Board.constructor = function () {
    var index;
    for (index = 0; index < Board.SIZE * Board.SIZE; index++) {
        if (index % 2 == 0)
            this.tiles.push(new Tile(color.DARK));
        else
            this.tiles.push(new Tile(color.LIGHT));
    }

    for (index = 0; index < Board.SIZE * 2; index++) {
        this.tiles[index].placePiece(new Piece(team.BLACK));
    }

    for (index = Board.SIZE * Board.SIZE - Board.SIZE * 2; index < Board.SIZE * Board.SIZE; index++) {
        this.tiles[index].placePiece(new Piece(team.RED));
    }

};

Board.prototype.tiles = [];

Board.prototype.at = function(x, y) {
    return this.tiles[x + Board.SIZE * y];
};

Board.prototype.build = function (scene) {

    var geometry = new THREE.BoxGeometry(1, 1, 1);

    var material = new THREE.MeshBasicMaterial({color: 0xff00ff, vertexColors: THREE.FaceColors});

    var tileCube = new THREE.Mesh(geometry, material);

    // console.log(tileCube.position);
    // tileCube.position.set(1,1,1);
    scene.add(tileCube);
};

Board.SIZE = 10;
