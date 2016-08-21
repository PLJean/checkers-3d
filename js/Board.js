function Board() {
    var dark = true;

    for (var r = 0; r < Board.SIZE; r++) {
        for (var c = 0; c < Board.SIZE; c++) {
            var tile, piece;
            if (dark) {
                tile = new Tile(color.DARK, c, r);
            }

            else {
                tile = new Tile(color.LIGHT, c, r);
            }

            if (r < 3 && dark) {
                piece = new Piece(team.BLACK, c, r);
                this.teamBlack.push(piece);
            }

            else if (r > 4 && dark) {
                piece = new Piece(team.RED, c, r);
                this.teamRed.push(piece);
            }

            this.tiles.push(tile);

            dark = !dark;
        }
        dark = !dark;
    }
}

Board.SIZE = 8;

Board.prototype.tiles = [];

Board.prototype.teamBlack = [];

Board.prototype.teamRed = [];

Board.prototype.tileAt = function(x, y) {
    return this.tiles[x + Board.SIZE * y];
};

Board.prototype.build = function (scene) {
    var startPosition = new THREE.Vector3(-4 * Tile.SIZE + 1/2 * Tile.SIZE, -4 * Tile.SIZE + 1/2 * Tile.SIZE, 0);

    for (var r = 0; r < Board.SIZE; r++) {
        for (var c = 0; c < Board.SIZE; c++) {
            var tileGeometry = new THREE.BoxGeometry(Tile.SIZE, Tile.SIZE, 1);

            var tileMaterial;
            if (this.tileAt(c, r).color == color.DARK)
                tileMaterial = new THREE.MeshBasicMaterial({color: 0x808080, vertexColors: THREE.FaceColors});
            else
                tileMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors: THREE.FaceColors});


            var newPosition = new THREE.Vector3(startPosition.x + Tile.SIZE * c, startPosition.y + Tile.SIZE * r, startPosition.z);

            this.tileAt(c, r).setPosition(newPosition);
            this.tileAt(c, r).setMesh(new THREE.Mesh(tileGeometry, tileMaterial));
            this.tileAt(c, r).mesh.position.set(newPosition.x, newPosition.y, newPosition.z);
            // console.log(this.tileAt(c, r).position);
            scene.add(this.tileAt(c, r).mesh);
            // console.log(newPosition);
        }
    }

    var pieceGeometry, pieceMaterial, col, row, piecePosition, i;
    for (i = 0; i < this.teamBlack.length; i++) {
        pieceGeometry = new THREE.CylinderGeometry(Tile.SIZE * .40, Tile.SIZE * .40, 1.25, 32);
        pieceGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad( 90 ) ));
        pieceMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, vertexColors: THREE.FaceColors});
        this.teamBlack[i].setMesh(new THREE.Mesh(pieceGeometry, pieceMaterial));
        col = this.teamBlack[i].col;
        row = this.teamBlack[i].row;
        piecePosition = this.tileAt(col, row).position;
        this.teamBlack[i].mesh.position.set(piecePosition.x, piecePosition.y, piecePosition.z);
        scene.add(this.teamBlack[i].mesh);
    }

    for (i = 0; i < this.teamRed.length; i++) {
        pieceGeometry = new THREE.CylinderGeometry(Tile.SIZE * .40, Tile.SIZE * .40, 1.25, 32);
        pieceGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad( 90 ) ));
        pieceMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000, vertexColors: THREE.FaceColors});
        this.teamRed[i].setMesh(new THREE.Mesh(pieceGeometry, pieceMaterial));
        col = this.teamRed[i].col;
        row = this.teamRed[i].row;
        piecePosition = this.tileAt(col, row).position;
        this.teamRed[i].mesh.position.set(piecePosition.x, piecePosition.y, piecePosition.z);
        scene.add(this.teamRed[i].mesh);
    }
};

Board.prototype.anyTilesClicked = function (x, y) {
    for (var r = 0; r < Board.SIZE; r++) {
        for (var c = 0; c < Board.SIZE; c++) {
            if (this.tileAt(c, r).isClicked(x, y)) {
                // console.log("r: " + r + " c: " + c);
            }
        }
    }
};