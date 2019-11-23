var canvas = document.createElement("canvas"), c = canvas.getContext("2d");
var w = (canvas.width = window.innerWidth),
  h = (canvas.height = window.innerHeight);

document.body.appendChild(canvas);

var tx = w / 2,
  ty = h / 2,
  tsize = 60,
  col = ["rgba(0,255,255,0.5)", "rgba(255,155,0,0.5)", "rgba(155,255,0,0.5)"],
  arr = new Array(100);
var m = new Array(100);
function circle(cx, cy, radius, color) {
  c.beginPath();
  c.arc(cx, cy, radius, 0, 2 * Math.PI);

  c.fillStyle = col[color];
  c.fill();
}

var vehicle = function() {
  this.m = Math.round(Math.random() * (col.length - 1));
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  this.l = Math.random() * 80 + 20;
  this.spd = 0.02;
  this.angle = Math.PI / 180 * (Math.random() * 360);
  this.sharpness = 15;

  this.show = function() {
    var x1 =
      this.l * Math.cos(this.angle + this.sharpness * Math.PI / 180 + Math.PI);
    var y1 =
      this.l * Math.sin(this.angle + this.sharpness * Math.PI / 180 + Math.PI);
    var x2 =
      this.l * Math.cos(this.angle - this.sharpness * Math.PI / 180 + Math.PI);
    var y2 =
      this.l * Math.sin(this.angle - this.sharpness * Math.PI / 180 + Math.PI);
    c.beginPath();
    c.lineTo(this.x + x1, this.y + y1);
    c.lineTo(this.x, this.y);
    c.lineTo(this.x + x2, this.y + y2);
    c.fillStyle = "rgba(255,255,255,0.1)";
    c.fill();
    this.f = this.l * Math.tan(this.sharpness * Math.PI / 180);
    this.g = this.l / Math.cos(this.sharpness * Math.PI / 180);
    circle(
      this.x + this.g * Math.cos(this.angle + Math.PI),
      this.y + this.g * Math.sin(this.angle + Math.PI),
      this.f,
      this.m
    );
  };
  this.follow = function() {
    this.distx = tx - this.x;
    this.disty = ty - this.y;
    this.angle = Math.atan2(this.disty * this.spd, this.distx * this.spd);
    this.x += this.distx * this.spd;
    this.y += this.disty * this.spd;
  };

  this.repulse = function() {
    if (this.x >= w) {
      this.x = w;
    }
    if (this.y >= h) {
      this.y = h;
    }
    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.y <= 0) {
      this.y = 0;
    }
    this.distx = tx - this.x;
    this.disty = ty - this.y;
    this.angle =
      Math.atan2(this.disty * this.spd, this.distx * this.spd) + Math.PI;
    this.x -= this.distx * this.spd;
    this.y -= this.disty * this.spd;
  };

  this.stop = function() {
    this.x = tx+tsize*Math.cos(this.angle+Math.PI);
    this.y = ty+tsize*Math.sin(this.angle+Math.PI);
  };
};
for (i = 0; i < arr.length; i++) {
  arr[i] = new vehicle();
}
var dm = Math.round(Math.random() * (col.length - 1));
var ok = false;
function draw() {
  tx = mouse.x;
  ty = mouse.y;
  circle(tx, ty, tsize, dm);
  for (i = 0; i < arr.length; i++) {
    window.onmousedown = function() {
      ok = true;
    };
    window.onmouseup = function() {
      ok = false;
    };
    if (ok) {
      arr[i].repulse();
    } else {
      arr[i].follow();
    }
    arr[i].show();

    var dist = Math.sqrt(
      Math.pow(tx - arr[i].x, 2) + Math.pow(ty - arr[i].y, 2)
    );
    if (dist < tsize) {
      // for(j=0;j<arr.length;j++){
      arr[i].stop();

      // tx = Math.random()*w;
      // ty = Math.random()*h;
    }
  }
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
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  },
  false
);

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
  (w = canvas.width =
    window.innerWidth), (h = canvas.height = window.innerHeight);
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
});

loop();

