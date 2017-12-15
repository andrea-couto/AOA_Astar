
// maze generation

function Mazegen(cols, rows, x, y, w, h, percentWalls) {

  //making coding simpler
  this.cols = cols;
  this.rows = rows;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  //initialize variables
  this.grid = [];
  this.path = [];
  this.start = { x: 0, y: 0 }; //start is top left
  this.end = { x: cols - 1, y: rows - 1 };  //end is bottom right

  // all Nodes are initially walls
  for (var i = 0; i < this.cols; i++) {
      this.grid[i] = [];
      for (var j = 0; j < this.rows; j++) {
          this.grid[i][j] = new Node(i, j, x + i * w /this.cols, y + j * h / this.rows, w / this.cols, h / this.rows, true, this.grid);
      }
  }

  var c = 0;
  var r = 0;
  var mazePath = [[0, 0]];

  while (mazePath.length) {

    //the neighboring nodes for the node the maze generation alg. is currently on
    var left = this.grid[c][r - 2];
    var right = this.grid[c][r + 2];
    var up = this.grid[c - 2] && this.grid[c - 2][r];
    var down = this.grid[c + 2] && this.grid[c + 2][r];

    //current node variables
    var current = this.grid[c][r];
    current.visited = true;
    current.wall = false;

    //checking the neighbors of current Node
    var check = [] 
    if (left && !left.visited) {
      check.push(left);
    }

    if (up && !up.visited) {
      check.push(up);
    }

    if (right && !right.visited) {
      check.push(right);
    }

    if (down && !down.visited) {
      check.push(down);
    }

    // if theres a valid neighbor
    if (check.length) {
      mazePath.push([c, r]);

      // choose random direction
      var direction = check[Math.floor(Math.random() * check.length)];

      //randomly remove walls from chosen direction
      if (direction == left) {
        left.wall = false;
        this.grid[c][r - 1].wall = false;
        r -= 2;
      }

      else if (direction == up) {
        up.wall = false;
        this.grid[c - 1][r].wall = false;
        c -= 2;
      }

      else if (direction == right) {
        right.wall = false;
        this.grid[c][r + 1].wall = false;
        r += 2;
      }

      else if (direction == down) {
        down.wall = false;
        this.grid[c + 1][r].wall = false;
        c += 2;
      }
    }
    else {
      // if stuck backtrack
      var next = mazePath.pop();
      c = next[0];
      r = next[1];
    }
  }

  // no walls at start and end so there is a better change of a solution
  this.grid[cols - 1][rows - 2].wall = false;
  this.grid[cols - 2][rows - 1].wall = false;
  this.grid[this.end.x][this.end.y].wall = false;
  this.grid[this.start.x][this.start.y].wall = false;
}
