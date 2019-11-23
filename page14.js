var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;
var opts = {
  size: 0.1,
  red: 0,
  green:255,
  blue:255,
  fillred: 0,
  fillgreen:255,
  fillblue:255,
  spread:0,
  snake_length:1510,
  stroke:0,
  alpha:1,
  background_alpha:1,
},
gui = new dat.GUI,
    first = true;
c.fillStyle = "black";
c.fillRect(0, 0, w, h);

particles = {},
  particleIndex = 0,
  particleNum = 2;

document.body.appendChild(canvas);

function init() {
  
  if( first ) {
    var f = gui.addFolder('color');
    var g = gui.addFolder('shape');
    var h = gui.addFolder('other')
    f.add( opts, 'red', 0, 255 );
    f.add( opts, 'green', 0, 255 );
    f.add( opts, 'blue', 0, 255 );
    f.add( opts, 'fillred', 0, 255 );
    f.add( opts, 'fillgreen', 0, 255 );
    f.add( opts, 'fillblue', 0, 255 );
    g.add(opts, 'spread', 0.00, 15);
    //g.add( opts, 'size', 1, 150 );
    g.add( opts, 'snake_length', 1, 500 );
    //g.add( opts, 'stroke', 0, 5 );
    h.add(opts,'alpha', 0.001, 1);
    h.add(opts,'background_alpha', 0.001, 1);
    loop();
    first = false;
  }
}

function particle() {
  
  this.x = mouse.x;
  this.y = mouse.y;
  this.vx = Math.random()*opts.spread-opts.spread/2;
  this.vy = Math.random()*opts.spread-opts.spread/2;
  this.gravity = 0.5;
  particleIndex++;
  particles[particleIndex] = this;
  this.id = particleIndex;
  this.life = 0;
  this.maxLife = opts.snake_length;
  this.shadeR = Math.floor(opts.red);
  this.shadeG = Math.floor(opts.green);
  this.shadeB = Math.floor(opts.blue);
  this.color = 'rgba(' + this.shadeR + ',' + this.shadeG + ',' + this.shadeB + ',' + opts.alpha+ ')';
  
  this.fillshadeR = Math.floor(opts.fillred);
  this.fillshadeG = Math.floor(opts.fillgreen);
  this.fillshadeB = Math.floor(opts.fillblue);
  this.fillcolor = 'rgba(' + this.fillshadeR + ',' + this.fillshadeG + ',' + this.fillshadeB + ',' + opts.alpha + ')';
  
  this.size = opts.size;
  this.stroke = opts.stroke;
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


  c.beginPath();
  c.arc(this.x,this.y,this.size,0,2*Math.PI);
  c.lineWidth = this.stroke-1;
  c.shadowBlur = "0";
  c.strokeStyle = this.color;
  c.fillStyle = this.fillcolor;
  c.stroke();
  c.fill();

  this.life++;
  if (this.life >= this.maxLife) {
    delete particles[this.id];
  }

};

function drawParticle() {
  c.fillStyle = "rgba(0,0,0,"+opts.background_alpha+")";
  c.fillRect(0, 0, w, h);
  for (var i = 0; i < particleNum-1; i++) {
    new particle();
  }
  for (var i in particles) {
    particles[i].draw();
  }
}

var mouse = {x: w/2-200, y: h/2-180};
	var last_mouse = {x: w/2-200, y: h/2-180};

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

window.addEventListener( 'resize', function() {
  
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  
  opts.ellipseCX = w / 2;
  opts.ellipseCY = h / 2;
  
  init();
} );

function LuukLamers() {
  
  var i = 0,
      array = [ 300, 74, 0.04, 0.1, 0.1, .55, 10, 100, 10, -.15, .18, .01, 3, 1, w / 2, h / 2, 0.02 ];
  
  for( var key in opts ) {
    
    opts[ key ] = array[ i ];
    ++i;
  }
  
  init();
}

init();
