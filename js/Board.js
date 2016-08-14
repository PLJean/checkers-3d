function Board() {
}

Board.prototype.tiles = [];

Board.SIZE = 8;

Board.constructor = function () {
    for (var i = 0; i < Board.SIZE * Board.SIZE; i++) {
        if (i % 2 == 0)
            this.tiles.push(new Tile(colors.DARK));
        else
            this.tiles.push(new Tile(colors.LIGHT));
    }
};
