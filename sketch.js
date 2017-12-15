
//how dense the maze is
var cols = 20;
var rows = 20;

// % of cells that are walls
var percentWalls = 0.2;

//variables that will be used later
var gamemap;
var uiElements = [];
var paused = true;
var pathfinder;
var status = "";
var stepsAllowed = 0;
var runPauseButton;

//map variables
var mapx = 10;
var mapy = 10;
var mapw = 410;
var maph = 410;

//this function creates the variables that hold the information needed to make the application
function initializeScreen(rows, cols) {
    mapGraphic = null;
    gamemap = new Mazegen(cols, rows, mapx, mapy, mapw, maph, percentWalls); 
    start = gamemap.grid[0][0];
    end = gamemap.grid[cols - 1][rows - 1];
    start.wall = false;
    end.wall = false;

    pathfinder = new AStarMazeSolver(gamemap, start, end);
}

//this function creates the canvas and the GUI elements
function setup() {
    var canvas = createCanvas(900,900);
    canvas.parent('sketch-holder');

    initializeScreen(cols, rows);

    runPauseButton = new Button("run", 430, 20, 50, 30, runpause);
    uiElements.push(runPauseButton);
    uiElements.push(new Button("step", 430, 70, 50, 30, step));
    uiElements.push(new Button("restart", 430, 120, 50, 30, restart));
}

//for each step this updates the status section in index.html
function searchStep() {
    if (!paused || stepsAllowed > 0) {
        var result = pathfinder.step();
        stepsAllowed--;

        switch (result) {
            case -1:
                status = "no path";
                pauseUnpause(true);
                break;
            case 1:
                status = "shortest path found!";
                pauseUnpause(true);
                break;
            case 0:
                status = "searching"
                break;
        }
    }
}

var mapGraphic = null;

//this function draws and captures the maze
function drawMap() {
    if (mapGraphic == null) {
        for (var i = 0; i < gamemap.cols; i++) {
            for (var j = 0; j < gamemap.rows; j++) {
                if (gamemap.grid[i][j].wall) {
                    gamemap.grid[i][j].show(color(255));
                }
            }
        }
        //grabs image from the maze generation algorithm
        mapGraphic = get(gamemap.x, gamemap.y, gamemap.w, gamemap.h);
    }
    image(mapGraphic, gamemap.x, gamemap.y);
}

//draw will repeat over and over while the webpage is up
//it is what puts the whole application together
function draw() {

    //is the application running or step was pressed?
    searchStep();

    //draw the background for the maze
    background(255);

    //draw the GUI elements
    doGUI();

    //draw the status, closedSet, and openSet
    document.getElementById('status').innerHTML = status;
    text("openSet: ", 10, 470);
    text("closedSet: ", 150, 470);

    //printing the openSet and closedSet to webpage
    dothething(pathfinder.openSet, pathfinder.closedSet);

    //draws the maze
    drawMap();

    //color the closedSet
    for (var i = 0; i < pathfinder.closedSet.length; i++) {
        pathfinder.closedSet[i].show(color(255, 0, 0, 50));
    }

    var infoNode = null;

    //color the openSet and make them infoNodes so users can access their information
    for (var i = 0; i < pathfinder.openSet.length; i++) {
        var node = pathfinder.openSet[i];
        node.show(color(0, 255, 0, 50));
        if (mouseX > node.x && mouseX < node.x + node.width &&
            mouseY > node.y && mouseY < node.y + node.height) {
            infoNode = node;
        }  //display info when user hovers over openSet nodes
    }

    fill(0);
    //information available to user when hovering over the openSet nodes
    if (infoNode != null) {
        text("f = " + round(infoNode.f), 430, 230);  //passing text and location of text 
        text("g = " + round(infoNode.g), 430, 250);  //this text is displayed when hovered over nodes
        text("h = " + round(infoNode.h), 430, 270);
        text("col = " + infoNode.i, 430, 300);
        text("row = " + infoNode.j, 430, 320);
    }

    var path = calcPath(pathfinder.lastCheckedNode);
    drawPath(path);
}

function calcPath(endNode) {
    // Find the path by working backwards
    path = [];
    var temp = endNode;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }
    return path
}

function drawPath(path) {
    // Drawing path as continuous line
    noFill();
    stroke(0,0,255, 50);
    strokeWeight(gamemap.w / gamemap.cols / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);
    }
    endShape();
}
