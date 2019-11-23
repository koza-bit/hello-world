var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

//background
c.fillStyle = "black";
c.fillRect(0, 0, w, h);

document.body.appendChild(canvas);

//code

var particles = {},
  particleIndex = 0,
  particleNum = 1;

function particle() {
  //spawn
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  //movement speed and direction
  this.vx = Math.random() * 1 - 0.5;
  this.vy = Math.random() * 1 - 0.5;
  //some physics
  this.gravity = 0.3;
  //life
  particleIndex++;
  particles[particleIndex] = this;
  this.id = particleIndex;
  this.life = 0;
  this.maxLife = Math.random() * 90;
  //color
  this.shadeR = Math.floor(Math.random() * 255+100);
  this.shadeG = Math.floor(Math.random() * 255+100);
  this.shadeB = Math.floor(Math.random() * 24+100);
  this.color = 'rgba(' + this.shadeR + ',' + this.shadeG + ',' + this.shadeB + ',0.25)';
  //size
  this.size = Math.random() * 10;
  this.a = mouse.x - this.x;
this.b = mouse.y - this.y;

this.c = Math.sqrt( this.a*this.a + this.b*this.b );
}

particle.prototype.draw = function() {
    this.x += this.vx;
    this.y += this.vy;
  

  this.life++;
  if (this.life >= this.maxLife) {
    delete particles[this.id];
  }
  
  var angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
  c.beginPath();
  c.arc(this.x,this.y,200,angle-0.2,angle+0.2);
  c.lineWidth = this.c-400;
  
  c.strokeStyle = this.color;
  c.stroke();
};

var mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};

canvas.addEventListener('mousemove', function(e) {
		last_mouse.x = mouse.x;
		last_mouse.y = mouse.y;
		
		mouse.x = e.pageX - this.offsetLeft;
		mouse.y = e.pageY - this.offsetTop;
	}, false);

function drawParticle() {
  c.fillStyle = "rgba(0,50,50,0.2)";
  c.fillRect(0, 0, w, h);
   c.beginPath();
  c.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI, false);
  c.fillStyle = "#ffffaa";
  c.fill();
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
