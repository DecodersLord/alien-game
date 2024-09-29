const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let playerImg = document.getElementById("player");
let alienImg = document.getElementById("alien");
let bgImg = document.getElementById("background");
let gameOverElement = document.getElementById("game-over");
let scoreElement = document.getElementById("score-para");

let numColumns;
let numRows;
let frameWidth;
let frameHeight;
let row;
let column;
let currentFrame;

let gameStarted;

//alien Spritesheet animation
let numColumnsAlien;
let numRowsAlien;
let frameWidthAlien;
let frameHeightAlien;

let presetTimeValue;

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

function drawBackground() {
    ctx.drawImage(bgImg, 0, 0, 1920, 1080);
}

class Player {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;

        this.jumpHeight = 80;

        this.shouldJump = false;
        this.jumpCounter = 0;
    }

    jump() {
        if (this.shouldJump) {
            this.jumpCounter++;

            if (this.jumpCounter < 6) {
                this.y -= this.jumpHeight;
            } else if (this.jumpCounter > 6 && this.jumpCounter < 8) {
                this.y += 0;
            } else if (this.jumpCounter < 12) {
                this.y += this.jumpHeight;
            }

            if (this.jumpCounter >= 12) {
                this.shouldJump = false;
            }
        }
    }

    draw() {
        // Update rows and columns
        let column = currentFrame % numColumns;
        let row = Math.floor(currentFrame / numColumns);
        this.jump();
        ctx.drawImage(
            playerImg,
            column * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            350,
            350
        );
        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Alien {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;

        this.speed = 50;

        this.shouldJump = false;
        this.jumpCounter = 0;
    }

    draw() {
        // Make the frames loop
        let maxFrame = numColumnsAlien * numRowsAlien - 2;
        if (currentFrame > maxFrame) {
            currentFrame = 0;
        }

        // Update rows and columns
        let column = currentFrame % numColumnsAlien;
        let row = Math.floor(currentFrame / numColumnsAlien);
        //this.jump();
        ctx.drawImage(
            alienImg,
            column * frameHeightAlien,
            row * frameHeightAlien,
            frameWidthAlien,
            frameHeightAlien,
            this.x,
            this.y,
            300,
            300
        );

        //ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    slide() {
        this.draw();
        this.x -= this.speed;
    }
}

let player = new Player(50, 650, 350, "red");
let alienArray = [];
let alien;

function generateAliens() {
    alien = new Alien(2050, 700, 300, "red");
    alienArray.push(alien);
}

function aliensColliding(player, alien) {
    // Create copies of player and alien to avoid modifying originals
    const playerCopy = { ...player };
    const alienCopy = { ...alien };

    // Adjust sizes to account for the sprite frames and potential offsets
    playerCopy.size = frameWidth + frameHeight - 150;
    alienCopy.size = frameWidthAlien + frameHeightAlien - 150;

    // Calculate bounding box corners for each object
    const playerLeft = playerCopy.x;
    const playerRight = playerCopy.x + playerCopy.size;
    const playerTop = playerCopy.y;
    const playerBottom = playerCopy.y + playerCopy.size;

    const alienLeft = alienCopy.x;
    const alienRight = alienCopy.x + alienCopy.size;
    const alienTop = alienCopy.y;
    const alienBottom = alienCopy.y + alienCopy.size;

    // Check for collision using bounding box intersection
    const isColliding = !(
        playerRight < alienLeft ||
        playerLeft > alienRight ||
        playerBottom < alienTop ||
        playerTop > alienBottom
    );

    // Check if the collision happens from above the alien
    const isCollisionFromAbove =
        playerBottom > alienTop && playerTop < alienTop;

    if (isColliding && isCollisionFromAbove) {
        return isColliding;
    }
}

let timeDelay = randomNumberInterval(presetTimeValue);

function generateAliensWithSpacing() {
    generateAliens();
    timeDelay = randomNumberInterval(presetTimeValue);
    setTimeout(generateAliensWithSpacing, timeDelay);
}

// Start generating aliens with initial delay
setTimeout(generateAliensWithSpacing, timeDelay);

let score = 0;

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

function gameOver() {
    alienArray = [];
    scoreElement.innerText = `You could only run ${score}m away.`;
    gameOverElement.style.display = "block";
}

function animate() {
    //requestAnimationFrame(animate);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    //drawBackgroundLine();
    currentFrame++;

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    player.draw();
    drawScore();
    alienArray.forEach((alien, index) => {
        alien.slide();

        if (aliensColliding(player, alien)) {
            gameStarted = false;
            gameOver();
        }

        if (alien.x + alien.size <= 0) {
            setTimeout(() => {
                alienArray.splice(index, 1);
                score++;
            }, 0);
        }
    });
}

setInterval(() => {
    if (gameStarted) {
        animate();
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
    //sprite Animation
    numColumns = 10;
    numRows = 1;
    frameWidth = playerImg.width / numColumns;
    frameHeight = playerImg.height / numRows;
    row = 0;
    column = 0;
    currentFrame = 0;

    gameStarted = true;

    //alien Spritesheet animation
    numColumnsAlien = 3;
    numRowsAlien = 3;
    frameWidthAlien = alienImg.width / numColumnsAlien;
    frameHeightAlien = alienImg.height / numRowsAlien;

    presetTimeValue = 1000;
    score = 0;
    alienArray = [];
    gameStarted = true;
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("#choice-button > button");
    const overlayDiv = document.getElementById("overlay-div");

    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            overlayDiv.style.display = "none";
            setTimeout(() => {
                gameOverElement.style.display = "none";
                SetupRunning();
            }, 200);
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
