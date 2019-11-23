let c = init("canvas").c,
    canvas = init("canvas").canvas,
    w = (canvas.width = window.innerWidth * 2),
    h = (canvas.height = window.innerHeight * 2);
//initiation

c.lineWidth = 0.5;

class bubble {
    constructor() {
        this.r = Math.random() * 20;
        this.x = Math.random() * (w - 2 * this.r) + this.r;
        this.y = Math.random() * (h - 2 * this.r) + this.r;
    }
    show() {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        c.fillStyle = "black";
        c.fill();
    }
}

function sidi(x1, y1, x2, y2, r2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) - r2;
}

class ray{
  constructor(){
    
  }
  march(obj, x, y, a, it, it2){
    this.x = x;
    this.y = y;
    this.a = a;
    this.d = Infinity;


    for (let i = 0; i < obj.length; i++) {
        this.cd = sidi(this.x, this.y, obj[i].x, obj[i].y, obj[i].r);
        if (this.cd < this.d) {
            this.d = this.cd;
            this.cx = obj[i].x;
            this.cy = obj[i].y;
            this.cr = obj[i].r;
        }
    }

    this.nx = this.x + this.d * Math.cos(this.a);
    this.ny = this.y + this.d * Math.sin(this.a);
    
    if (this.d > 0) {
        c.globalCompositeOperation = "lighter";
        if (it > 0) {
            // c.beginPath();
            // c.arc(this.x, this.y, 1, 0, 2 * Math.PI);
            // c.fillStyle = "rgba(150,225,0,1)";
            // c.fill();
            // c.strokeStyle = "rgb(150,225,0)";
            // c.lineWidth = 0.2;
            // c.stroke();
        }

        c.beginPath();
        c.lineTo(this.x, this.y);
        c.lineTo(this.nx, this.ny);
        c.strokeStyle = "rgb(255,255,120)";
        c.lineWidth = 0.7;
        c.stroke();
        c.globalCompositeOperation = "source-over";
    }

    if (it == 0) {
        this.march(obj, this.nx, this.ny, this.a, it + 1, it2);
    }

    if (it > 0 && this.d >= 0.1 && (this.x > 0 && this.x < w && this.y > 0 && this.y < h)) {
        this.march(obj, this.nx, this.ny, this.a, it + 1, it2);
    }
    if (this.d < 1 && this.d > 0) {
      if(it2 < 2){
        
        this.dxcx = Math.sqrt(Math.pow(this.x-this.cx,2)+Math.pow(this.y-this.cy,2));
        this.alpha = this.a-Math.atan2(this.cy-this.y,this.cx-this.x);
        this.da = Math.asin((this.dxcx*Math.sin(this.alpha))/this.cr);
        
        this.march(obj, this.nx, this.ny, this.a+(2*this.da-Math.PI), it + 1, it2+1);   
      }
      
        // if (
        //     visible.length > 0 &&
        //     this.nx != visible[visible.length - 1].x &&
        //     this.ny != visible[visible.length - 1].y
        // ) {
        //     visible.push({
        //         x: this.nx,
        //         y: this.ny
        //     });
        //     return;
        // }
        // if (visible.length == 0) {
        //     visible.push({
        //         x: this.nx,
        //         y: this.ny
        //     });
        //     return;
        // }
    }
  }
}

let bubs = [],
    rays = [],
    num = 300,
    ang = 0,
    counter = 0,
    visible = [],
    inside = false,
    u = false,
    d = false,
    r = false,
    l = false,
    x = w / 2,
    y = h / 2,
    numor = 100,
    fow = 2 * Math.PI / 3;

for (let i = 0; i < num; i++) {
    bubs.push(new bubble());
}

for (let k = -(numor - 1) / 2; k <= (numor - 1) / 2; k++) {
  rays.push(new ray());
}

function draw() {
    //animation
    if (inside) {
        ang = Math.atan2(mouse.y - y, mouse.x - x);
    } else {
        ang += fow / (20*(numor - 1) - (numor - 1) / 10);
    }
    for (let i = 0; i < num; i++) {
        bubs[i].show();
    }

    if (u) {
        y -= 10;
    }
    if (d) {
        y += 10;
    }
    if (r) {
        x += 10;
    }
    if (l) {
        x -= 10;
    }

    for (let k = -(numor - 1) / 2; k <= (numor - 1) / 2; k++) {
        rays[k+(numor - 1) / 2].march(bubs, x, y, ang + k * fow / (numor - 1), 0,0);
    }

    c.beginPath();
    c.arc(x, y, 4, 0, 2 * Math.PI);
    c.fillStyle = "rgb(255,255,255)";
    c.fill();

    // for (let j = 0; j < visible.length; j++) {
    //     c.fillStyle = "white";
    //     c.fillRect(visible[j].x, visible[j].y, 1, 1);
    // }
    // if (visible.length >= 200) {
    //     visible.splice(0, numor * 0.8);
    // }
}

window.addEventListener(
    "keydown",
    function(e) {
        if (e.keyCode == 87) {
            u = true;
        }
        if (e.keyCode == 83) {
            d = true;
        }
        if (e.keyCode == 68) {
            r = true;
        }
        if (e.keyCode == 65) {
            l = true;
        }
    },
    false
);

window.addEventListener(
    "keyup",
    function(e) {
        if (e.keyCode == 87) {
            u = false;
        }
        if (e.keyCode == 83) {
            d = false;
        }
        if (e.keyCode == 68) {
            r = false;
        }
        if (e.keyCode == 65) {
            l = false;
        }
    },
    false
);

let mouse = {
    x: 0,
    y: 0
};
let last_mouse = {
    x: 0,
    y: 0
};

canvas.addEventListener(
    "mousemove",
    function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX * 2 - this.offsetLeft * 2;
        mouse.y = e.pageY * 2 - this.offsetTop * 2;
    },
    false
);

canvas.addEventListener(
    "mouseout",
    function(e) {
        inside = false;
    },
    false
);
canvas.addEventListener(
    "mouseover",
    function(e) {
        inside = true;
    },
    false
);

function init(elemid) {
    let canvas = document.getElementById(elemid),
        c = canvas.getContext("2d"),
        w = (canvas.width = window.innerWidth * 2),
        h = (canvas.height = window.innerHeight * 2);
    c.fillStyle = "rgba(30,30,30,1)";
    c.fillRect(0, 0, w, h);
    return {
        c: c,
        canvas: canvas
    };
}

window.requestAnimFrame = function() {
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
};

function loop() {
    window.requestAnimFrame(loop);
    c.clearRect(0, 0, w, h);
    draw();
}

window.addEventListener("resize", function() {
    (w = canvas.width = window.innerWidth * 2),
    (h = canvas.height = window.innerHeight * 2);
    loop();
});

loop();
setInterval(loop, 1000 / 60);
