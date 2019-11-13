'use strict';

// --------------------
// Init
// --------------------

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var mousePos = {x: canvas.width / 2, y: canvas.height / 2};
var mouseDown = false;

canvas.addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(canvas, evt);
}, false);

canvas.addEventListener('mousedown', function(evt) {
    mouseDown = true;
}, false);

canvas.addEventListener('mouseup', function(evt) {
    mouseDown = false;
});

// --------------------
// Drawing
// --------------------

function Clear() {

    this.update = function() {

        context.fillStyle = 'rgba(0, 0, 0, 1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fill();
    };
}

function Ball(x, y, size, resolution, color) {

    this.x = x;
    this.y = y;
    this.size = size;
    this.resolution = resolution;
    this.color = color !== undefined ? color : 'rgba(255, 255, 255, .1)';
}

    Ball.prototype.update = function() {

        this.draw();
    };

    Ball.prototype.draw = function() {

        for (var i = this.size ; i >= 0 ; i-=this.resolution) {

            context.beginPath();
            context.arc(this.x, this.y, this.size - i, 0, Math.PI * 2, false);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
    };

function PolyLine(
    points,
    detailIncrement,
    speed,
    amplitude,
    amplitudeDecrease,
    resolution,
    color,
    lineSize
) {

    this.points = points;
    this.detailIncrement = detailIncrement;
    this.speed = speed;
    this.amplitude = amplitude;
    this.amplitudeDecrease = amplitudeDecrease;
    this.start = this.points.splice(0, 1)[0];
    this.resolution = resolution === undefined ? 1 : resolution;
    this.counter = 0;
    this.acceleration = new Vector(0, 0);
    this.color = color !== undefined ? color : {r:{c:255}, g:{c:255}, b:{c:255}, a:{c:1}};
    this.lineSize = lineSize !== undefined ? lineSize : {start: 4, target: 0.5, change: 1.5};
}

    PolyLine.prototype.update = function() {

        this.applyForce(new Vector(2, 3));

        this.draw();

        this.acceleration.multiply(0);
    };

    PolyLine.prototype.applyForce = function(force) {

        this.acceleration.add(force);
    };

    PolyLine.prototype.getColor = function(r, g, b, a) {

        var red = r.c !== undefined ? r.c : (Math.floor(r.co) * r.m);
        var green = g.c !== undefined ? g.c : (Math.floor(g.co) * g.m);
        var blue = b.c !== undefined ? b.c : (Math.floor(b.co) * b.m);
        var alpha = a.c !== undefined ? a.c : (Math.floor(a.co) * a.m);

        var color = 'rgba(' +
            String(red) + ',' +
            String(green) + ',' +
            String(blue) + ',' +
            String(alpha) +
        ')';

        return color;
    };

    PolyLine.prototype.draw = function() {

        var point = 0;
        var location = this.start.get();

        var step = new Vector(0, 0);
        var detailCounter = 0;
        var radius = this.lineSize.start;
        var amplitude = this.amplitude;
        var decrease = this.amplitudeDecrease;

        var lineNext = false;

        while(true) {

            var distance = location.distance(this.points[point]);
            if (distance <= this.resolution) {
                point++;
                if (this.points[point] === undefined) {
                    break;
                } else {
                    step = new Vector(0, 0);
                }
            }

            var direction = Vector.subtract(this.points[point], location);
            direction.normalize();

            amplitude -= decrease;
            if (amplitude <= 0) {
                amplitude = 0;
            }

            var x = location.x + (Math.cos((detailCounter * this.resolution) + this.counter) * amplitude * this.acceleration.x);
            var y = location.y + (Math.sin((detailCounter * this.resolution) + this.counter) * amplitude * this.acceleration.y);

            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2, false);

            if (!lineNext) {
                radius -= 0.5;
                if (radius <= (this.lineSize.target * 2)) {
                    lineNext = true;
                }
            } else {
                radius = this.lineSize.target + (detailCounter * this.lineSize.change);
            }

            this.color.r.co = this.color.r.m !== undefined ? detailCounter : undefined;
            this.color.g.co = this.color.g.m !== undefined ? detailCounter : undefined;
            this.color.b.co = this.color.b.m !== undefined ? detailCounter : undefined;
            this.color.a.co = this.color.a.m !== undefined ? detailCounter : undefined;

            context.fillStyle = this.getColor(
                this.color.r,
                this.color.g,
                this.color.b,
                this.color.a
            );

            context.closePath();
            context.fill();

            step.add(direction);
            step.limit(this.resolution);

            location.add(step);

            detailCounter += this.detailIncrement;
        }

        this.counter += this.speed;
    };

function Aenemona1(x, y) {

    this.polyLinesLowerLayer = [];
    this.polyLinesUpperLayer = [];

    this.ball = new Ball(x, y ,40, 1, 'rgba(100, 150, 100, .1)');
    this.topBall = new Ball(x, y, 10, 1, 'rgba(100, 150, 100, .1)');

    var count = 13;
    for (var i = 0 ; i < count ; i++) {

        var fromToLowerLayer = [
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 100),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 100)
            ),
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2))),
                y + (Math.sin((i / count)  * (Math.PI * 2)))
            )
        ];

        this.polyLinesLowerLayer.push(new PolyLine(fromToLowerLayer, 0.04, 0.03, 5, 0.06, 1,
            {r: {m:100}, g: {c:255}, b: {m:200}, a: {c:.15}},
            {start: 3, target: 0.5, change: 1.5}
        ));
    }

    count = 11;
    for (var i = 0 ; i < count ; i++) {

        var fromToUpperLayer = [
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 80),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 80)
            ),
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 15),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 15)
            )
        ];

        this.polyLinesUpperLayer.push(new PolyLine(fromToUpperLayer, 0.04, 0.03, 5, 0.06, 1,
            {r: {m:110}, g: {c:255}, b: {m:110}, a: {c:.25}},
            {start: 4, target: 1, change: 1.5}
        ));
    }
}

    Aenemona1.prototype.update = function() {

        this.ball.update();

        for (var i in this.polyLinesLowerLayer) {

            this.polyLinesLowerLayer[i].update();
        }

        for (var i in this.polyLinesUpperLayer) {

            this.polyLinesUpperLayer[i].update();
        }

        this.topBall.update();
    };

function Aenemona2(x, y) {

    this.polyLinesLowerLayer = [];
    this.polyLinesMiddleLayer = [];
    this.polyLinesUpperLayer = [];

    this.ball = new Ball(x, y, 30, 1, 'rgba(100, 0, 100, .1)');

    var count = 20;
    for (var i = 0 ; i < count ; i++) {

        var fromToLowerLayer = [
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 90),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 90)
            ),
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 10),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 10)
            )
        ];

        this.polyLinesLowerLayer.push(new PolyLine(fromToLowerLayer, 0.06, 0.05, 5, 0.06, 1,
            {r: {m:50}, g: {m:50}, b: {m:210}, a: {c:.5}},
            {start: 11, target: 1, change: 0.05}
        ));


    }

    count = 15;
    for (var i = 0 ; i < count ; i++) {

        var fromToMiddleLayer = [
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 120),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 120)
            ),
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 30),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 30)
            )
        ];

        this.polyLinesMiddleLayer.push(new PolyLine(fromToMiddleLayer, 0.06, 0.05, 5, 0.06, 1,
            {r: {m:50}, g: {m:100}, b: {m:210}, a: {c:.05}},
            {start: 0.5, target: 1, change: 1.2}
        ));
    }

    var count = 15;
    for (var i = 0 ; i < count ; i++) {

        var fromToUpperLayer = [
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 120),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 120)
            ),
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 30),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 30)
            )
        ];

        this.polyLinesUpperLayer.push(new PolyLine(fromToUpperLayer, 0.06, 0.05, 5, 0.06, 1,
            {r: {m:50}, g: {m:100}, b: {m:210}, a: {c:.5}},
            {start: 0.5, target: 0.3, change:.4}
        ));
    }
}

    Aenemona2.prototype.update = function() {

        this.ball.update();

        for (var i in this.polyLinesLowerLayer) {

            this.polyLinesLowerLayer[i].update();
        }

        for (var i in this.polyLinesMiddleLayer) {

            this.polyLinesMiddleLayer[i].update();
        }

        for (var i in this.polyLinesUpperLayer) {

            this.polyLinesUpperLayer[i].update();
        }
    };

function Aenemona3(x, y) {

    this.polyLinesMiddleLayer = [];
    this.polyLinesLowerLayer = [];
    this.polyLinesTopLayer = [];

    this.ball = new Ball(x, y ,40, 1, 'rgba(240, 70, 10, .06)');
    this.topBall = new Ball(x, y, 10, 1, 'rgba(240, 70, 10, .1)');

    var count = 17;
    for (var i = 0 ; i < count ; i++) {

        var fromToLowerLayer = [
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 70),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 70)
            ),
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 5),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 5)
            )
        ];

        this.polyLinesLowerLayer.push(new PolyLine(fromToLowerLayer, 0.04, 0.05, 5, 0.06, 1,
            {r: {c:255}, g: {m:100}, b: {m:100}, a: {c:.25}},
            {start:2, target: 1, change: 0.05}
        ));


    }

    count = 15;
    for (var i = 0 ; i < count ; i++) {

        var fromToMiddleLayer = [
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 100),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 100)
            ),
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 20 ),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 20 )
            )
        ];

        this.polyLinesMiddleLayer.push(new PolyLine(fromToMiddleLayer, 0.04, 0.05, 5, 0.06, 1,
            {r: {c:200}, g: {m:100}, b: {m:100}, a: {c:.4}},
            {start:2, target: 0.1, change:.9}
        ));
    }

    count = 7;
    for (var i = 0 ; i < count ; i++) {

        var fromToTopLayer = [
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 90),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 90)
            ),
            new Vector(
                x + (Math.cos((i / count) * (Math.PI * 2)) * 15 ),
                y + (Math.sin((i / count)  * (Math.PI * 2)) * 15 )
            )
        ];

        this.polyLinesTopLayer.push(new PolyLine(fromToTopLayer, 0.04, 0.05, 5, 0.06, 1,
            {r: {c:255}, g: {m:100}, b: {c:100}, a: {c:.25}},
            {start:5, target: 0.5, change:.4}
        ));
    }
}

    Aenemona3.prototype.update = function() {

        this.ball.update();

        for (var i in this.polyLinesLowerLayer) {

            this.polyLinesLowerLayer[i].update();
        }

        for (var i in this.polyLinesMiddleLayer) {

            this.polyLinesMiddleLayer[i].update();
        }

        for (var i in this.polyLinesTopLayer) {

            this.polyLinesTopLayer[i].update();
        }

        this.topBall.update();
    };



// --------------------
// Animate
// --------------------

function Stage() {

    this.clear = new Clear();
    this.aenemona1 = new Aenemona1(canvas.width / 4, canvas.height / 2);
    this.aenemona2 = new Aenemona2(canvas.width / 4 * 2, canvas.height / 2);
    this.aenemona3 = new Aenemona3(canvas.width / 4 * 3, canvas.height / 2);

    var animate = function() {

        this.clear.update();
        this.aenemona2.update();
        this.aenemona1.update();
        this.aenemona3.update();

        requestAnimationFrame(animate);

    }.bind(this);

    animate();
}

function Vector(x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z === undefined ? 0 : z;

    this.add = function(v) {

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    };

    this.multiply = function(n) {

        this.x *= n;
        this.y *= n;
        this.z *= n;
    };

    this.divide = function(n) {

        this.x /= n;
        this.y /= n;
        this.z /= n;
    };

    this.magnitude = function() {

        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };

    this.normalize = function() {
        var m = this.magnitude();
        if (m !== 0) {
            this.divide(m);
        }
    };

    this.limit = function(n) {

        if (this.magnitude() > n) {
            this.normalize();
            this.multiply(n);
        }
    };

    this.distance = function(v) {

        var dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    this.inverseX = function() {

        this.x *= -1;
    };

    this.inverseY = function() {

        this.y *= -1;
    };

    this.inverseZ = function() {

        this.z *= -1;
    };

    this.get = function() {

        return new Vector(this.x, this.y, this.z);
    };

    this.dot = function(v) {

        return this.x * v.x + this.y * v.y + this.z * v.z;
    };
}

// -------------------------
// Vector: Static
// -------------------------

Vector.add = function(v1, v2) {

    var v3 = new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);

    return v3;
};

Vector.subtract = function(v1, v2) {

    var v3 = new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);

    return v3;
};

Vector.multiply = function(v1, v2) {

    var v3 = new Vector(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);

    return v3;
};

Vector.divide = function(v1, v2) {

    if (typeof v2 === Vector) {
        var v3 = new Vector(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    } else {
        var v3 = new Vector(v1.x / v2, v1.y / v2, v1.z / v2);
    }

    return v3;
};

Vector.distance = function(v1, v2) {

    return v1.distance(v2);
};

Vector.random2D = function() {

    var x = parseInt((Math.random() * 3)) -1;
    var y = parseInt((Math.random() * 3)) -1;
    var z = parseInt((Math.random() * 2)) -1;

    var v1 = new Vector(x, y, z);
    return v1;
};

new Stage();
