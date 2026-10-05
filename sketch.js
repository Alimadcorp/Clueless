let mouse, mouseSpeed = 0.2, mouseSize = 15, tMouseSize = 15;

function setup() {
    createCanvas(windowWidth, windowHeight);
    mouse = { x: mouseX, y: mouseY };
}

function lerp(p0, p1, t) {
    return (1 - t) * p0 + t * p1;
}

function draw() {
    mouse = { x: lerp(mouse.x, mouseX, mouseSpeed), y: lerp(mouse.y, mouseY, mouseSpeed) };
    mouseSize = lerp(mouseSize, tMouseSize, mouseSpeed * 2);
    background(20);
    rect(100, 100, 100, 100);
    if (mouse.x > 100 && mouse.x < 200 && mouse.y > 100 && mouse.y < 200) tMouseSize = 30; else tMouseSize = 15;
    blendMode(DIFFERENCE);
    circle(mouse.x, mouse.y, mouseSize);
    blendMode(NORMAL);
}