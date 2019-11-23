var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;
c.fillStyle = "black";
c.fillRect(0, 0, w, h);

particles = {},
  particleIndex = 0,
  particleNum = 1;

document.body.appendChild(canvas);

function particle() {
  this.x = mouse.x;
  this.y = mouse.y;
  this.vx = Math.random()*2-1;
  this.vy = Math.random()*2-1;
  this.gravity = 0.3;
  particleIndex++;
  particles[particleIndex] = this;
  this.id = particleIndex;
  this.life = 0;
  this.maxLife = Math.random() * 200;
  this.shadeR = Math.floor(Math.random() * 255+150) + 50;
  this.shadeG = Math.floor(Math.random() * 150) + 50;
  this.shadeB = Math.floor(Math.random() * 0);
  this.color = 'rgba(' + this.shadeR + ',' + this.shadeG + ',' + this.shadeB + ',' + Math.random() * 0.7 + ')';
  this.size = Math.random() * 3;
}
particle.prototype.draw = function() {
  
  this.x += this.vx;
  this.y += this.vy;
  this.vy += this.gravity;
  this.vx += this.gravity;
  
  if(this.y >= h/2){
    this.vy += -2*this.gravity;
  }
  
  if(this.x >= w/2){
    this.vx += -2*this.gravity;
  }
  
  if (this.x >= w) {
    this.vx = -this.vx;
    this.x = w;
  }
  if (this.x <= 0) {
    this.vx = -this.vx;
    this.x = 0;
  }
  
  if (this.y >= h-this.size) {
    this.vy = -this.vy+this.gravity*2;
    this.y = h-this.size;
  }
  if (this.y <= 0+this.size) {
    this.vy = -this.vy+this.gravity*2;
    this.y = 0-this.size;
  }


  c.beginPath();
  c.arc(this.x,this.y,100,0,2*Math.PI);
  c.lineWidth = "0.1";
  c.shadowBlur = "0";
  c.strokeStyle = "orange";
  c.stroke();

  this.life++;
  if (this.life >= this.maxLife) {
    delete particles[this.id];
  }

};

function drawParticle() {
  c.fillStyle = "rgba(0,0,0,0.05)";
  c.fillRect(0, 0, w, h);
  for (var i = 0; i < particleNum; i++) {
    new particle();
  }
  for (var i in particles) {
    particles[i].draw();
  }
}

var mouse = {x: w/4, y: h/4};
	var last_mouse = {x: w/4, y: h/4};

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

  window.requestAnimFrame(loop);

  drawParticle();
}

loop();
