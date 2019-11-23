let c = init("canvas"),
  w = (canvas.width = window.innerWidth),
  h = (canvas.height = window.innerHeight);
//initiation
let t = 0,
    dang = Math.random()*2*Math.PI,
    num = (Math.floor(Math.random()*5)+1)+(Math.floor(Math.random()*5)+1),
    strt = Math.random()*2*Math.PI;

function fractal(x,y,r,ang,da,it,b){
  this.x1 = x+r*Math.cos(ang);
  this.y1 = y+r*Math.sin(ang);
  this.midx = (x+this.x1)/2;
  this.midy = (y+this.y1)/2;
  if(it >= 0){
  c.beginPath();
  c.arc(x+r*Math.cos(ang+dang),y+r*Math.sin(ang+dang),5,0,2*Math.PI);
  c.fillStyle="rgba(175,200,0,0.25)";
  c.fill();
    c.beginPath();
  c.arc(x+r*Math.cos(ang-dang),y+r*Math.sin(ang-dang),5,0,2*Math.PI);
  c.fillStyle="rgba(175,200,0,0.25)";
  c.fill();
    c.beginPath();
  c.arc(this.midx,this.midy,r/4,0,2*Math.PI);
  c.fillStyle="rgba(175,200,0,0.25)";
  c.fill();
}
  c.beginPath();
  //c.arc(this.midx,this.midy,r/2,0,2*Math.PI);
  //c.fillStyle="rgba(255,255,255,0.25)";
  //c.fill();
  c.lineTo(x+r*Math.cos(ang+dang),y+r*Math.sin(ang+dang));
  c.lineTo(x,y);
  c.lineTo(x+r*Math.cos(ang-dang),y+r*Math.sin(ang-dang));
  c.strokeStyle="rgba(255,255,255,0.5)";
  c.lineWidth=b;
  c.stroke();
  if(it < 7){
    fractal(
      x+r*Math.cos(ang-dang),
      y+r*Math.sin(ang-dang),
      0.5*r,
      ang+da,
      da,
    it+1,
    2*b/3);
    fractal(
      x+r*Math.cos(ang+dang),
      y+r*Math.sin(ang+dang),
      0.5*r,
      ang-da,
      da,
    it+1,
    2*b/3);
  }
}

function draw() {
  //animation
  for(let i = 0; i < num; i++){
  fractal(
    w/2,
    h/2,
    200+50*Math.sin(2*dang)-50,
    0*Math.PI/180+2*i*Math.PI/num,
    t*Math.PI/180+strt,
    0,
  4);
  }
  if(mouse.x && mouse.y){
  t=360/(w/mouse.x);
  dang=2*Math.PI/(h/mouse.y);
  }else{
    t+=0.1;
    dang+=0.01;
  }
  
}

let mouse = {};
let last_mouse = {};

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
function init(elemid) {
  let canvas = document.getElementById(elemid),
    c = canvas.getContext("2d"),
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight);
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
  return c;
}

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback);
    }
  );
});

function loop() {
  window.requestAnimFrame(loop);
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
  draw();
}

window.addEventListener("resize", function() {
  (w = canvas.width = window.innerWidth),
  (h = canvas.height = window.innerHeight);
  loop();
});

loop();
setInterval(loop, 1000 / 60);
