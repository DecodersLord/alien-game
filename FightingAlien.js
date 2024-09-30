import Alien from "./Alien.js";

export default class fightingAlien extends Alien {
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
        super(
            x,
            y,
            size,
            numColumnsAlien,
            numRowsAlien,
            row,
            column,
            currentFrame,
            alienImg
        );
    }
    draw(ctx, currentFrame) {
        console.log(this.frameWidth, this.frameHeight);

        let totalFrames = this.numColumnsAlien * this.numRowsAlien - 2;

        currentFrame = currentFrame % totalFrames;

        // Update rows and columns
        let column = currentFrame % this.numColumnsAlien;
        let row = Math.floor(currentFrame / this.numColumnsAlien);
        //this.jump();
        ctx.drawImage(
            this.alienImg,
            column * this.frameHeightAlien,
            row * this.frameHeightAlien,
            this.frameWidthAlien,
            this.frameHeightAlien,
            this.x,
            this.y,
            this.size,
            this.size
        );

        //ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    decent(ctx, currentFrame) {
        this.draw(ctx, currentFrame);
        this.y += 100;
    }
}
