var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

c.fillStyle = "rgb(255,255,255)";
c.fillRect(0, 0, w, h);

document.body.appendChild(canvas);

x = w / 2;
y = h / 2;
size = Math.round(Math.random() * 30 + 20);

function draw() {
  size = Math.round(Math.random() * 100 + 10);

  c.lineTo(mouse.x, mouse.y);
  c.strokeStyle = "grey";
  c.lineWidth = "0.01";
  c.stroke();

  window.onmousedown = function() {
    start = +new Date();
    c.beginPath();
  };
  window.onmouseup = function() {
    c.lineTo(mouse.x,mouse.y);
    c.strokeStyle="black";
    c.lineWidth="1";
   c.lineCap="round";
    c.stroke();
    end = +new Date();
    dur = (end - start) / 10;
    c.beginPath();
    c.lineWidth = "0";
    c.arc(mouse.x, mouse.y, dur + 5, 0, 2 * Math.PI);
    c.strokeStyle = "black";
    c.lineWidth = "" + dur / 100 + "";
    c.stroke();
    c.beginPath();
    c.arc(mouse.x, mouse.y, (dur + 5) / 3, 0, 2 * Math.PI);
    c.fillStyle = "black";
    c.lineWidth = "0";
    c.fill();
    c.beginPath();
  }
  
  
}

var mouse = {
  x: 0,
  y: 0
};
var last_mouse = {
  x: 0,
  y: 0
};

canvas.addEventListener('mousemove', function(e) {
  last_mouse.x = mouse.x;
  last_mouse.y = mouse.y;

  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
}, false);

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function loop() {
  c.fillStyle = "rgba(255,255,255,0)";
  c.fillRect(0, 0, w, h);
  window.requestAnimFrame(loop);
  draw();
}

loop();
