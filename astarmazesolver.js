
function AStarMazeSolver(map, start, end) {
    this.map = map;
    this.lastCheckedNode = start;
    this.openSet = [];
    this.closedSet = [];
    this.start = start;
    this.end = end;

    //add start to open set
    this.openSet.push(start); 

    // dist calculates the distance between two points
    //uses euclidean distance to measure the distance between a and b
    this.heuristic = function(a, b) {
        var d;
        d = dist(a.i, a.j, b.i, b.j);
        return d;
    }

    // no easy way to remove from array in javascript
    this.removeFromArray = function(arr, elt) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elt) {
                arr.splice(i, 1);
            }
        }
    }

// runs for each step of the process
    this.step = function() {
        var spacing = 470;

        //if there are nodes in the open set
        if (this.openSet.length > 0) {

            // calculate next node to explore neighbors
            var bestOption = 0; 
            //for each node in the openSet find the node with lowest fcost
            for (var i = 1; i < this.openSet.length; i++) {
                if (this.openSet[i].f < this.openSet[bestOption].f) {
                    bestOption = i;
                }
                //if tie keep one with longest calculated path
                if (this.openSet[i].f == this.openSet[bestOption].f) {
                    if (this.openSet[i].g > this.openSet[bestOption].g) {
                        bestOption = i;
                    }
                }
            }
            //current node is the best option we calculated
            var current = this.openSet[bestOption];
            this.lastCheckedNode = current;

            //if the node is the last node were done
            if (current === this.end) {
                return 1;
            }

            // move current from open to closed
            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);

            // get neighbors of current
            var neighbors = current.getNeighbors();

            //for each neighbor 
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                // make sure not in closedSet
                if (!this.closedSet.includes(neighbor)) {
                    // calculate temp weight for this possible move
                    var tempG = current.g + this.heuristic(neighbor, current);

                    // if its not in openSet already move it there
                    if (!this.openSet.includes(neighbor)) {
                        this.openSet.push(neighbor);
                    } 
                    else if (tempG >= neighbor.g) {
                        continue;  // not better path
                    }

                    neighbor.g = tempG;  //weight for path so far
                    neighbor.h = this.heuristic(neighbor, end); //dist from node to end node
                    neighbor.f = neighbor.g + neighbor.h;  //fcost
                    neighbor.previous = current;
                }

            }

            return 0;

        } else {
            return -1;
        }
    }
}

//This function is printing the openset and closedset lists on the webpage
function dothething (openSet, closedSet) {
    var spacingo = 470;  //y axis
    var spacingc = 470;  //y axis
    var horospacing = 215; //x axis
    for (var i = 0; i < openSet.length; i++) {
        text(openSet[i].i + " : " + openSet[i].j, 70, spacingo);
        spacingo += 15;
    }

    for (var i = 0; i < closedSet.length; i++) {
        text(closedSet[i].i + " : " + closedSet[i].j, horospacing, spacingc);
        spacingc += 15;
        if(spacingc > 900){
            horospacing += 55;
            spacingc = 470;
        }
    }
}