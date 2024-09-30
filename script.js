import background_image from "./background_image.js";
import Player from "./player.js";
import runningAlien from "./RunningAlien.js";
import fightingAlien from "./FightingAlien.js";
import aliensColliding from "./checkCollision.js";
import gameOver from "./gameOver.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let playerImg;
let alienImg;
let bgImg = background_image("background.png");
let scoreElement = document.getElementById("score-para");
let gameOverElement = document.getElementById("game-over");

let numColumns;
let numRows;
let currentFrame;

let runnerGameStarted;
let fightingGameStarted;

//alien Spritesheet animation
let numColumnsAlien;
let numRowsAlien;
let frameWidthAlien;
let frameHeightAlien;

let presetTimeValue;

let score = 0;

let player;
let alienArray = [];
let alien;

let alienGeneratingTimeout;
let alienSpacingTimeout;

let timeDelay = randomNumberInterval(presetTimeValue);
//Audio Files

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNumberInterval(timeInterval) {
    let returnTime = timeInterval;

    if (Math.random() < 0.5) {
        returnTime += getRandomNumber(
            presetTimeValue / 3,
            presetTimeValue * 1.5
        );
    } else {
        returnTime += getRandomNumber(presetTimeValue / 3, presetTimeValue / 2);
    }

    return returnTime;
}

function generateAliens() {
    alien = new runningAlien(
        2050,
        700,
        300,
        numColumnsAlien,
        numRowsAlien,
        0,
        0,
        0,
        alienImg
    );
    alienArray.push(alien);
}
function generateAliensWithSpacing() {
    generateAliens();
    timeDelay = randomNumberInterval(presetTimeValue);
    alienSpacingTimeout = setTimeout(generateAliensWithSpacing, timeDelay);
}
function startGeneratingAliens() {
    if (runnerGameStarted) {
        let initialTimeDelay = randomNumberInterval(presetTimeValue);
        alienGeneratingTimeout = setTimeout(
            generateAliensWithSpacing(),
            initialTimeDelay
        );
    }
}
function stopGeneratingAliens() {
    clearTimeout(alienSpacingTimeout);
    clearTimeout(alienGeneratingTimeout);
}

function drawBackground() {
    ctx.drawImage(bgImg, 0, 0, 1920, 1080);
}

const PlayerState = {
    idle: "idle",
    walk: "walk",
    attack: "attack",
    dead: "dead",
};

function drawScore() {
    const scoreText = "Score: " + score;
    ctx.font = "26px 'Pixelify Sans'"; // Set font size and family
    ctx.fillStyle = "lightslategray"; // Set background color
    const textWidth = ctx.measureText(scoreText).width;
    const padding = 10;
    const rectX = canvas.width - textWidth - padding * 2 - 100;
    const rectY = 150;
    const rectWidth = textWidth + padding * 10;
    const rectHeight = 50;

    // Draw the rectangle
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
    ctx.strokeStyle = "greenyellow";
    ctx.lineWidth = 2;
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

    // Draw the score text
    ctx.fillStyle = "rgb(211, 52, 52)"; // Set text color
    ctx.fillText(scoreText, rectX + padding + 10, rectY + 30);
}

function animateRun() {
    //requestAnimationFrame(animate);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    //drawBackgroundLine();
    currentFrame++;

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    player.draw(ctx, currentFrame);
    drawScore();
    alienArray.forEach((alien, index) => {
        alien.slide(ctx, currentFrame, 80);

        if (aliensColliding(player, alien)) {
            runnerGameStarted = false;
            gameOver(stopGeneratingAliens, alienArray, scoreElement);
        }

        if (alien.x + alien.size <= 0) {
            setTimeout(() => {
                alienArray.splice(index, 1);
                score++;
            }, 0);
        }
    });
}

function animateFight() {
    //requestAnimationFrame(animateFight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    player.draw(ctx);
    //alien.draw();
    if (alien.y < 300) {
        alien.decent();
    } else {
        alien.draw();
    }
}

setInterval(() => {
    if (runnerGameStarted) {
        animateRun();
    }
    if (fightingGameStarted) {
        animateFight();
    }
}, 100);

addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (!player.shouldJump) {
            player.jumpCounter = 0;
            player.shouldJump = true;
            player.jump();
        }
    }
});

function SetupRunning() {
    playerImg = document.getElementById("player_Run");
    alienImg = document.getElementById("alienRun");
    //sprite Animation
    currentFrame = 0;
    player = new Player(50, 650, 350, 10, 1, 0, 0, 0, playerImg);

    //alien Spritesheet animation
    numColumnsAlien = 3;
    numRowsAlien = 3;
    frameWidthAlien = alienImg.width / numColumnsAlien;
    frameHeightAlien = alienImg.height / numRowsAlien;

    presetTimeValue = 1000;
    score = 0;
    timeDelay = randomNumberInterval(presetTimeValue);
    alienArray = [];
    runnerGameStarted = true;
    startGeneratingAliens();
}

function setupFight() {
    playerImg = document.getElementById("player_Idle");
    alienImg = document.getElementById("idle_alien");

    //alien Spritesheet animation
    numColumnsAlien = 3;
    numRowsAlien = 3;
    frameWidthAlien = alienImg.width / numColumnsAlien;
    frameHeightAlien = alienImg.height / numRowsAlien;
    alien = new fightingAlien(650, 150, 800, "red");

    numColumns = 6;
    numRows = 1;
    frameWidth = playerImg.width / numColumns;
    frameHeight = playerImg.height / numRows;
    row = 0;
    column = 0;
    currentFrame = 0;
    player = new Player(50, 650, 350, "red");

    //alien.decent();

    fightingGameStarted = true;
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("#choice-button > button");
    const overlayDiv = document.getElementById("overlay-div");

    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            overlayDiv.style.display = "none";
            if (button.textContent === "Run") {
                setTimeout(() => {
                    gameOverElement.style.display = "none";
                    SetupRunning();
                }, 200);
            } else if (button.textContent === "fight") {
                setTimeout(() => {
                    gameOverElement.style.display = "none";
                    setupFight();
                }, 200);
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let bgAudio = new Audio("./gameAssets/gameBg.mp3");
    bgAudio.loop = true; // Enable looping

    // Attempt to play the audio
    bgAudio.play().catch((error) => {
        console.log("Autoplay was prevented. Click to play the audio.");
        // Add a click event listener to play the audio when the user interacts with the page
        document.addEventListener(
            "click",
            function () {
                bgAudio.play();
            },
            { once: true }
        ); // Ensure the event listener is only triggered once
    });
});
