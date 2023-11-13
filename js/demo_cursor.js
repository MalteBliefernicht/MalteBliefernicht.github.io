class tinyHead {
    constructor(startX, startY, length) {
        this.startX = startX;
        this.startY = startY;
        this.endX = startX;
        this.endY = startY + length;
        this.length = length;
        this.mouseX = 0;
        this.mouseY = 0;
        this.paralysed = 0;
    }
    
    setMouseCoords(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }
    
    calcEndCords() {
        if (!this.paralysed) {
            var diffX = Math.abs(this.mouseX - this.startX);
            var diffY = Math.abs(this.mouseY - this.startY);

            var hypo = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

            var factorX = (100 / hypo) * this.length;
            var factorY = (100 / hypo) * this.length;

            if (this.mouseX < this.startX) {
                this.endX = this.startX - Math.round((diffX / 100) * factorX);
            }
            else {
                this.endX = this.startX + Math.round((diffX / 100) * factorX);
            }

            if (this.mouseY < this.startY) {
                this.endY = this.startY - Math.round((diffY / 100) * factorY);
            }
            else {
                this.endY = this.startY + Math.round((diffY / 100) * factorY);
            }
        }
    }
    
    isOnCircle(circleX, circleY, radius) {
        var diffX = Math.abs(circleX - this.startX);
        var diffY = Math.abs(circleY - this.startY);
        
        var hypo = Math.round(Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)));
        
        if (hypo == radius) {
            return true;
        }
        else {
            return false;
        }
    }
    
    setPara(input) {
        this.paralysed = input;
        var context = this;
        
        if (this.paralysed) {
            setTimeout(function(){context.paralysed = 0;}, 300, 0);
        }
    }
    
    setRandom() {
        var randX = Math.floor(Math.random() * 200);
        var randY = Math.floor(Math.random() * 200);
        var diffX = Math.abs(randX - this.startX);
        var diffY = Math.abs(randY - this.startY);

        var hypo = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

        var factorX = (100 / hypo) * this.length;
        var factorY = (100 / hypo) * this.length;

        if (this.mouseX < this.startX) {
            this.endX = this.startX - Math.round((diffX / 100) * factorX);
        }
        else {
            this.endX = this.startX + Math.round((diffX / 100) * factorX);
        }

        if (this.mouseY < this.startY) {
            this.endY = this.startY - Math.round((diffY / 100) * factorY);
        }
        else {
            this.endY = this.startY + Math.round((diffY / 100) * factorY);
        }
    }
}

class Circle {
    constructor(x, y, radius, radiusLimit) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.radiusLimit = radiusLimit;
    }
    
    increaseRadius() {
        this.radius++;
    }
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.translate(0.5, 0.5);
var canvasContainer = document.getElementById("canvas-container");
var cs = getComputedStyle(canvasContainer);
canvas.width = canvasContainer.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
canvas.height = canvasContainer.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);

console.log(canvas.width);

var lineOffset = 10;
var lineLength = 10;
var startRadius = 10;
var endRadius = 300;
let intervalID;
let headsArray = [];
let circlesArray = [];

for (var x = lineOffset; x < canvas.width; x += (lineLength * 2)) {
    for (var y = lineOffset; y < canvas.height; y += (lineLength * 2)) {       
        headsArray.push(new tinyHead(x, y, lineLength));
    }
}

canvas.addEventListener('mouseover', function(event) {
    intervalID = setInterval(draw, 5);
});

canvas.addEventListener('mouseout', function(event) {
    clearInterval(intervalID);
});

canvas.addEventListener('mousemove', function(event) {
    var pos = getMousePos(canvas, event);
    headsArray.forEach((head) => {
        head.setMouseCoords(pos.x, pos.y);
    });
});

canvas.addEventListener('click', function(event) {
    var pos = getMousePos(canvas, event);
    var circle = new Circle(pos.x, pos.y, startRadius, endRadius);
    circleAnimation(circle);
    circlesArray.push(circle);
});

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.beginPath();
    
    headsArray.forEach((head) => {
        if (head.paralysed) {
            head.setRandom();
        }
        else {
            head.calcEndCords();
        }
        
        context.moveTo(head.startX, head.startY);
        context.lineTo(head.endX, head.endY);
    });
    
    circlesArray.forEach((circle) => {
        headsArray.forEach((head) => {
            if (head.isOnCircle(circle.x, circle.y, circle.radius)) {
                head.setPara(1);
            }
        });
    });
    
    context.stroke();
}

function circleAnimation(circle) {
    circle.increaseRadius();

    if (circle.radius <= circle.radiusLimit) {
        setTimeout(circleAnimation, 5, circle);
    }
    else {
        delete circlesArray[circlesArray.indexOf(circle)];
    }
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
    return {x: x, y: y};
}
