let playerShip;
let playerShipRotation = 0; // Variable to store rotation for playerShip
const debug = false;
let gameManager;
//sounds
let engineSound;
let explosionSound;
let saucerSound;
let jumpSound;
let shootSound;
//images
let keyA;
let keyD;
let keyW;
let keyS;
let keySpace;

function preload() {
    explosionSound = loadSound("Audio/kenney/Explosion.mp3");
    saucerSound = loadSound("Audio/kenney/Saucer.mp3");
    shootSound = loadSound("Audio/kenney/ShootSound.mp3");
    engineSound = loadSound("Audio/kenney/EngineSound.mp3");
    jumpSound = loadSound("Audio/kenney/JumpSound.mp3");
    //images
    keyA = loadImage("Assets/keyboard_a.png");
    keyD = loadImage("Assets/keyboard_d.png");
    keyW = loadImage("Assets/keyboard_w.png");
    keyS = loadImage("Assets/keyboard_s.png");
    keySpace = loadImage("Assets/keyboard_space.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    gameManager = new GameManager({
        explosionSound,
        saucerSound,
        shootSound,
        engineSound,
        jumpSound,
        keyA,
        keyD,
        keyW,
        keyS,
        keySpace,
    });
    gameManager.setup();
}

function draw() {
    background(220);
    gameManager.draw();
    gameManager.update();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
