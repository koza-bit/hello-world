var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

particles = {},
  particleIndex = 0,
  particleNum = 1;

  c.fillStyle = "black";
  c.fillRect(0, 0, w, h);

document.body.appendChild(canvas);

var background = new Image();
background.src = "http://dreamatico.com/data_images/fire/fire-3.jpg";

function particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.vx = 1;
  this.vy = 1;
  this.gravity = 0.3;
  particleIndex++;
  particles[particleIndex] = this;
  this.id = particleIndex;
  this.life = 0;
  this.maxLife = Math.random() * 500;
  this.shadeR = Math.floor(Math.random() * 90+60);
  this.shadeG = Math.floor(Math.random() * 100+150);
  this.shadeB = Math.floor(Math.random() * 60+10);
 this.alp = Math.random()*1;
  this.color = 'hsla(' + this.shadeR + ',100%,' + this.shadeB + '%,' + this.alp + ')';
  this.size = Math.random() *20;
  this.rad = Math.round(Math.random()*(20)-(10))
  this.a1 = 1,
    this.a2 = 1,
    this.a3 = 0.1,
    this.a4 = Math.random()*20-10;
}
particle.prototype.draw = function() {
  
  

  this.life++;
  if (this.life >= this.maxLife) {
    delete particles[this.id];
  }

  c.beginPath();
  for(j = 0; j < 10; j++){
    this.x += this.a1*Math.sin(this.a2*this.vx) + (this.a3*this.vx)*Math.cos(this.a4*this.vx);
  this.y += this.a1*Math.cos(this.a2*this.vy) - (this.a3*this.vy)*Math.sin(this.a4*this.vy);
 this.vx += this.rad/10;
  this.vy += this.rad/10;
  
  c.arc(this.x, this.y, 0.1, 0, 2 * Math.PI);
  }
  c.strokeStyle = "hsl("+Math.round(this.x/(w/360))+",100%,50%)";
  c.lineWidth = 0.1;
  c.stroke();
};

function drawParticle() {
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, w, h);
  for (var i = 0; i < particleNum; i++) {
    new particle();
  }
  for (var i in particles) {
    particles[i].draw();
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

function loop() {

  window.requestAnimFrame(loop);

  drawParticle();
}

loop();
