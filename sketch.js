let mouse, mouseSpeed = 0.2, mouseSize = 15, tMouseSize = 15, font, player;
let drag = 0.8;
let layer = 0; // 0 = pause, 1 = playing, 2 = lose
let score = 0, lScore = 0;
let objects = [];

async function setup() {
    createCanvas(windowWidth, windowHeight);
    fill(255); noStroke(); textAlign(CENTER);
    background(0);
    textSize(25);
    text("Loading...", width / 2, height / 2);
    font = await loadFont('font.ttf');
    textFont(font);
    mouse = { x: mouseX, y: mouseY };
    player = new Player();
    rectMode(CENTER);
    objects.push(new Obj(width * Math.random(), height * Math.random(), 20, "norm"));
}

function lerp(p0, p1, t) { return (1 - t) * p0 + t * p1; }
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function draw() {
    // processing
    mouse = { x: lerp(mouse.x, mouseX, mouseSpeed), y: lerp(mouse.y, mouseY, mouseSpeed) };
    mouseSize = lerp(mouseSize, tMouseSize, mouseSpeed * 2); background(0);
    if (mouse.x > 100 && mouse.x < 200 && mouse.y > 100 && mouse.y < 200) tMouseSize = 30; else tMouseSize = 15;

    // object operations
    if (layer == 1) {
        player.update();
    }
    for (let obj of objects) {
        obj.draw();
    }
    player.draw();

    if (layer == 1) {
        tMouseSize = 0;
        blendMode(DIFFERENCE);
        text("Score: " + Math.floor(lScore), width / 2, 50);
        blendMode(BLEND);
        lScore = lerp(lScore, score, 0.1);
    } else if (layer == 0) {
        text("Click rapidly to switch directions, do not hit the walls", width / 2, height * 3 / 4)
    } else if (layer == 2) {
        tMouseSize = 15;
        text("Game Over! Score: " + Math.floor(lScore) + "\nClick to restart", width / 2, height / 2 + 50);
    }

    // compositing
    blendMode(DIFFERENCE);
    circle(mouse.x, mouse.y, mouseSize);
    blendMode(BLEND);
}

async function callLose() {
    lScore = score;
    score = 0;
    layer = 2;
    let pi = { x: player.x, y: player.y };
    for (let i = 0; i <= 100; i++) {
        player.x = lerp(pi.x, width / 2, i / 100);
        player.y = lerp(pi.y, height / 2, i / 100);
        await delay(5);
    }
    //alert("You scored " + lScore + "!");
}

class Player {
    constructor() {
        this.size = 10;
        this.vx = this.vy = this.ax = this.ay = 0;
        this.x = width / 2; this.y = height / 2;
        this.dir = 0;
        this.accFactor = 0.2;
        this.ax = this.accFactor;
        this.accFactorFactor = 1;
    }

    draw() {
        fill(255); noStroke();
        rect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
        this.accFactorFactor -= 0.0001;
        if (this.accFactorFactor < 0) this.accFactorFactor = 0;
        this.accFactor += 0.0001 * this.accFactorFactor;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            callLose();
        } else {
            for (let obj of objects) {
                let tH = this.size / 2;
                let oH = obj.size / 2;
                if (
                    this.x - tH < obj.x + oH &&
                    this.x + tH > obj.x - oH &&
                    this.y - tH < obj.y + oH &&
                    this.y + tH > obj.y - oH
                ) {
                    obj.vx = this.vx * (0.7 + Math.random() * 0.4) / 2;
                    obj.vy = this.vy * (0.7 + Math.random() * 0.4) / 2;
                    obj.vs = 0.5 + Math.random();
                    if (obj.type == "norm") {
                        score += Math.random() * 10;
                        objects.push(new Obj(width * Math.random(), height * Math.random(), 20, Math.random() > 0.2 ? "norm" : "red"));
                    }
                    else { callLose(); }
                }
            }
        }
    }

    clock() {
        if (layer == 2) {
            player = new Player();
            layer = 0;
            return;
        }
        if (layer != 1) layer = 1;
        let t = this.vx * drag;
        this.vx = -this.vy * drag;
        this.vy = t;
        this.dir = (this.dir + 1) % 4;
        switch (this.dir) {
            case 0:
                this.ax = this.accFactor; this.ay = 0; break;
            case 1:
                this.ax = 0; this.ay = this.accFactor; break;
            case 2:
                this.ax = -this.accFactor; this.ay = 0; break;
            case 3:
                this.ax = 0; this.ay = -this.accFactor; break;
        }
    }
}

class Obj {
    constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.tSize = size;
        this.type = type;
        this.vx = this.vy = this.vs = 0;
        this.s2 = size - 2;
        this.age = 3000;
    }

    draw() {
        this.x += this.vx;
        this.y += this.vy;
        this.age -= 1;
        if (this.age < 0) {
            this.vs = 0.5 + Math.random();
        }
        this.size -= this.vs;
        this.s2 += this.vs * 2;
        if (this.size < 0) {
            return;
        }
        if(this.vs == 0) { this.size = lerp(this.size, this.tSize, 0.1); }
        let col = this.type == "norm" ? color(255, 255 * this.size / 20) : color(255, 0, 0, 255 * this.size / 20);
        stroke(col);
        strokeWeight(4);
        noFill();
        rect(this.x, this.y, this.s2);
        noStroke();
        fill(col);
        rect(this.x, this.y, this.size);
    }
}

function keyPressed() {
    player.clock();
}

function mousePressed(e) {
    player.clock();
}
