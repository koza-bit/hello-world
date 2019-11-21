// init canvas
let canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d"),
  H = (canvas.height = 600),
  W = (canvas.width = 600);
document.body.appendChild(canvas);
ctx.lineCap = "round";

document.body.addEventListener("mousemove", event => mousemove(event), false);
let cursor = new Vector(0, 0);
function mousemove(event) {
  cursor.x = event.pageX - canvas.offsetLeft;
  cursor.y = event.pageY - canvas.offsetTop;
}

let gravity = new Vector(0, 0.6);

class Point {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.old_position = new Vector(x, y);
    this.pinned = false;
  }
}

class Link {
  constructor(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
    this.length = p0.position.dist(p1.position);
  }
}

class Blade {
  constructor(x, y, size) {
    this.position = new Vector(x, y);
    this.size = size;
    this.color = "black";
    this.angle = -PI / 2 + Util.random(-PI / 4, PI / 4);
    this.length = Util.map(size, 1, 10, 10, 160);
    this.divisions = Math.ceil(Util.map(this.length, 10, 200, 3, 4));
    this.stiffness = Util.random(2, 6);
    this.thickness = Util.map(size, 1, 10, 1, 16);
    this.points = [];
    this.links = [];

    // add points
    for (let i = 0; i < this.divisions; i++) {
      let separation = this.length / this.divisions * i;
      let v = new Vector(0, 0);
      v.setMag(separation);
      v.setHeading(this.angle);
      v.add(this.position);
      this.points.push(new Point(v.x, v.y));
    }
    this.points[0].pinned = true;
    for (let i = 0; i < this.divisions - 1; i++) {
      this.links.push(new Link(this.points[i], this.points[i + 1]));
    }
  }

  update() {
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];

      if (point.pinned) continue;
      let velocity = point.position.copy();
      velocity.sub(point.old_position);
      velocity.mult(0.98);
      point.old_position = point.position.copy();
      point.position.add(velocity);

      point.position.x += Math.cos(this.angle) * (this.stiffness / i);
      point.position.y += Math.sin(this.angle) * (this.stiffness / i);

      let distance = point.position.dist(cursor);

      if (distance < force_contact.size) {
        let force = new Vector();

        let angle = point.position.angle(cursor);
        force.setMag(Util.map(distance, 0, force_contact.size, 1, 0));
        force.setHeading(angle);
        point.position.sub(force);
      }

      point.position.add(wind.value);
      point.position.add(gravity);
    }
    for (let i = 0; i < 5; i++) {
      this.links.forEach(link => {
        let distance = link.p0.position.dist(link.p1.position),
          difference = link.length - distance,
          percent = difference / distance / 2;
        let offset = new Vector(
          (link.p1.position.x - link.p0.position.x) * percent,
          (link.p1.position.y - link.p0.position.y) * percent
        );
        if (!link.p0.pinned) {
          link.p0.position.sub(offset);
        }
        if (!link.p1.pinned) {
          link.p1.position.add(offset);
        }
      });
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    stroke(this.points.map(point => point.position), this.thickness);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

class Dandelion {
  constructor(x, y, size) {
    this.position = new Vector(x, y);
    this.size = size;
    this.color = "#202236";
    this.max_length = 220;
    this.angle = -PI / 2 + Util.random(-0.3, 0.3);
    this.length = Util.map(size, 1, 10, 60, this.max_length);
    this.divisions = Math.ceil(
      Util.map(this.length, 60, this.max_length, 3, 4)
    );
    this.stiffness = Util.random(4, 8);
    this.thickness = Util.map(this.length, 60, this.max_length, 3, 6);
    this.head_size = Util.map(this.thickness, 3, 6, 6, 18);
    this.points = [];
    this.links = [];

    // add points
    for (let i = 0; i < this.divisions; i++) {
      let separation = this.length / this.divisions * i;
      let v = new Vector(0, 0);
      v.setMag(separation);
      v.setHeading(this.angle);
      v.add(this.position);
      this.points.push(new Point(v.x, v.y));
    }
    this.points[0].pinned = true;
    for (let i = 0; i < this.divisions - 1; i++) {
      this.links.push(new Link(this.points[i], this.points[i + 1]));
    }
  }

  update() {
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];

      if (point.pinned) continue;
      let velocity = point.position.copy();
      velocity.sub(point.old_position);
      velocity.mult(0.98);
      point.old_position = point.position.copy();
      point.position.add(velocity);

      point.position.x += Math.cos(this.angle) * (this.stiffness / i);
      point.position.y += Math.sin(this.angle) * (this.stiffness / i);

      let distance = point.position.dist(cursor);

      if (distance < force_contact.size) {
        let force = new Vector();

        let angle = point.position.angle(cursor);
        force.setMag(Util.map(distance, 0, force_contact.size, 1.6, 0));
        force.setHeading(angle);
        point.position.sub(force);
      }

      point.position.add(wind.value);
      point.position.add(gravity);
    }
    for (let i = 0; i < 5; i++) {
      this.links.forEach(link => {
        let distance = link.p0.position.dist(link.p1.position),
          difference = link.length - distance,
          percent = difference / distance / 2;
        let offset = new Vector(
          (link.p1.position.x - link.p0.position.x) * percent,
          (link.p1.position.y - link.p0.position.y) * percent
        );
        if (!link.p0.pinned) {
          link.p0.position.sub(offset);
        }
        if (!link.p1.pinned) {
          link.p1.position.add(offset);
        }
      });
    }
  }

  draw() {
    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    smoothLine(this.points.map(point => point.position));
    ctx.stroke();
    // head
    ctx.fillStyle = "#c2daf0";
    ctx.beginPath();
    ctx.arc(
      this.points[this.points.length - 1].position.x,
      this.points[this.points.length - 1].position.y,
      this.head_size,
      0,
      2 * Math.PI
    );
    ctx.fill();
    
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(
      this.points[this.points.length - 1].position.x,
      this.points[this.points.length - 1].position.y,
      this.head_size*1.2,
      0,
      2 * Math.PI
    );
    ctx.fill();

  }
}

let tige_colors = ["#202236", "#362520", "#57374c"];

let field = {
  plants: [],
  init: function() {
    this.plants = [];
    let div = Math.floor(Util.random(16, 16));
    noise.seed(Math.random());

    let perspective = Util.random(0.5, 1);

    for (let y = H; y > 0; y -= div) {
      for (let x = W; x > 0; x -= div) {
        let new_pos = new Vector(
          x + Util.random(0, div),
          y + Util.random(0, div)
        );
        let center = new Vector(W / 2, H / 2);
        let min_distance = Math.min(W / 2, H / 2);
        let distance_from_center = new_pos.dist(center);
        let noise_value = noise.simplex2(x / 100, y / 100);
        let new_size =
          Math.abs(noise_value) *
          Util.map(distance_from_center, 0, min_distance, 16, 2);
        if (distance_from_center > min_distance || new_size < 4) continue;

        new_pos.y *= perspective;
        new_pos.y -= H / 2 * perspective - H / 2;

        if (Util.random(0, 1) > 0.97) {
          let d = new Dandelion(new_pos.x, new_pos.y, new_size);
          d.color = tige_colors[Math.floor(Util.random(0, tige_colors.length))];
          this.plants.unshift(d);

          let b = new Blade(new_pos.x, new_pos.y, new_size * 1.2);
          b.color = lerpColor(
            "#095880",
            "#33b03b",
            Util.map(distance_from_center, 0, min_distance, 1, 0)
          );
          b.thickness *= Util.random(1.2, 2.4);
          this.plants.unshift(b);
        } else {
          let b = new Blade(new_pos.x, new_pos.y, new_size);
          b.color = lerpColor(
            "#095880",
            "#33b03b",
            Util.map(distance_from_center, 0, min_distance, 1, 0)
          );
          if (Util.random(0, 1) > 0.9) {
            b.color = lerpColor(
              "#a83d16",
              "#33b03b",
              Util.map(distance_from_center, 0, min_distance, 1, 0)
            );
          }
          this.plants.unshift(b);
        }
        /*
        if(y <H/2){
        b.color = lerpColor(
              "#fff9ed",
              b.color,
              Util.map(y, 0, H/2, 0, 1)
            );
      }*/
      }
    }
  },
  render: function() {
    this.plants.forEach(plant => {
      plant.draw();
    });
    this.plants.forEach(plant => {
      plant.update();
    });
  }
};

field.init();

let wind = {
  value: new Vector(0, 0),
  reset: function() {
    this.time_start = new Date();
    this.start = this.value.x;
    this.duration = Util.random(200, 2000);
    this.goal = Util.random(-0.4, 0.4);
  },
  update: function() {
    let time = new Date() - this.time_start;
    if (time < this.duration) {
      this.value.x = Tween.linear(
        time,
        this.start,
        this.goal - this.start,
        this.duration
      );
    } else {
      setTimeout(() => {
        this.reset();
      }, Util.random(100, 3000));
    }
  }
};
wind.reset();

let force_contact = {
  size: 200,
  center: new Vector(W / 2, H / 2),
  draw: function() {
    let opacity = Util.map(
      cursor.dist(this.center),
      Math.min(W / 4, H / 4),
      Math.min(W / 2, H / 2),
      0.3,
      0
    );

    ctx.fillStyle = "rgba(20,40,20," + opacity + ")";
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, 30, 0, 2 * Math.PI);
    ctx.fill();
  }
};

update();

function update() {
  ctx.clearRect(0, 0, W, H);
  field.render();
  wind.update();
  force_contact.draw();
  requestAnimationFrame(update);
}

function stroke(points, max_width) {
  let side_1 = [];
  let side_2 = [];
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let angle = 0;
    if (i === 0) {
      // first point
      angle = p.angle(points[i + 1]) + Math.PI / 2;
    } else if (i === points.length - 1) {
      // last point
      angle = p.angle(points[i - 1]) - Math.PI / 2;
    } else {
      // intermediate point
      let small = Math.max(p.angle(points[i + 1]), points[i - 1].angle(p));
      angle = small + Util.threeAngle(points[i - 1], p, points[i + 1]) / 2;
    }
    let target = points.length - 1;
    let width = Tween.easeInOutQuad(i, 0, target - i, target) * max_width;
    // let width = Util.lerp(60, 0, i / points.length+1);

    p_1 = new Vector(0, 0);
    p_1.setMag(width);
    p_1.setHeading(angle);
    p_1.add(p);

    p_2 = new Vector(0, 0);
    p_2.setMag(width);
    p_2.setHeading(angle + Math.PI);
    p_2.add(p);

    side_1.push(p_1);
    side_2.unshift(p_2);
  }
  ctx.beginPath();
  ctx.moveTo(side_1[0].x, side_1[0].y);
  smoothEdges(side_1);
  ctx.lineTo(side_2[0].x, side_2[0].y);
  smoothEdges(side_2);
  ctx.moveTo(side_2[side_2.length - 1].x, side_2[side_2.length - 1].y);
  ctx.lineTo(side_1[0].x, side_1[0].y);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}

function smoothEdges(points) {
  for (i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  ctx.quadraticCurveTo(
    points[i].x,
    points[i].y,
    points[i + 1].x,
    points[i + 1].y
  );
}

function smoothLine(points) {
  ctx.moveTo(points[0].x, points[0].y);
  for (i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  ctx.quadraticCurveTo(
    points[i].x,
    points[i].y,
    points[i + 1].x,
    points[i + 1].y
  );
}

// https://gist.github.com/rosszurowski/67f04465c424a9bc0dae

function lerpColor(a, b, amount) {
  var ah = parseInt(a.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ""), 16),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (
    "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  );
}

const PI = Math.PI,
      TWO_PI = Math.PI * 2;

const Util = {};
Util.timeStamp = function() {
  return window.performance.now();
};
Util.random = function(min, max) {
  return min + Math.random() * (max - min);
};
Util.map = function(a, b, c, d, e) {
  return (a - b) / (c - b) * (e - d) + d;
};
Util.lerp = function(value1, value2, amount) {
  return value1 + (value2 - value1) * amount;
};
Util.clamp = function(value,min,max){
  return Math.max(min, Math.min(max, value));
};
Util.array2D = function(tableau, array_width){
  var result = [];
  for (var i = 0; i < tableau.length; i += array_width) result.push(tableau.slice(i, i + array_width));
  return result;
};
Util.threeAngle = function(p0,p1,p2){
    var b = Math.pow(p1.x-p0.x,2) + Math.pow(p1.y-p0.y,2),
        a = Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),
        c = Math.pow(p2.x-p0.x,2) + Math.pow(p2.y-p0.y,2);
    return Math.acos( (a+b-c) / Math.sqrt(4*a*b) );
}

const Tween = {};
Tween.linear = function(currentTime, start, degreeOfChange, duration) {
  return degreeOfChange * currentTime / duration + start;
};
Tween.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
Tween.easeInOutExpo = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  t--;
  return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
};
class v3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Vector{
  constructor(x,y){
    this.x = x || 0;
    this.y = y || 0;
  }
  set(x,y){
    this.x = x;
    this.y = y;
  }
  reset(){
    this.x = 0;
    this.y = 0;
  }
  fromAngle(angle){
    let x = Math.cos(angle),
      y = Math.sin(angle);
    return new Vector(x,y);
  }
  add(vector){
    this.x += vector.x;
    this.y += vector.y;
  }
  sub(vector){
    this.x -= vector.x;
    this.y -= vector.y;
  }
  mult(scalar){
    this.x *= scalar;
    this.y *= scalar;
  }
  div(scalar){
    this.x /= scalar;
    this.y /= scalar;
  }
  dot(vector){
    return vector.x * this.x + vector.y * this.y;
  }
  limit(limit_value){
    if(this.mag() > limit_value) this.setMag(limit_value);
  }
  mag(){
    return Math.hypot(this.x,this.y);
  }
  setMag(new_mag){
    if(this.mag() > 0){
      this.normalize();
    }else{
      this.x = 1;
      this.y = 0;
    }
    this.mult(new_mag);
  }
  normalize(){
    let mag = this.mag();
    if(mag > 0){
      this.x /= mag;
      this.y /= mag;
    }
  }
  heading(){
    return Math.atan2(this.y,this.x);
  }
  setHeading(angle){
    let mag = this.mag();
    this.x = Math.cos(angle) * mag;
    this.y = Math.sin(angle) * mag;
  }
  dist(vector){
    return new Vector(this.x - vector.x,this.y - vector.y).mag();
  }
  angle(vector){
    return Math.atan2(vector.y - this.y, vector.x - this.x);
  } 
  copy(){
    return new Vector(this.x,this.y);
  }
}

const cp = CanvasRenderingContext2D.prototype;
cp.circle = function(x, y, radius) {
  this.beginPath();
  this.arc(x, y, radius, 0, 2 * Math.PI);
};
cp.fillCircle = function(x, y, radius) {
  this.circle(x, y, radius);
  this.fill();
};
cp.strokeCircle = function(x, y, radius) {
  this.circle(x, y, radius);
  this.stroke();
};

/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

(function(global){
  var module = global.noise = {};

  function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }
  
  Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
  };

  Grad.prototype.dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
  };

  var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
               new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
               new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

  var p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  // To remove the need for index wrapping, double the permutation table length
  var perm = new Array(512);
  var gradP = new Array(512);

  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  module.seed = function(seed) {
    if(seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if(seed < 256) {
      seed |= seed << 8;
    }

    for(var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed>>8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  };

  module.seed(0);

  /*
  for(var i=0; i<256; i++) {
    perm[i] = perm[i + 256] = p[i];
    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
  }*/

  // Skewing and unskewing factors for 2, 3, and 4 dimensions
  var F2 = 0.5*(Math.sqrt(3)-1);
  var G2 = (3-Math.sqrt(3))/6;

  var F3 = 1/3;
  var G3 = 1/6;

  // 2D simplex noise
  module.simplex2 = function(xin, yin) {
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*G2;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1=1; j1=0;
    } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255;
    j &= 255;
    var gi0 = gradP[i+perm[j]];
    var gi1 = gradP[i+i1+perm[j+j1]];
    var gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
  };

  // 3D simplex noise
  module.simplex3 = function(xin, yin, zin) {
    var n0, n1, n2, n3; // Noise contributions from the four corners

    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin+zin)*F3; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var k = Math.floor(zin+s);

    var t = (i+j+k)*G3;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    var z0 = zin-k+t;

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if(x0 >= y0) {
      if(y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else              { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if(y0 < z0)      { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else             { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + G3; // Offsets for second corner
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;

    var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
    var y2 = y0 - j2 + 2 * G3;
    var z2 = z0 - k2 + 2 * G3;

    var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
    var y3 = y0 - 1 + 3 * G3;
    var z3 = z0 - 1 + 3 * G3;

    // Work out the hashed gradient indices of the four simplex corners
    i &= 255;
    j &= 255;
    k &= 255;
    var gi0 = gradP[i+   perm[j+   perm[k   ]]];
    var gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
    var gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
    var gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

    // Calculate the contribution from the four corners
    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
    }
    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
    }
    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if(t3<0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 32 * (n0 + n1 + n2 + n3);

  };

  // ##### Perlin noise stuff

  function fade(t) {
    return t*t*t*(t*(t*6-15)+10);
  }

  function lerp(a, b, t) {
    return (1-t)*a + t*b;
  }

  // 2D Perlin Noise
  module.perlin2 = function(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var n00 = gradP[X+perm[Y]].dot2(x, y);
    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
       fade(y));
  };

  // 3D Perlin Noise
  module.perlin3 = function(x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    // Get relative xyz coordinates of point within that cell
    x = x - X; y = y - Y; z = z - Z;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255; Z = Z & 255;

    // Calculate noise contributions from each of the eight corners
    var n000 = gradP[X+  perm[Y+  perm[Z  ]]].dot3(x,   y,     z);
    var n001 = gradP[X+  perm[Y+  perm[Z+1]]].dot3(x,   y,   z-1);
    var n010 = gradP[X+  perm[Y+1+perm[Z  ]]].dot3(x,   y-1,   z);
    var n011 = gradP[X+  perm[Y+1+perm[Z+1]]].dot3(x,   y-1, z-1);
    var n100 = gradP[X+1+perm[Y+  perm[Z  ]]].dot3(x-1,   y,   z);
    var n101 = gradP[X+1+perm[Y+  perm[Z+1]]].dot3(x-1,   y, z-1);
    var n110 = gradP[X+1+perm[Y+1+perm[Z  ]]].dot3(x-1, y-1,   z);
    var n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

    // Compute the fade curve value for x, y, z
    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    // Interpolate
    return lerp(
        lerp(
          lerp(n000, n100, u),
          lerp(n001, n101, u), w),
        lerp(
          lerp(n010, n110, u),
          lerp(n011, n111, u), w),
       v);
  };

})(this);