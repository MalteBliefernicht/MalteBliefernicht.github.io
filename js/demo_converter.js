var canvas = document.getElementById("canvas-demo");
var context = canvas.getContext("2d");
var canvasContainer = document.getElementById("canvas-container");
var cs = getComputedStyle(canvasContainer);
var slider = document.getElementById("demo-slider");

context.translate(0.5, 0.5);
//var startButton = document.getElementById("demo-startbutton");

var image = new Image();
image.src = "images/flower.jpg";

canvas.width = image.width;
canvas.height = image.height;
var width = canvas.width;
var height = canvas.height;

slider.oninput = function() {
    draw(this.value / 100);  
}

function draw(multi) {
    canvas.width = Math.floor(width * multi);
    canvas.height = Math.floor(height * multi);
    console.log(canvas.width , canvas.height);
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, image.width * multi, image.height * multi);
}