let mouse, mouseSpeed = 0.2, mouseSize = 15, tMouseSize = 15, font, player;

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

    // object operations
    player.update();
    player.draw();

    // compositing
    blendMode(DIFFERENCE);
    circle(mouse.x, mouse.y, mouseSize);
    blendMode(NORMAL);
}

class Player {
    constructor() {
        this.size = 10;
        this.vx = this.vy = this.ax = this.ay = 0;
        this.x = width / 2; this.y = height / 2;
        this.ax = 0.2;
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

    click() {
        this.vx = this.vy = 0;
    }
}
function keyPressed() {
    player.click();
}

function mousePressed(e) {
    player.click();
}