let mouse, mouseSpeed = 0.2, mouseSize = 15, tMouseSize = 15, font, player;
let playmode = false;

async function setup() {
    createCanvas(windowWidth, windowHeight);
    fill(255); noStroke(); textAlign(CENTER);
    background(0);
    textSize(50);
    text("Loading...", width / 2, height / 2);
    font = await loadFont('font.ttf');
    textFont(font);
    mouse = { x: mouseX, y: mouseY };
    player = new Player();
}

function lerp(p0, p1, t) { return (1 - t) * p0 + t * p1; }

function draw() {
    // processing
    mouse = { x: lerp(mouse.x, mouseX, mouseSpeed), y: lerp(mouse.y, mouseY, mouseSpeed) };
    mouseSize = lerp(mouseSize, tMouseSize, mouseSpeed * 2); background(0);
    if (mouse.x > 100 && mouse.x < 200 && mouse.y > 100 && mouse.y < 200) tMouseSize = 30; else tMouseSize = 15;
    if(playmode) {
      tMouseSize = 0;
    }

    // object operations
    player.update();
    player.draw();

    // compositing
    blendMode(DIFFERENCE);
    circle(mouse.x, mouse.y, mouseSize);
    blendMode(BLEND);
}

class Player {
    constructor() {
        this.size = 10;
        this.vx = this.vy = this.ax = this.ay = 0;
        this.x = width / 2; this.y = height / 2;
        this.ax = 0.2;
        this.dir = 0;
    }

    draw() {
        fill(255); noStroke();
        rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    update() {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
    }

    clock() {
        if(!playmode) playmode = true;
        let t = this.vx * 0.9;
        this.vx = -this.vy * 0.9;
        this.vy = t;
        this.dir = (this.dir + 1) % 4;
        switch(this.dir) {
          case 0:
            this.ax = 0.2; this.ay = 0; break;
          case 1: 
            this.ax = 0; this.ay = 0.2; break;
          case 2:
            this.ax = -0.2; this.ay = 0; break;
          case 3:
            this.ax = 0; this.ay = -0.2; break;
        }
    }
}
function keyPressed() {
    player.clock();
}

function mousePressed(e) {
    player.clock();
}
