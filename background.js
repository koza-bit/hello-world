new p5();

var canvas = document.createElement("canvas"),
    c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;

document.body.appendChild(canvas);

c.fillStyle = "#202020";
c.fillRect(0, 0, w, h);
var res = 50,
    num = res*res,
    cols = w / res,
    rows = h / res,
    ang = new Array(num),
    x = new Array(res),
    y = new Array(res);

for(i=0; i<res ;i++){
   x[i] = new Array(res);
   y[i] = new Array(res);
  for(j=0; j<res ;j++){
 x[i][j] = i*cols+cols/2+Math.random()*20-10;
 y[i][j] = j*rows+rows/2+Math.random()*20-10;
  }
}

    for (i = 0; i < num; i++) {
        ang[i] = noise(i/300)*5*Math.PI;
    }



    function draw() {
      
      for(i = 0; i < x.length; i++){
        for(j = 0; j < x.length; j++){
          c.beginPath();
          
            c.arc(x[i][j], y[i][j], 1, 0, 2*Math.PI);
 
            c.fillStyle = "rgba(50,50,120,0.1)";
          c.strokeStyle = "rgba(50,50,120,0.1)";
          c.lineWidth="1";
        c.fill();
          x[i][j] += Math.cos(ang[Math.floor(Math.abs(x[i][j]))]+ang[Math.floor(Math.abs(y[i][j]))]);
          y[i][j] += Math.sin(ang[Math.floor(Math.abs(x[i][j]))]+ang[Math.floor(Math.abs(y[i][j]))]);
        }
      }
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

function looping() {

    setTimeout(function() {
        requestAnimationFrame(looping);
        c.fillStyle = "rgba(175,175,175,0)";
        c.fillRect(0, 0, w, h);
        draw();
    }, 1000 / 120);
}

looping();