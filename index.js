// const asciiChars = ".\'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
// const asciiChars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'."
// const asciiChars = ".:-=+*#%@"
const asciiChars = "@%#*+=-:."
let blockSum, count

async function readSingleFile(e) {
    let file = e.target.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = async function (e) {
        let contents = e.target.result;
        let img= document.createElement('img')
        img.hidden = true
        img.src = contents
        console.log(contents)
        await onloadHandle(img)
    };
    reader.readAsDataURL(file)
}

window.onload = () => {
    document.getElementById('file-input').addEventListener('change', readSingleFile, false);
}

async function onloadHandle(img) {
    let c = document.getElementById("canvas");
    c.hidden = true

    let ctx = c.getContext("2d");
    img.onload = async () => {
        await ctx.drawImage(img, 0, 0);
        let video = {videoWidth: 1920, videoHeight: 1080}
        let imageData = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight)
        let selectorHeight = 10
        let selectorWidth = 10
        let displayString = '';
        let x = 0
        let y = 0
        let r, g, b
        while (x < video.videoWidth && y < video.videoHeight) {
            count = 0
            blockSum = 0
            a = imageData
            for (let i = 0; i < selectorHeight; i++) {
                for (let j = 0; j < selectorWidth; j++) {
                    count += 1
                    r = imageData.data[((x + j) + video.videoWidth * (y + i)) * 4]
                    g = imageData.data[((x + j) + video.videoWidth * (y + i)) * 4 + 1]
                    b = imageData.data[((x + j) + video.videoWidth * (y + i)) * 4 + 2]
                    let gray = r * 0.299 + g * 0.587 + b * 0.114

                    blockSum += gray
                }
            }

            let greyLevel = Math.floor(blockSum / count / 256 * asciiChars.length)
            displayString += asciiChars[greyLevel] + ''

            x += selectorWidth
            if (x >= video.videoWidth) {
                console.log(x)
                // x = 0, y= 10
                y += selectorHeight
                // console.log(y, displayString.split('\n')[y/10-1].length)
                x = 0
                displayString += "\n"
            }

            if (y >= video.videoHeight) {
                break
            }
        }
        let p = document.getElementById("display")
        p.innerText = displayString
    }

}

