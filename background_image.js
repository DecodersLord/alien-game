export default function background_image(file) {
    let img = new Image();
    img.src = "./gameAssets/" + file;
    return img;
}
