let gameOverElement = document.getElementById("game-over");

export default function gameOver(
    stopGeneratingAliens,
    alienArray,
    scoreElement
) {
    stopGeneratingAliens();
    alienArray = [];
    scoreElement.innerText = `You could only run ${score}m away.`;
    gameOverElement.style.display = "block";
}
