function Board() {
    var index;
    var dark = true;

    for (var r = 0; r < Board.SIZE; r++) {
        for (var c = 0; c < Board.SIZE; c++) {
            if (dark)
                this.tiles.push(new Tile(color.DARK));
            else
                this.tiles.push(new Tile(color.LIGHT));

            dark = !dark;
        }
        dark = !dark;
    }

    for (index = 0; index < Board.SIZE * 2; index++) {
        this.tiles[index].placePiece(new Piece(team.BLACK));
    }

    for (index = Board.SIZE * Board.SIZE - Board.SIZE * 2; index < Board.SIZE * Board.SIZE; index++) {
        this.tiles[index].placePiece(new Piece(team.RED));
    }
}

Board.prototype.tiles = [];

Board.prototype.at = function(x, y) {
    return this.tiles[x + Board.SIZE * y];
};

Board.prototype.build = function (scene) {
    var position = new THREE.Vector3(-5 * Board.TILE_SIZE, -5 * Board.TILE_SIZE, 0);

    for (var r = 0; r < Board.SIZE; r++) {
        for (var c = 0; c < Board.SIZE; c++) {
            var geometry = new THREE.BoxGeometry(1, 1, 1);

            console.log(this.at(0, 0));
            if (this.at(c, r).color == color.DARK)
                var material = new THREE.MeshBasicMaterial({color: 0x808080, vertexColors: THREE.FaceColors});
            else
                var material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors: THREE.FaceColors});

            var tileCube = new THREE.Mesh(geometry, material);

            // console.log(tileCube.position);
            tileCube.position.set(position.x + Board.TILE_SIZE * c, position.y + Board.TILE_SIZE * r, position.z);
            scene.add(tileCube);
        }
    }


};

Board.SIZE = 10;
Board.TILE_SIZE = 1;