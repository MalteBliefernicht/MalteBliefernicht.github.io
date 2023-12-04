class Cell {
    
    constructor() {
        this.alive = false;
        this.hover = false;
        this.neighbours;
    }
    
    setNeighbours(neighbourArray) {
        this.neighbours = neighbourArray;
    }
    
    isAlive() {
        return this.alive;
    }
    
    setAlive(alive) {
        this.alive = alive;
    }
    
    getHover() {
        return this.hover;
    }
    
    setHover(hover) {
        this.hover = hover;
    }
    
    checkNeighbours() {
        var numAlive = 0;
        for (var i = 0; i < this.neighbours.length; i++) {
            if (this.neighbours[i].isAlive()) {
                numAlive++;
            }
        }
        
        if (numAlive < 2 || numAlive > 3) {
            return false;
        }
        else if (numAlive == 3) {
            return true;
        }
        else {
            return this.alive;
        }
    }
}


var canvas = document.getElementById("canvas-demo");
var context = canvas.getContext("2d");
var canvasContainer = document.getElementById("canvas-container");
var cs = getComputedStyle(canvasContainer);
canvas.width = canvasContainer.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
canvas.height = canvasContainer.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 100;
var startButton = document.getElementById("demo-startbutton");

const cellsY = 20;
const cellsX = 20;
const cellMargin = 10;

var intervalID;
const intervalLength = 200;

cellHeight = canvas.height / cellsY;
cellWidth = canvas.width / cellsX;

var cells = initCells();
setCellNeighbours();


startDemo();


function startDemo() {
    startButton.addEventListener('click', function() {
        startPhaseOne();
        startButton.remove();
    });
}


function addMouseMoveHandler() {
    canvas.addEventListener('mousemove', mouseMoveEvent);
}


function removeMouseMoveHandler() {
    canvas.removeEventListener('mousemove', mouseMoveEvent);
}


function mouseMoveEvent(event) {
    var pos = getMousePos(canvas, event);

    for (var y = 0; y < cells.length; y++) {
        for (var x = 0; x < cells[y].length; x++) {

            if (pos.y >= y * cellHeight && pos.y <= y * cellHeight + cellHeight - cellMargin && pos.x >= x * cellWidth && pos.x <= x * cellWidth + cellWidth - cellMargin) {
                cells[y][x].setHover(true);
            }
            else {
                cells[y][x].setHover(false);
            }
        }
    }

    draw();
}


function addMouseClickHandler() {
    canvas.addEventListener('click', mouseClickEvent);
}


function removeMouseClickHandler() {
    canvas.removeEventListener('click', mouseClickEvent);
}


function mouseClickEvent(event) {
    var pos = getMousePos(canvas, event);

    for (var y = 0; y < cells.length; y++) {
        for (var x = 0; x < cells[y].length; x++) {

            if (pos.y >= y * cellHeight && pos.y <= y * cellHeight + cellHeight - cellMargin && pos.x >= x * cellWidth && pos.x <= x * cellWidth + cellWidth - cellMargin) {
                if (cells[y][x].isAlive()) {
                    cells[y][x].setAlive(false);
                }
                else {
                    cells[y][x].setAlive(true);
                }
            }
        }
    }

    draw();
}


function startPhaseOne() {
    killAllCells();
    addMouseMoveHandler();
    addMouseClickHandler();
    drawButtonsPhaseOne();
    draw();
}


function endPhaseOne() {
    removeMouseMoveHandler();
    removeMouseClickHandler();
    deleteHover();
}


function startPhaseTwo() {
    intervalID = setInterval(updateCells, intervalLength);  
    drawButtonsPhaseTwo();
}


function endPhaseTwo() {
    clearInterval(intervalID);
}


function drawButtonsPhaseOne() {
    var buttonRandom = document.createElement("button");
    buttonRandom.innerHTML = "Random";
    buttonRandom.style.left = "25%";
    buttonRandom.style.top = "50%";
    
    var buttonStart = document.createElement("button");
    buttonStart.innerHTML = "Start";
    buttonStart.style.left = "75%";
    buttonStart.style.top = "50%";
    
    var container = document.createElement("div");
    container.style.width = "600px";
    container.style.height = "70px";
    container.style.backgroundColor = "black";
    container.style.position = "absolute";
    container.style.left = "50%";
    container.style.top = "92%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.border = "10px solid #dfe4eb";
    container.style.borderRadius = "35px";
    container.style.paddingTop = "20px";

    container.append(buttonRandom);
    container.append(buttonStart);
    
    var canvasContainer = document.getElementById("canvas-container");
    canvasContainer.append(container);
    
    buttonRandom.addEventListener('click', function() {
        setCellsAtRandom();
        draw();
    });
    
    buttonStart.addEventListener('click', function() {
        endPhaseOne();
        startPhaseTwo();
        container.remove();
        draw();
    });
}


function drawButtonsPhaseTwo() {  
    var buttonReset = document.createElement("button");
    buttonReset.innerHTML = "Reset";
    
    var container = document.createElement("div");
    container.style.width = "600px";
    container.style.height = "70px";
    container.style.backgroundColor = "black";
    container.style.position = "absolute";
    container.style.left = "50%";
    container.style.top = "92%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.border = "10px solid #dfe4eb";
    container.style.borderRadius = "35px";
    container.style.paddingTop = "20px";

    container.append(buttonReset);
    
    var canvasContainer = document.getElementById("canvas-container");
    canvasContainer.append(container);
    
    buttonReset.addEventListener('click', function() {
        endPhaseTwo();
        startPhaseOne();
        container.remove();
        draw();
    });
}


function updateCells() {
    var nextFrame = new Array(cellsY);
    
    for (var y = 0; y < cells.length; y++) {
        var row = new Array(cellsX);
        
        for (var x = 0; x < cells[y].length; x++) {
            row[x] = cells[y][x].checkNeighbours();
        }
        
        nextFrame[y] = row;
    }
    
    for (var y = 0; y < cells.length; y++) {
        for (var x = 0; x < cells[y].length; x++) {
            cells[y][x].setAlive(nextFrame[y][x]);
        }
    }
    
    draw();
}


function killAllCells() {
    for (var y = 0; y < cells.length; y++) {
        for (var x = 0; x < cells[y].length; x++) {
            cells[y][x].setAlive(false);
        }
    }
}


function deleteHover() {
    for (var y = 0; y < cells.length; y++) {
        for (var x = 0; x < cells[y].length; x++) {
            cells[y][x].setHover(false);
        }
    }
}


function setCellsAtRandom() {
    var max = 50;
    var min = 10;
    var cutOff = Math.floor(Math.random() * (max - min + 1) + min);
    
    for (var y = 0; y < cells.length; y++) {
        for (var x = 0; x < cells[y].length; x++) {
            if (Math.random() * 100 < cutOff) {
                cells[y][x].setAlive(true);
            }
            else {
                cells[y][x].setAlive(false);
            }
        }
    }
}


function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
    return {x: x, y: y};
}


function initCells() {
    var cells = new Array(cellsY);
    
    for (var y = 0; y < cellsX; y++) {
        var row = new Array(cellsX);

        for (var x = 0; x < cellsX; x++) {
            row[x] = new Cell();
        }

        cells[y] = row;
    }
    
    return cells;
}


function setCellNeighbours() {
    for (var y = 0; y < cells.length; y++) {
        for (var x = 0; x < cells[y].length; x++) {
            var neighbours = new Array();
            
            if (y != 0) {
                neighbours.push(cells[y - 1][x]);
            }
            if (x != 0) {
                neighbours.push(cells[y][x - 1]);
            }
            if (y != cellsY - 1) {
                neighbours.push(cells[y + 1][x]);
            }
            if (x != cellsX - 1) {
                neighbours.push(cells[y][x + 1]);
            }
            if (y != 0 && x != 0) {
                neighbours.push(cells[y - 1][x - 1]);
            }
            if (y != cellsY - 1 && x != cellsX - 1) {
                neighbours.push(cells[y + 1][x + 1]);
            }
            if (y != 0 && x != cellsX - 1) {
                neighbours.push(cells[y - 1][x + 1]);
            }
            if (y != cellsY - 1 && x != 0) {
                neighbours.push(cells[y + 1][x - 1]);
            }
            
            cells[y][x].setNeighbours(neighbours);
        }
    }
}


function draw() {
    context.strokeStyle = "white";
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 2;
    
    for (var y = 0; y < cellsY; y++) {
        for (var x = 0; x < cellsX; x++) {
            if (cells[y][x].getHover() && cells[y][x].isAlive()) {
                context.fillStyle = "darkgrey";
                context.fillRect(x * cellWidth, y * cellHeight, cellWidth - cellMargin, cellHeight - cellMargin);
            }
            else if (cells[y][x].getHover()) {
                context.fillStyle = "grey";
                context.fillRect(x * cellWidth, y * cellHeight, cellWidth - cellMargin, cellHeight - cellMargin);
            }       
            else if (cells[y][x].isAlive()) {
                context.fillStyle = "white";
                context.fillRect(x * cellWidth, y * cellHeight, cellWidth - cellMargin, cellHeight - cellMargin);
            }
            else {
                context.strokeRect(x * cellWidth, y * cellHeight, cellWidth - cellMargin, cellHeight - cellMargin);
            }
        }
    }
}