Board.SIZE = 8;

Board.prototype.holding = null;

Board.prototype.holdingSavedPosition = null;

Board.prototype.lastHolding = null;

Board.prototype.currentTurn = team.BLACK;

Board.prototype.multipleJumps = false;

Board.prototype.legalCircles = [];

Board.prototype.haveKing = false;

Board.prototype.tileAt = function(x, y) {
    return Tile.all[x + Board.SIZE * y];
};

Board.prototype.pieceAt = function(x, y) {
    // console.log(x + Board.SIZE * y);
    return Tile.all[x + Board.SIZE * y].piece;
};

Board.prototype.grab = function(x, y) {
    console.log("grab");
    var piece = this.pieceAt(x, y);
    if (this.holding == null && piece.team == this.currentTurn) {
        if (this.multipleJumps == false) this.holding = piece;
        else if(piece == this.lastHolding) this.holding = this.lastHolding;

        this.holdingSavedPosition = new THREE.Vector3(this.holding.mesh.position.x, this.holding.mesh.position.y, this.holding.mesh.position.z);
        console.log("out grab");

        return true;
    } else {
        if (this.holding != null) console.log("Cannot grab. Currently holding: (" + this.holding + ")" );
        else if (piece.team != this.currentTurn) console.log("Not your turn.");
        console.log("out grab");

        return false;
    }
};

Board.prototype.moveHolding = function (scene, camera, x, y) {

    if (this.holding != null) {
        // console.log("in");
        // console.log(this.holding.mesh.position.z);
        var vector = new THREE.Vector3(x, y, this.holding.mesh.position.z);
        vector.unproject( camera );
        var dir = vector.sub( camera.position ).normalize();
        var distance = - camera.position.z / dir.z;
        var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
        pos.z = this.holdingSavedPosition.z + 0.50;
        this.holding.mesh.position.copy(pos);
        // console.log("out");
        // console.log(this.holding.mesh.position.z);
    }
};

Board.prototype.drop = function(x, y, scene) {
    var legal = this.isLegal(x, y);
    if (this.holding == null || !legal || x == this.holding.mesh["col"] && y == this.holding.mesh["row"]) {
        this.holding.mesh.position.set(this.holdingSavedPosition.x, this.holdingSavedPosition.y, this.holdingSavedPosition.z);
        this.holding = null;

        return false;
    }

    else if (legal) {
        var col = this.holding.mesh["col"];
        var row = this.holding.mesh["row"];
        if (this.holding.king == false) {
            if ((y == Board.SIZE - 1 && this.holding.team == team.BLACK)  ||
                (y == 0 && this.holding.team == team.RED)) {
                this.haveKing = true;
            }
        }

        var jumpX = null, jumpY = null;
        if (Math.abs(col - x) == 2 && Math.abs(row - y) == 2) {
            if (x < col) jumpX = x + 1;
            else jumpX = x - 1;

            if (y < row) jumpY = y + 1;
            else jumpY = y - 1;

            var jumpPiece = this.pieceAt(jumpX, jumpY);
            if (jumpPiece.team == team.BLACK) {
                for (var i = 0; i < Piece.teamBlack.length; i++) {
                    if (Piece.teamBlack[i] == jumpPiece) {
                        Piece.teamBlack.splice(i, 1);
                    }
                }
            }
            else {
                for (var i = 0; i < Piece.teamRed.length; i++) {
                    if (Piece.teamRed[i] == jumpPiece) {
                        Piece.teamRed.splice(i, 1);
                    }
                }
            }
            this.tileAt(jumpX, jumpY).removePiece();
            // console.log("Tile at " + x + ", " + y + " is null");
            scene.remove(jumpPiece.mesh);
        }

        var newTile = this.tileAt(x, y);
        this.holding.mesh["col"] = x;
        this.holding.mesh["row"] = y;

        this.holding.mesh.position.set(newTile.position.x, newTile.position.y, this.holdingSavedPosition.z);
        console.log("oldposition:");
        console.log(this.holding.mesh.position.z);
        newTile.placePiece(this.holding);
        this.tileAt(col, row).removePiece();

        this.lastHolding = this.holding;

        console.log("allJumps(" + x + ", " + y + ")");
        console.log(this.allJumps(x, y));
        if ((jumpX == null && jumpY == null) || this.allJumps(x, y).length == 0) {
            // this.currentTurn = this.currentTurn == team.BLACK ? team.RED : team.BLACK;
            this.multipleJumps = false;
            this.nextTurn(scene);

            if (this.haveKing == true) {
                this.haveKing = false;
                this.kingMe(scene, this.holding);
            }
        }

        else if (this.allJumps(x, y).length > 0) {
            this.multipleJumps = true;
        }
        console.log("newposition:");
        console.log(this.holding.mesh.position.z);
        this.holding = null;

        return true;
    }

    return false;
};

Board.prototype.kingMe = function(scene, piece) {
    piece.king = true;
    var bottomKingGeometry, topKingGeometry, kingMaterial, col, row, x, y, z;
    col = piece.mesh["col"];
    row = piece.mesh["row"];
    x = piece.mesh.position.x;
    y = piece.mesh.position.y;
    z = piece.mesh.position.z;
    bottomKingGeometry = piece.mesh.geometry.clone();
    topKingGeometry = piece.mesh.geometry.clone();
    scene.remove(piece.mesh);

    topKingGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0, 0.40));

    if (piece.team == team.BLACK)
        kingMaterial = new THREE.MeshLambertMaterial({color: 0xD1D1D1, vertexColors: THREE.FaceColors});
    else
        kingMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, vertexColors: THREE.FaceColors});

    var bottomMesh = new THREE.Mesh(bottomKingGeometry, kingMaterial);
    bottomMesh.updateMatrix();
    topKingGeometry.merge(bottomMesh.geometry, bottomMesh.matrix);

    piece.setMesh(new THREE.Mesh(topKingGeometry, kingMaterial));
    scene.add(piece.mesh);
    piece.mesh.position.set(x, y, z);
    piece.mesh["checkersObject"] = 'Piece';
    piece.mesh["col"] = col;
    piece.mesh["row"] = row;
};

Board.prototype.isGameDone = function() {
    if (Piece.teamBlack.length == 0) {

    }
    else if (Piece.teamRed.length == 0) {

    }
};

Board.prototype.isLegal = function(x, y) {
    // console.log("in isLegal(" + x + ", " + y + ")");
    // console.log(x, + ", " + y);
    if (this.holding == null) return false;

    if (x < 0 || x > Board.SIZE - 1 || y < 0 || y > Board.SIZE - 1)
        return false;

    var col = this.holding.mesh["col"];
    var row = this.holding.mesh["row"];

    if (Math.abs(col - x) != Math.abs(row - y))
        return false;

    // console.log("passed 2");
    // Is there a piece already where holding is trying to go?
    if (this.pieceAt(x, y) != null)
        return false;

    // console.log("passed 3");
    // Is holding is trying to stay or go horizontal/vertical.
    if (Math.abs(col - x) < 1 || Math.abs(row - y) < 1)
        return false;

    if (this.holding.king == false) {
        if (Math.abs(col - x) == 2 && Math.abs(row - y) == 2) {
                var jumpX, jumpY;
                if (x < col) jumpX = x + 1;
                else jumpX = x - 1;

                if (y < row) jumpY = y + 1;
                else jumpY = y - 1;

                var jumpPiece = this.pieceAt(jumpX, jumpY);

                if (jumpPiece == null)
                    return false;

                else if (jumpPiece.team == this.holding.team) {
                    return false;
                }
            }

            // console.log("passed 4");
        else if (this.holding.team == team.BLACK && y < row)
            return false;

        else if (this.holding.team == team.RED && y > row)
            return false;
    }

    else if (this.holding.king == true) {
        if (this.pieceAt(x, y) != null) return false;
    }

    return true;
};

Board.prototype.allMoves = function(x, y) {
    console.log("allMoves");
    if (this.holding.king == true)
        var possibleMoves = [[x - 1, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y + 1],
                             [x - 2, y - 2], [x - 2, y + 2], [x + 2, y - 2], [x + 2, y + 2],
                             [x - 3, y - 3], [x - 3, y + 3], [x + 3, y - 3], [x + 3, y + 3],
                             [x - 4, y - 4], [x - 4, y + 4], [x + 4, y - 4], [x + 4, y + 4],
                             [x - 5, y - 5], [x - 5, y + 5], [x + 5, y - 5], [x + 5, y + 5],
                             [x - 6, y - 6], [x - 6, y + 6], [x + 6, y - 6], [x + 6, y + 6],
                             [x - 7, y - 7], [x - 7, y + 7], [x + 7, y - 7], [x + 7, y + 7],
                             [x - 8, y - 8], [x - 8, y + 8], [x + 8, y - 8], [x + 8, y + 8]];
    else
        var possibleMoves = [[x - 1, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y + 1], [x - 2, y - 2], [x - 2, y + 2], [x + 2, y - 2], [x + 2, y + 2]];

    var moves = [];
    for (var i = 0; i < possibleMoves.length; i++) {
        if(this.isLegal(possibleMoves[i][0], possibleMoves[i][1])) {
            // console.log(possibleMoves[i][0], possibleMoves[i][1]);
            moves.push(possibleMoves[i]);
        }
    }

    return moves;
};

Board.prototype.allJumps = function(x, y) {
    // console.log("all jumps");
    if (this.holding == null) return [];
    var col = this.holding.mesh["col"];
    var row = this.holding.mesh["row"];
    var moves = this.allMoves(x, y);
    var jumps = [];
    for (var i = 0; i < moves.length; i++) {
        if (this.holding.king == false && Math.abs(moves[i][0] - x) == 2 && Math.abs(moves[i][1] - y) == 2 && this.pieceAt(x, y).team != this.pieceAt(moves[i][0], moves[i][1]).team ) {
            jumps.push(moves[i]);
        }
        else if (this.holding.king == true) {
            if (Math.abs(moves[i][0] - x) > 1 && Math.abs(moves[i][1] - y) > 1) {
                var jumpX, jumpY;
                if (x < col) jumpX = x + 1;
                else jumpX = x - 1;

                if (y < row) jumpY = y + 1;
                else jumpY = y - 1;

                if (this.pieceAt(jumpY, jumpY) != null && this.pieceAt(x, y).team != this.pieceAt(moves[i][0], moves[i][1]).team) {
                    jumps.push(moves[i]);
                }

            }
        }


    }
    // console.log(jumps);

    return jumps;
};

Board.prototype.showLegals = function(x, y, scene) {
    // console.log("showing Legals");
    var piece = this.pieceAt(x, y);
    // console.log("in showLegals()");
    // console.log(piece);
    if (piece == null) return;
    // console.log("(" + x + ", " + y + ")");
    var jumps = this.allJumps(x, y);
    var moves = jumps.length < 1 ? this.allMoves(x, y) : jumps;
    console.log(moves);
    console.log(jumps);
    // console.log(moves);
    for (var i = 0; i < moves.length; i++) {
        var geometry = new THREE.CircleGeometry(Tile.SIZE * .40, 32);
        // var geometry = new THREE.CylinderGeometry(Tile.SIZE * .40, 32);
        var material = (piece.team == team.BLACK) ? new THREE.LineBasicMaterial({color: 0x000000}) : new THREE.LineBasicMaterial({color: 0xff0000});

        geometry.vertices.shift();
        var circle = new THREE.Line(geometry, material);
        var tile = this.tileAt(moves[i][0], moves[i][1]);
        circle.position.set(tile.position.x, tile.position.y, tile.position.z + 0.15);
        circle.name = 'legal' + i;
        this.legalCircles.push(circle);
        // console.log("circle");
        // console.log(circle);
        scene.add(circle);
    }

    // console.log(moves);
};

Board.prototype.unshowLegals = function(scene) {
    for (var i = 0; i < this.legalCircles.length; i++) {
        scene.remove(this.legalCircles[i]);
    }

    this.legalCircles = [];
};



Board.prototype.nextTurn = function() {
    if (this.currentTurn == team.BLACK) {
        this.currentTurn = team.RED;
        $('#black').html("<div style='color: black'>WHITE</div><div style='color: red; font-weight:bold;'>RED</div>");
    }
    else {
        this.currentTurn = team.BLACK;
        $('#black').html("<div style='font-weight:bold;'>WHITE</div><div style='color: black'>RED</div>");
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

Board.prototype.render = function(scene) {
    if (this.holding) this.moveHolding();

    this.holding.mesh.position.set();
};

Board.prototype.build = function (scene) {
    var startPosition = new THREE.Vector3(-4 * Tile.SIZE + 1/2 * Tile.SIZE, -4 * Tile.SIZE + 1/2 * Tile.SIZE, 0);

    for (var r = 0; r < Board.SIZE; r++) {
        for (var c = 0; c < Board.SIZE; c++) {
            var tileGeometry = new THREE.BoxGeometry(Tile.SIZE, Tile.SIZE, .05);

            var tileMaterial;
            if (this.tileAt(c, r).color == color.DARK)
                tileMaterial = new THREE.MeshLambertMaterial({color: 0x808080, vertexColors: THREE.FaceColors});
            else
                tileMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, vertexColors: THREE.FaceColors});


            var newPosition = new THREE.Vector3(startPosition.x + Tile.SIZE * c, startPosition.y + Tile.SIZE * r, startPosition.z);

            this.tileAt(c, r).make(tileGeometry, tileMaterial, newPosition);
            scene.add(this.tileAt(c, r).mesh);

            var piece = this.tileAt(c, r).piece;
            if (piece != null) {
                var pieceGeometry, bottomPieceGeometry, topPieceGeometry, pieceMaterial, col, row, piecePosition, i;
                bottomPieceGeometry = new THREE.CylinderGeometry(Tile.SIZE * .35, Tile.SIZE * .40, .20, 32);
                topPieceGeometry = new THREE.CylinderGeometry(Tile.SIZE * .40, Tile.SIZE * .35, .20, 32);

                bottomPieceGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad( 90 ) ));
                topPieceGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad( 90 ) ));
                topPieceGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0, 0.20));

                if (piece.team == team.BLACK)
                    pieceMaterial = new THREE.MeshLambertMaterial({color: 0xD1D1D1, vertexColors: THREE.FaceColors});
                else
                    pieceMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, vertexColors: THREE.FaceColors});

                var bottomMesh = new THREE.Mesh(bottomPieceGeometry, pieceMaterial);
                bottomMesh.updateMatrix();
                topPieceGeometry.merge(bottomMesh.geometry, bottomMesh.matrix);

                piece.setMesh(new THREE.Mesh(topPieceGeometry, pieceMaterial));
                // piece.setMesh(new THREE.Mesh(pieceGeometry, pieceMaterial));
                // var bottomPieceGeometry.mesh.updateMatrix();



                piece.mesh["checkersObject"] = 'Piece';
                piece.mesh["col"] = c;
                piece.mesh["row"] = r;
                piecePosition = this.tileAt(c, r).position;

                piece.mesh.position.set(piecePosition.x, piecePosition.y, piecePosition.z + 0.10);
                scene.add(piece.mesh);
            }
        }
    }

    var board_thickness = 7;
    for (var lvl = 1; lvl < board_thickness; lvl++) {
        var newSize = Tile.SIZE * Board.SIZE + 1 / (Tile.SIZE * 2) * lvl;
        var levelGeometry = new THREE.BoxGeometry(newSize, newSize, 0.05);
        if (lvl % 2 == 0)
            var levelMaterial = new THREE.MeshLambertMaterial({color: 0x666666, vertexColors: THREE.FaceColors});

        else
            var levelMaterial = new THREE.MeshLambertMaterial({color: 0x808080, vertexColors: THREE.FaceColors});


        var levelMesh = new THREE.Mesh(levelGeometry, levelMaterial);
        levelMesh.position.set(0,0,-0.05 * lvl);
        // this.setPosition(position);
        // this.setMesh(new THREE.Mesh(geometry, material));
        // this.mesh.position.set(position.x, position.y, position.z);
        // this.mesh['checkersObject'] = 'Tile';
        // this.mesh['row'] = this.row;
        // this.mesh['col'] = this.col;
        scene.add(levelMesh);
    }
};

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
                tile.placePiece(piece);
                Piece.teamBlack.push(piece);
            }

            else if (r > 4 && dark) {
                piece = new Piece(team.RED, c, r);
                tile.placePiece(piece);
                Piece.teamRed.push(piece);
            }

            // this.tiles.push(tile);
            Tile.all.push(tile);
            dark = !dark;
        }
        dark = !dark;
    }
}

