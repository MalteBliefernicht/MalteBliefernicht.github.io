class GameGridCell {
    
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.score = 0;
        this.color = "white";
        this.hover = false;
    }
}

var canvas = document.getElementById("canvas-demo");
var context = canvas.getContext("2d");
context.translate(0.5, 0.5);
canvas.width = 700;
canvas.height = 600;
var startButton = document.getElementById("demo-startbutton");

var gridCols = 7;
var gridRows = 6;

var diameter = canvas.width / gridCols;
var radius = diameter / 2;

var playerOne = "Player 1";
var playerTwo = "Player 2";
var currentPlayer = playerOne;

var colorWhite = "white";
var colorRed = "red";
var colorYellow = "yellow";
var currentColor = colorRed;

var gridCellArray = new Array();
var possibleAIMoves = new Array(gridCols);
var finalCell;

var gameRunning = false;

for (var x = 0; x < gridCols; x++) { 
    var colArray = new Array();
    
    for (var y = 0; y < gridRows; y++) {
        var cell = new GameGridCell(y, x);
        colArray.push(cell);
    }
    
    gridCellArray.push(colArray);
}

startButton.addEventListener('click', function(event) {
    startGame();
    startButton.remove();
});

function startGame() {
    gameRunning = true;
    
    canvas.addEventListener('mousemove', mouseMoveEvent);
    canvas.addEventListener('click', mouseClickEvent);
    
    draw();
}

function mouseMoveEvent(event) {
    var pos = getMousePos(canvas, event);

    for (var i = 0; i < gridCols; i++) {
        var colStart = gridCellArray[i][0].col * diameter;
        var colEnd = gridCellArray[i][0].col * diameter + diameter;

        if (pos.x >= colStart && pos.x < colEnd) {
            gridCellArray[i][0].hover = true;
        }
        else {
            gridCellArray[i][0].hover = false;
        }
    }

    draw();
}

function mouseClickEvent(event) {
    var pos = getMousePos(canvas, event);

    var clickedCol = Math.floor(pos.x / diameter);

    if (!makeGameMove(clickedCol)) {
        return;
    }

    checkBoardAfterTurn();
    
    if (gameRunning) {
        changePlayer();
        draw();
    }
}

function makeGameMove(clickedCol) {  
    if (gridCellArray[clickedCol][0].color != colorWhite) {
        return false;
    }
    
    for (var y = gridRows - 1; y >= 0; y--) {
        if (gridCellArray[clickedCol][y].color == colorWhite) {
            gridCellArray[clickedCol][y].color = currentColor;
            return true;
        }
    }
}

function checkBoardAfterTurn() {
    checkColumns();
    checkRows();
    checkLeftToRight();
    checkRightToLeft();
    if (checkDraw()) {
        gameOver(true);
    }
}

function checkColumns() {
    for (var col = 0; col < gridCols; col++) {
        for (var pos = 0; pos < 3; pos++) {
            var equalColors = 0;
            for (var i = 0; i < 4; i++) {
                if (gridCellArray[col][pos].color == gridCellArray[col][pos + i].color && gridCellArray[col][pos].color != colorWhite) {
                    equalColors++;
                } else {
                    break;
                }
                if (equalColors == 4) {
                    gameOver(false);
                }
            }
        }
    }
}

function checkRows() {
    for (var row = 0; row < gridRows; row++) {
        for (var pos = 0; pos < 4; pos++) {
            var equalColors = 0;
            for (var i = 0; i < 4; i++) {
                if (gridCellArray[pos][row].color == gridCellArray[pos + i][row].color && colorWhite != gridCellArray[pos][row].color) {
                    equalColors++;
                } else {
                    break;
                }
                if (equalColors == 4) {
                    gameOver(false);
                }
            }
        }
    }
}

function checkRightToLeft() {
    for (var col = gridCols - 1; col > 2; col--) {
        for (var pos = 0; pos < 3; pos++) {
            if (pos + 3 >= 0 && pos + 3 < gridRows && pos + 3 < gridCols) {
               var equalColors = 0;
               for (var i = 0; i < 4; i++) {
                   if (gridCellArray[col][pos].color == gridCellArray[col - i][pos + i].color && colorWhite != gridCellArray[col][pos].color) {
                       equalColors++;
                   } else {
                       break;
                   }
                   if (equalColors == 4) {
                       gameOver(false);
                   }
               }
            }
        }
    }
}

function checkLeftToRight() {
    for (var col = 0; col < 4; col++) {
        for (var pos = 0; pos < 3; pos++) {
            if (pos + 3 >= 0 && pos + 3 < gridRows && pos + 3 < gridCols) {
               var equalColors = 0;
               for (var i = 0; i < 4; i++) {
                   if (gridCellArray[col][pos].color == gridCellArray[col + i][pos + i].color && colorWhite != gridCellArray[col][pos].color) {
                       equalColors++;
                   } else {
                       break;
                   }
                   if (equalColors == 4) {
                       gameOver(false);
                   }
               }
            }
        }
    }
}

function checkDraw() {
    for (var col = 0; col < gridCols; col++) {
        for (var row = 0; row < gridRows; row++) {
            if (colorWhite == gridCellArray[col][row].color) {
                return false;
            }
        }
    }
    return true;
}

function clickOnCell(col) {
    makeGameMove(col);
    checkBoardAfterTurn();
    changePlayer();
    
    draw();
}

function startAI() {
    getArrayOfPossibleMoves();

    if (processPossibleMoves(colorYellow, 4, 0)) {
        clickOnCell(finalCell.col);
    } else if (processPossibleMoves(colorRed, 4, 0)) {
        clickOnCell(finalCell.col);
    } else if (processPossibleFutureMoves(colorRed, 4, 1)) {
        determineAlternativeOption();
        clickOnCell(finalCell.col);
    } else if (processPossibleFutureMoves(colorYellow, 4, 1)) {
        determineAlternativeOption();
        clickOnCell(finalCell.col);
    } else {
        determineAlternativeOption();
        clickOnCell(finalCell.col);
    }
}

function getArrayOfPossibleMoves() {
    possibleAIMoves.fill(null);
    
    for (var col = 0; col < gridCols; col++) {
        for (var row = gridRows - 1; row >= 0; row--) {
            if (colorWhite == gridCellArray[col][row].color) {
                possibleAIMoves[col] = gridCellArray[col][row];
                break;
            }
        }
    }
}

function processPossibleMoves(color, number, offset) {
    for (var col = 0; col < possibleAIMoves.length; col++) {
        if (possibleAIMoves[col] != null) {
            if (checkSurroundingsLeftToRight(possibleAIMoves[col], color, number, offset)) {
                finalCell = possibleAIMoves[col];
                return true;             
            } else if (checkSurroundingsRightToLeft(possibleAIMoves[col], color, number, offset)) {
                finalCell = possibleAIMoves[col];
                return true;            
            } else if (checkSurroundingsHorizontal(possibleAIMoves[col], color, number, offset)) {
                finalCell = possibleAIMoves[col];
                return true;
            } else if (checkSurroundingsVertical (possibleAIMoves[col], color, number)) {
                finalCell = possibleAIMoves[col];
                return true;
            }
        }
    }
    return false;
}

function processPossibleFutureMoves(color, number, offset) {
    for (var col = 0; col < possibleAIMoves.length; col++) {
        if (possibleAIMoves[col] != null) {
            if (checkSurroundingsLeftToRight(possibleAIMoves[col], color, number, offset)) {
                possibleAIMoves[col] = null;
                return true;
            } else if (checkSurroundingsRightToLeft(possibleAIMoves[col], color, number, offset)) {
                possibleAIMoves[col] = null;
                return true;
            } else if (checkSurroundingsHorizontal(possibleAIMoves[col], color, number, offset)) {
                possibleAIMoves[col] = null;
                return true;
            }
        }
    }
    return false;
}

function checkSurroundingsLeftToRight(cell, color, number, offset) {
    var col = cell.col;
    var row = cell.row - offset;
    var reach = number - 1;
    var counter = 0;
    
    for (var i = -1 * reach; i <= reach; i++) {
        if (col + i >= 0 && col + i < gridCols && row + i >= 0 && row + i < gridRows) {
            if (gridCellArray[col + i][row + i].color == color) {
                counter++;
            } else if (col + i == col && row + i == row) {
                counter++;
            } else {
                counter = 0;
            }
        }
        if (counter >= number) {
            return true;
        }
    }
    return false;
}

function checkSurroundingsRightToLeft(cell, color, number, offset) {
    var col = cell.col;
    var row = cell.row - offset;
    var reach = number - 1;
    var counter = 0;
    
    for (var i = -1 * reach; i <= reach; i++) {
        if (col + i >= 0 && col + i < gridCols && row - i >= 0 && row - i < gridRows) {
            if (gridCellArray[col + i][row - i].color == color) {
                counter++;
            } else if ((col + i == col) && (row - i == row)) {
                counter++;
            } else {
                counter = 0;
            }
        }
        if (counter >= number) {
            return true;
        }
    }
    return false;
}

function checkSurroundingsHorizontal(cell, color, number, offset) {
    var col = cell.col;
    var row = cell.row - offset;
    var reach = number - 1;
    var counter = 0;
    
    for (var i = -1 * reach; i <= reach; i++) {
        if (col + i >= 0 && col + i < gridCols && row >= 0 && row < gridRows) {
            if (gridCellArray[col + i][row].color == color) {
                counter++;
            } else if (col + i == col) {
                counter++;
            } else {
                counter = 0;
            }
        }
        if (counter >= number) {
            return true;
        }
    }
    return false;
}

function checkSurroundingsVertical(cell, color, number) {
    var col = cell.col;
    var row = cell.row;
    var reach = number - 1;
    var counter = 0;
    
    for (var i = 0; i <= reach; i++) {
        if (row + i >= 0 && row + i < gridRows) {
            if (gridCellArray[col][row + i].color == color) {
                counter++;
            } else if (row + i == row) {
                counter++;
            } else {
                counter = 0;
            }
        }
        if (counter >= number) {
            return true;
        }
    }
    return false;
}

function determineAlternativeOption() {
    threeOfSameColor(colorYellow, 3, 0);
    threeOfSameColor(colorRed, 3, 0);

    var highestScore = 0;
    for (var col = 0; col < possibleAIMoves.length; col++) {
        if (possibleAIMoves[col] != null) {
            var score = possibleAIMoves[col].score;
            if (score > highestScore) {
                highestScore = score;
            }
        }
    }

    var highestScoreList = new Array();
    for (var col = 0; col < possibleAIMoves.length; col++) {
        if (possibleAIMoves[col] != null) {
            var score = possibleAIMoves[col].score;
            if (score == highestScore) {
                highestScoreList.push(possibleAIMoves[col]);
            }
        }
    }

    var randomInt = Math.floor(Math.random() * highestScoreList.length);
    finalCell = highestScoreList[randomInt];

    for (var col = 0; col < possibleAIMoves.length; col++) {
        if (possibleAIMoves[col] != null) {
            possibleAIMoves[col].score = 0;
        }
    }
}

function threeOfSameColor(color, number, offset) {
    for (var col = 0; col < possibleAIMoves.length; col++) {
        var score = 0;
        if (possibleAIMoves[col] != null) {
            if (checkSurroundingsLeftToRight(possibleAIMoves[col], color, number, offset)) {
                score += 10;
            }
            if (checkSurroundingsRightToLeft(possibleAIMoves[col], color, number, offset)) {
                score += 10;
            }
            if (checkSurroundingsHorizontal(possibleAIMoves[col], color, number, offset)) {
                score += 10;
            }
            if (checkSurroundingsVertical (possibleAIMoves[col], color, number)) {
                score += 10;
            }
            possibleAIMoves[col].score += score;
        }
    }
}

function twoOfSameColor(color, number, offset) {
    for (var col = 0; col < possibleAIMoves.length; col++) {
        var score = 0;
        if (possibleAIMoves[col] != null) {
            if (checkSurroundingsLeftToRight(possibleAIMoves[col], color, number, offset)) {
                score += 5;
            }
            if (checkSurroundingsRightToLeft(possibleAIMoves[col], color, number, offset)) {
                score += 5;
            }
            if (checkSurroundingsHorizontal(possibleAIMoves[col], color, number, offset)) {
                score += 5;
            }
            if (checkSurroundingsVertical (possibleAIMoves[col], color, number)) {
                score += 5;
            }
            possibleAIMoves[col].score += score;
        }
    }
}

function gameOver(draw) {
    gameRunning = false;
    
    canvas.removeEventListener('mousemove', mouseMoveEvent);
    canvas.removeEventListener('click', mouseClickEvent);
    
    if (draw) {
        drawEndscreen("It's a draw!");
    }
    else {
        drawEndscreen("The winner is " + currentPlayer);
    }
}

function resetGame() {
    currentPlayer = playerOne;
    currentColor = colorRed;
    
    for (var x = 0; x < gridCellArray.length; x++) {
        for (var y = 0; y < gridCellArray[0].length; y++) {
            gridCellArray[x][y].color = colorWhite;
            gridCellArray[x][y].score = 0;
        }
    }
}

function drawEndscreen(message) {
    var text = document.createElement("p");
    text.innerHTML = message;
    text.style.color = "white";
    text.style.textAlign = "center";
    text.fontSize = "20px";
    
    var button = document.createElement("button");
    button.innerHTML = "Again?";
    
    var container = document.createElement("div");
    container.style.width = "300px";
    container.style.height = "200px";
    container.style.backgroundColor = "black";
    container.style.position = "absolute";
    container.style.left = "50%";
    container.style.top = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.border = "10px solid #dfe4eb";
    container.style.borderRadius = "35px";
    container.style.paddingTop = "20px";

    container.append(text);
    container.append(button);
    
    var canvasContainer = document.getElementById("canvas-container");
    canvasContainer.append(container);
    
    button.addEventListener('click', function() {
        resetGame();
        startGame();
        container.remove();
    });
}

function changePlayer() {
    if (currentPlayer == playerOne) {
        currentPlayer = playerTwo;
        currentColor = colorYellow;
        setTimeout(function() {
            startAI();
        }, 100);
    }
    else {
        currentPlayer = playerOne;
        currentColor = colorRed;
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    for (var x = 0; x < gridCellArray.length; x++) {
        for (var y = 0; y < gridCellArray[x].length; y++) {
            context.fillStyle = gridCellArray[x][y].color;
            context.beginPath();
            context.arc(gridCellArray[x][y].col * diameter + radius, gridCellArray[x][y].row * diameter + radius, radius, 0, 2 * Math.PI);
            context.fill();
        }
    }
    
    context.strokeStyle = "red";
    for (var i = 0; i < gridCols; i++) {
        var colStart = gridCellArray[i][0].col * diameter;
        var colEnd = gridCellArray[i][0].col * diameter + diameter;
        
        if (gridCellArray[i][0].hover == true) {
            context.beginPath();
            context.rect(colStart, 0, diameter, canvas.height);
            context.stroke();
        }
    }
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
    return {x: x, y: y};
}