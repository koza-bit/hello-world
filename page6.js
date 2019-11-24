var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

document.body.appendChild(canvas);

//you can change number of reflections here.
//---------------------------------
var number_of_reflections = 14,
//---------------------------------
    arr = new Array(number_of_reflections),
    press = false; 


function mirror(){
  this.x = [];
  this.y = [];
  this.calc = function(angle,dist){
    this.angle = angle;
    this.dist = dist;
 if(press){   this.x.push(this.dist*Math.cos(this.angle)+w/2);
    this.y.push(this.dist*Math.sin(this.angle)+h/2);
          }
  };
  this.show = function(){
    c.beginPath();
    for(k = 0; k < this.x.length; k++){
    c.lineTo(this.x[k],this.y[k]);
    c.lineWidth="1";
    c.strokeStyle="white";
    }
    c.stroke();
    for(k = 0; k < this.x.length; k++){
    c.beginPath();
    c.lineTo(w/2,h/2);
    c.lineTo(this.x[k],this.y[k]);
    c.lineWidth="0.4";
    c.strokeStyle="black";
    c.stroke();
    }
  };
}

for(i=0;i<arr.length;i++){
  arr[i] = new mirror();
}

function draw() {
for(i=0;i<arr.length;i++){
  arr[i].calc(Math.atan2(h/2-mouse.y,w/2-mouse.x)+(2*(i)*Math.PI/arr.length)+Math.PI,Math.sqrt(Math.pow(w/2-mouse.x,2)+Math.pow(h/2-mouse.y,2)));
  arr[i].show();
}
}

canvas.addEventListener('mousedown',function(){
  press = true;
},false);

canvas.addEventListener('mouseup',function(){
  press = false;
},false);

var mouse = {
  x: w / 2,
  y: h / 2
};
var last_mouse = {
  x: 0,
  y: 0
};

canvas.addEventListener(
  "mousemove",
  function(e) {
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  },
  false
);

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

  setTimeout(function() {
    window.requestAnimFrame(loop);
    c.fillStyle = "rgba(30,30,30,1)";
    c.fillRect(0, 0, w, h);
    draw();
  }, 1000 / 60);

}

window.addEventListener('resize', function() {
  w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
});

loop();
