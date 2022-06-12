var a;
// const asciiChars = " .\'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
// const asciiChars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrj "
// const asciiChars = " .:-=+*#%@"
const asciiChars = "@%#*+=-:."
let blockSum, count
const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);

async function getVideoElement() {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = "https://upload.wikimedia.org/wikipedia/commons/a/a4/BBH_gravitational_lensing_of_gw150914.webm";
    // video.src = "https://ia802905.us.archive.org/19/items/TouhouBadApple/Touhou%20-%20Bad%20Apple.mp4"
    video.hidden = true
    await video.play();
    return video;
}

window.onload = async () => {
    let img = getImage()
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
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
        let s = new Set()
        while (x < video.videoWidth && y < video.videoHeight) {

            count = 0
            blockSum = 0
            a = imageData
            for (let i = 0; i < selectorHeight; i++) {
                for (let j = 0; j < selectorWidth; j++) {
                    count += 1
                    // r = imageData.data[((y + i) * video.videoHeight + (x + j)) * 4]
                    // g = imageData.data[((y + i) * video.videoHeight + (x + j)) * 4 + 1]
                    // b = imageData.data[((y + i) * video.videoHeight + (x + j)) * 4 + 2]
                    s.add((x + j).toString() + "," + (y + i).toString())
                    // x+j = 0, y+i = 1,
                    // console.log(x + j, y + i, b)
                    r = imageData.data[((x + j) + video.videoWidth * (y + i)) * 4]
                    g = imageData.data[((x + j) + video.videoWidth * (y + i)) * 4 + 1]
                    b = imageData.data[((x + j) + video.videoWidth * (y + i)) * 4 + 2]
                    // s.add(((y + i) * video.videoHeight + (x + j)) * 4)
                    // s.add(((y + i) * video.videoHeight + (x + j)) * 4 + 1)
                    // s.add(((y + i) * video.videoHeight + (x + j)) * 4 + 2)
                    let gray = r * 0.299 + g * 0.587 + b * 0.114

                    blockSum += gray
                }
            }
            // return

            let greyLevel = Math.floor(blockSum / count / 256 * asciiChars.length)
            displayString += asciiChars[greyLevel] + ' '

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
        for (let i = 0; i < 1920; i++) {
            for (let j = 0; j < 1080; j++) {
                if (!s.has(i.toString() + "," + j.toString())) {
                    console.log(i, j)
                }
            }
        }
        let p = document.getElementById("display")
        p.innerText = displayString
    }

    console.log("done")
}

function getImage() {
    const img = document.createElement('img')
    img.src = './imgs/img1.png'
    img.hidden = false
    document.body.append(img)

    return img
}

