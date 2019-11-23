var c = document.getElementById("c"),
    ctx = c.getContext("2d"),    
    cw = c.width = window.innerWidth,
    ch = c.height = window.innerHeight,
    size = 36,
    border = -12,
    isTweening = false,
    particles = [],
    Particle = function(index,x,y) { //console.log(index)
      this.x = x-Math.abs(border)/2;
      this.y = y-Math.abs(border)/2;
      this.scale = size;
      this.opacity = 1;
      this.draw = function() { //console.log()
        ctx.translate( this.x, this.y );
        ctx.globalAlpha = this.opacity;
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = 'hsl('+index+', 90%, '+(10+this.y/(ch+10))+'%)';//'rgb('+(75+index*1.5)+','+(index/(y+1))+',50)';
        ctx.fillRect((size-this.scale)/2, (size-this.scale)/2, this.scale-border, this.scale-border);
        ctx.globalAlpha = 1;
        ctx.translate( -this.x, -this.y );        
      }
      this.draw();
    }

function setGrid(){
  
  cw = Math.ceil(window.innerWidth/size);
  ch = Math.ceil(window.innerHeight/size);
  
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  particles = [];
  
  for (var _x = i = 0; _x < cw; _x++) {
    for (var _y = 0; _y < ch; _y++) {
      particles.push( new Particle(i, _x*size, _y*size) );      
      i++;
    }
  }
}

window.onresize = setGrid;
setGrid();

c.addEventListener('mousemove', function(e){ 
  if ( isTweening ) return; //prevent overlap
  isTweening = true;
  gsap.ticker.add(redraw);
  gsap.to(particles, {
      duration:0.5,
      scale:size/4,
      opacity:0,
      ease:Back.easeIn.config(20),
      stagger: {
        yoyo:true,
        repeat:1,
        amount:0.6,
        grid:[cw,ch],
        from:Math.floor(e.clientX/size)*ch+Math.floor(e.clientY/size) //compute the index of the current box
      },
      onComplete:function(){ isTweening=false; gsap.ticker.remove(redraw); }
  });

});


function redraw(){
  ctx.clearRect(0,0,c.width,c.height);
  for (var i=0; i<particles.length; i++) particles[i].draw();
}
