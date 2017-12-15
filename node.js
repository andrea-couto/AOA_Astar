
//template for Nodes in the application
function Node(i, j, x, y, width, height, isWall, grid) {

    this.grid = grid;

    // Location
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // f, g, and h values for A*
    this.f = 0;
    this.g = 0;
    this.h = 0;

    // Neighbors
    this.neighbors = undefined;
    this.neighboringWalls = undefined;

    // for tracing the path in sketch.js
    this.previous = undefined;

    // keeps track if the node is a wall or not
    this.wall = isWall;

    // important for A*
    this.visited = false;

    // Display the node
    this.show = function(color) {
        //if its a wall it will be displayed as such
        if (this.wall) {
            fill(0);
            noStroke();

            rect(this.x, this.y, this.width, this.height);

            stroke(0);
            strokeWeight(this.width / 2);

            var nWalls = this.getNeighboringWalls(this.grid);
            
            for (var i = 0; i < nWalls.length; i++) {
                var nw = nWalls[i];
            }
            //if its not a wall it will be the color passed to the function in sketch.js
        } else if (color) {
            fill(color);
            noStroke();
            rect(this.x, this.y, this.width, this.height);
        }
    }

    //returns the neighbors for the node
    this.getNeighbors = function() {
        if (!this.neighbors) {
            this.populateNeighbors();
        }
        return this.neighbors;
    }

    //returns the neighboring walls
    this.getNeighboringWalls = function(grid) {

        if (!this.neighboringWalls) {
            this.populateNeighbors();
        }

        return this.neighboringWalls;
    }

    //left up right down movement for A*
    var LURDMoves = [ 
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1]
    ];

    //how the node can move diagonally
    var DiagonalMoves = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1]
    ];

    //for blocking diagonal moves under circumstances
    var DiagonalBlockers = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0]
    ];

    //returns node if the node is valid. Otherwise is could be outside the confines of the canvas.
    this.getNode = function(i, j) {
        if (i < 0 || i >= this.grid.length ||
            j < 0 || j >= this.grid[0].length) {
            return null;
        }
        return this.grid[i][j];
    }

    //populate neighbor move and neighbor wall arrays
    this.populateNeighbors = function() {
        this.neighbors = [];
        this.neighboringWalls = [];

        //Add Left/Up/Right/Down Moves
        for (var i = 0; i < 4; i++) {
            var node = this.getNode(this.i + LURDMoves[i][0], this.j + LURDMoves[i][1]);
            if (node != null) {
                if (!node.wall) {
                    this.neighbors.push(node);
                } else {
                    this.neighboringWalls.push(node);
                }
            }
        }

        // This part describes how a node can move diagonally
        for (var i = 0; i < 4; i++) {
            var gridX = this.i + DiagonalMoves[i][0];
            var gridY = this.j + DiagonalMoves[i][1];

            var node = this.getNode(gridX, gridY);

            if (node != null) {
                if (!node.wall) {
                    //Check if blocked by surrounding walls
                    var border1 = DiagonalBlockers[i][0];
                    var border2 = DiagonalBlockers[i][1];
                    //no need to protect against OOB as diagonal move
                    //check ensures that blocker refs must be valid
                    var blocker1 = this.grid[this.i + LURDMoves[border1][0]]
                                            [this.j + LURDMoves[border1][1]];
                    var blocker2 = this.grid[this.i + LURDMoves[border2][0]]
                                            [this.j + LURDMoves[border2][1]];

                    if (!blocker1.wall || !blocker2.wall) {
                        //one or both are open so we can move past
                        this.neighbors.push(node);
                    }
                }
                if (node.wall) {
                    this.neighboringWalls.push(node);
                }
            }
        }
    }

}
