import Alien from "./Alien.js";

export default class fightingAlien extends Alien {
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
            500,
            500
        );

        //ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    decent() {
        this.draw();
        this.y += 100;
    }
}
