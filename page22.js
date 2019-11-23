var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

c.fillStyle = "black";
c.fillRect(0, 0, w, h);

document.body.appendChild(canvas);

var x = w / 2,
  y = h / 2,
  vx = 0,
  vx1 = 0,
  size = 10,
    lenght = 10,
    a1 = 0.1,
    a2 = 1,
    a3 = 0.01,
    a4 = Math.random()*1+0.1;

function obj() {
  dist = Math.sqrt(Math.pow(w/2-x,2)+Math.pow(h/2-y,2));
c.beginPath();
  
  for(i = 0; i < lenght; i++){
    x += a1*vx1*Math.sin(a2*vx1)+a3*vx*Math.sin(a4*vx);
  y += a1*vx1*Math.cos(a2*vx1)+a3*vx*Math.cos(a4*vx);
  vx1 += 0.01;
  vx += 0.1;
    
  c.beginPath();
  c.arc(x, y, 100, 0, 2 * Math.PI);
    c.lineWidth= "0.1";
    c.strokeStyle = "hsl("+Math.round(dist/(h/360))+",100%,50%)";
  c.stroke();
  }
  c.lineWidth= "0.1";
  c.strokeStyle = "hsl("+Math.round(dist/(h/360))+",100%,50%)";
  c.stroke();
};

function draw() {
  c.fillStyle = "rgba(0,0,0,0)";
  c.fillRect(0, 0, w, h);
  obj();
}

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

  window.requestAnimFrame(loop);

  draw();
}

loop();