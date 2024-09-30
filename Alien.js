export default class Alien {
    constructor(
        x,
        y,
        size,
        numColumnsAlien,
        numRowsAlien,
        row,
        column,
        currentFrame,
        alienImg
    ) {
        this.x = x;
        this.y = y;
        this.size = size;

        this.numColumnsAlien = numColumnsAlien;
        this.numRowsAlien = numRowsAlien;

        this.alienImg = alienImg;
        this.frameWidthAlien = this.alienImg.width / numColumnsAlien;
        this.frameHeightAlien = this.alienImg.height / numRowsAlien;
        this.row = row;
        this.column = column;
        this.currentFrame = currentFrame;

        this.jumpHeight = 80;

        this.shouldJump = false;
        this.jumpCounter = 0;
    }
}
