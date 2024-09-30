export default function aliensColliding(player, alien) {
    // Create copies of player and alien to avoid modifying originals
    const playerCopy = { ...player };
    const alienCopy = { ...alien };

    // Adjust sizes to account for the sprite frames and potential offsets
    playerCopy.size = playerCopy.frameWidth + playerCopy.frameHeight - 150;
    alienCopy.size =
        alienCopy.frameWidthAlien + alienCopy.frameHeightAlien - 150;

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
