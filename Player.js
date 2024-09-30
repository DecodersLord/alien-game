export default class Player {
    constructor(
        x,
        y,
        size,
        numColumns,
        numRows,
        row,
        column,
        currentFrame,
        playerImg
    ) {
        this.x = x;
        this.y = y;
        this.size = size;

        this.numColumns = numColumns;
        this.numRows = numRows;

        this.playerImg = playerImg;
        this.frameWidth = this.playerImg.width / numColumns;
        this.frameHeight = this.playerImg.height / numRows;
        this.row = row;
        this.column = column;
        this.currentFrame = currentFrame;

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

    draw(ctx, currentFrame) {
        // Update rows and columns

        let totalFrames = this.numColumns * this.numRows;

        currentFrame = currentFrame % totalFrames;

        let column = currentFrame % this.numColumns;
        let row = Math.floor(currentFrame / this.numColumns);
        this.jump();
        ctx.drawImage(
            this.playerImg,
            column * this.frameWidth,
            row * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            this.x,
            this.y,
            this.size,
            this.size
        );
        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}
