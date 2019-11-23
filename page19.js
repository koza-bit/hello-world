var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

document.body.appendChild(canvas);
c.fillStyle = "rgba(30,30,200,1)";
    c.fillRect(0, 0, w, h);

var dist,
    r=193,
    g=212,
    b=247,
    red1=200,
    g1=219,
    b1=254,
    r1=100,
    r2=105,
    alpha=0,
    sx= new Array(200),
    sy= new Array(200),
    ss= new Array(200);

for(i=0; i<sx.length ; i++){
  sx[i]=Math.random()*w;
  sy[i]=Math.random()*h;
  ss[i]=Math.random()*2;
}

function draw() {
  dist=Math.sqrt(Math.pow(w/2-mouse.x,2)+Math.pow(h/2-mouse.y,2));
  
  if(dist < r1+r2){
    r=0+Math.floor((193/((r1+r2)/(dist))));
    g=0+Math.floor((212/((r1+r2)/(dist))));
    b=0+Math.floor((247/((r1+r2)/(dist))));
    red1=0+Math.floor((200/((r1+r2)/(dist))));
    g1=0+Math.floor((219/((r1+r2)/(dist))));
    b1=0+Math.floor((254/((r1+r2)/(dist))));
    alpha=1-(1/((r1+r2)/(dist)));
  }else{
    r=193;
    g=212;
    b=247;
    red1=200;
    g1=219;
    b1=254;
    alpha=0;
  }
  
  c.fillStyle = "rgba("+r+","+g+","+b+",1)";
  c.fillRect(0, 0, w, h);
  
  for(i=0; i< sx.length;i++){
  c.beginPath();
  c.arc(sx[i], sy[i], ss[i], 0, 2*Math.PI);
  c.fillStyle="rgba(255,255,255,"+alpha+")";
  c.fill();
  }
  
  c.beginPath();
  c.arc(w/2, h/2, r2+30, 0, 2*Math.PI);
  c.fillStyle="rgba(255,255,50,0.1)";
  c.fill();
  
  c.beginPath();
  c.arc(w/2, h/2, r2+20, 0, 2*Math.PI);
  c.fillStyle="rgba(255,255,50,0.1)";
  c.fill();
  
  c.beginPath();
  c.arc(w/2, h/2, r2+10, 0, 2*Math.PI);
  c.fillStyle="rgba(255,255,50,0.1)";
  c.fill();
  
  c.beginPath();
  c.arc(w/2, h/2, r2, 0, 2*Math.PI);
  c.fillStyle="rgba(255,255,50,1)";
  c.fill();
  c.beginPath();
  c.arc(w/2, h/2, r2-5, 0, 2*Math.PI);
  c.fillStyle="rgba(255,255,255,1)";
  c.fill();
  
  c.beginPath();
  c.arc(mouse.x, mouse.y, r1, 0, 2*Math.PI);
  c.fillStyle="rgba("+red1+","+g1+","+b1+",1)";
  c.fill();

}

var mouse = {
  x: 9*w / 20,
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
    draw();
  }, 1000 / 60);

}

window.addEventListener('resize', function() {
  w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;
  c.fillStyle = "rgba(30,30,200,1)";
  c.fillRect(0, 0, w, h);
});

loop();
