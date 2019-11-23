var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = (canvas.width = window.innerWidth),
  h = (canvas.height = window.innerHeight);

document.body.appendChild(canvas);

var mouseon = true,
  moved = false,
  paint = false,
  up = true,
  cu = [],
  deltay = 0,
  mirror = 6;

class curve {
  constructor(mirr) {
    this.tr = [];
    this.str = 1;
    this.mirr = mirr;
  }
  painting(mx, my) {
    this.mx = mx;
    this.my = my;
    if (moved && paint && mouseon) {
      this.tr.push({ x: mx, y: my });
    }
  }
  smooth() {
    
    for(var j = 0; j < this.mirr; j++){
    c.beginPath();
      for (var i = 0; i < this.tr.length; i++) {
      this.d0 = Math.sqrt(Math.pow(h/2-this.tr[i].y,2)+Math.pow(w/2-this.tr[i].x,2));
      this.a0 = Math.atan2(this.tr[i].y-h/2,this.tr[i].x-w/2);
      this.a1 = (j*2*Math.PI)/this.mirr;
      this.tr[i].px = w/2+this.d0*Math.cos(this.a0+this.a1);
      this.tr[i].py = h/2+this.d0*Math.sin(this.a0+this.a1);
      }
    for (var i = 1; i < this.tr.length; i++) {
      this.midx = this.tr[i - 1].px + (this.tr[i].px - this.tr[i - 1].px) / 2;
      this.midy = this.tr[i - 1].py + (this.tr[i].py - this.tr[i - 1].py) / 2;
      c.quadraticCurveTo(
        this.tr[i-1].px,
        this.tr[i-1].py,
        this.midx,
        this.midy
      );
    }
    //c.lineTo(this.mx,this.my);
    c.strokeStyle = "white";
    c.lineWidth=this.str;
    c.stroke();
  }
    
    // for (var i = 0; i < this.tr.length; i++) {
    //   c.beginPath();
    //   c.arc(this.tr[i].x, this.tr[i].y, 2, 0, 2*Math.PI);
    //   c.fillStyle="white";
    //   c.fill();
    // }
  }
  poly() {
    for(var j = 0; j < this.mirr; j++){
    c.beginPath();
    for (var i = 0; i < this.tr.length; i++) {
      this.d0 = Math.sqrt(Math.pow(h/2-this.tr[i].y,2)+Math.pow(w/2-this.tr[i].x,2));
      this.a0 = Math.atan2(this.tr[i].y-h/2,this.tr[i].x-w/2);
      this.a1 = (j*2*Math.PI)/this.mirr;
      this.tr[i].px = w/2+this.d0*Math.cos(this.a0+this.a1);
      this.tr[i].py = h/2+this.d0*Math.sin(this.a0+this.a1);
      c.lineTo(this.tr[i].px,this.tr[i].py);
    }
    c.strokeStyle = "red";
    c.lineWidth=this.str;
    c.stroke();
    }
  }
}

cu.push(new curve(mirror));

function draw() {
if(cu.length > 0){
  if (paint) {
    cu[cu.length - 1].painting(mouse.x, mouse.y);
    cu[cu.length - 1].poly();
  }
  
  for (var i = 0; i < cu.length - 1; i++) {
    cu[i].smooth();
  }

  if (up) {
    cu[cu.length - 1].smooth();
  }
}
  console.log(cu);
}

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
    moved = true;
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  },
  false
);

canvas.addEventListener("mousedown", function(e) {
  paint = true;
  up = false;
});

canvas.addEventListener("mouseup", function(e) {
  paint = false;
  up = true;
  cu.push(new curve(mirror));
});

canvas.addEventListener("mouseleave", function(e) {
  mouseon = false;
});

canvas.addEventListener("mouseenter", function(e) {
  mouseon = true;
});

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function loop() {
  setTimeout(function() {
    window.requestAnimFrame(loop);
    c.fillStyle = "rgba(30,30,30,1)";
    c.fillRect(0, 0, w, h);
    draw();
  }, 1000 / 60);
}

window.addEventListener("resize", function() {
  (w = canvas.width = window.innerWidth),
    (h = canvas.height = window.innerHeight);
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
});

loop();

