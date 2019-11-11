var c = document.getElementById("c");
var ctx = c.getContext("2d");
var cw = c.width = window.innerWidth;
var ch = c.height = window.innerHeight;
var cx = cw / 2,
  cy = ch / 2;
var rad = Math.PI / 180;
var howMany = 120;
var isDragging = false;
var previous = null;

var mousePosition = {
  x: cx,
  y: cy
}
var circles = [];
var speed = 0.1;

ctx.lineWidth = .2;

function Circle(n) {
  this.r = 50;
  this.x = cx + this.r * Math.cos(3 * n * rad);
  this.y = cy + this.r * Math.sin(3 * n * rad) * Math.cos(3 * n * rad);
  this.previous = null;
}

function drawCircle(circle) {

  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
  ctx.stroke();
}

function createCircles(howMany) {
  for (var i = 0; i < howMany; i++) {
    circles[i] = new Circle(i);
  }
}

function updateCircles(mousePosition) {

  for (i = 0; i < circles.length; i++) {

    if (i == 0) {
      circles.previous = mousePosition
    } else {
      circles.previous = circles[i - 1]
    }
    var deltaX = circles.previous.x - circles[i].x;
    var deltaY = circles.previous.y - circles[i].y;

    if (Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2) {
      // hic sunt leones
    } else {
      circles[i].x += deltaX * speed;
      circles[i].y += deltaY * speed;
    }
  }

}

function drawCircles() {
  for (var i = 0; i < circles.length; i += 1) {
    drawCircle(circles[i]);
  }
}

function Draw() {
  ctx.clearRect(0, 0, cw, ch);
  updateCircles(mousePosition);
  drawCircles();
  requestId = window.requestAnimationFrame(Draw);
}

createCircles(howMany);
drawCircles();

c.addEventListener('mousedown', function(e) {
  isDragging = true;
  mousePosition = oMousePos(c, e);
  requestId = window.requestAnimationFrame(Draw);
}, false);

c.addEventListener('mouseup', function(evt) {
  isDragging = false;
}, false);

c.addEventListener('mouseout', function(evt) {
  isDragging = false;
}, false);

c.addEventListener('mousemove', function(e) {
  if (isDragging) {
    mousePosition = oMousePos(c, e);
    requestId = window.requestAnimationFrame(Draw);
  }
}, false);

function oMousePos(canvas, evt) {
  var ClientRect = canvas.getBoundingClientRect();
  return { //objeto
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.round(evt.clientY - ClientRect.top)
  }
}
