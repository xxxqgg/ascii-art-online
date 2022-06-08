const frames = [];
const button = document.querySelector("button");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const display = document.getElementById("display")
var a;
// const asciiChars = " .\'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
const asciiChars = " $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrj "

const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
button.onclick = async (evt) => {
    let gray;
    if (window.MediaStreamTrackProcessor) {
        let stopped = false;
        const video = await getVideoElement()
        let drawingCanvas = document.createElement("canvas")
        let drawingContext = drawingCanvas.getContext("2d")

        let lineCount = 0
        let selectorWidth = 10
        let selectorHeight = 10
        while (isVideoPlaying(video)) {
            drawingContext.drawImage(video, 0, 0)
            let imageData = drawingContext.getImageData(0, 0, video.videoWidth, video.videoHeight)

            // Read
            let x = 0;
            let y = 0;
            let displayString = ""
            while (x < video.videoWidth && y < video.videoHeight) {
                let count = 0
                let blockSum = 0
                let newLine = false
                let originX = x;
                let originY = y;
                for (let i = 0; i < selectorHeight; i++) {
                    for (let j = 0; j < selectorWidth; j++) {
                        count += 1
                        r = imageData.data[(y * video.videoHeight + x) * 4]
                        g = imageData.data[(y * video.videoHeight + x) * 4 + 1]
                        b = imageData.data[(y * video.videoHeight + x) * 4 + 2]
                        gray = r * 0.299 + g * 0.587 + b * 0.114
                        blockSum += gray
                        x += 1
                        if (x >= video.videoWidth) {
                            y += 1
                            x = originX
                            newLine = true
                            break
                        }
                    }
                    if (x === originX) {

                    } else {
                        x -= selectorWidth
                        y += 1
                    }
                    if (y >= video.videoHeight) {
                        break
                    }
                }
                y = originY
                x = originX + selectorWidth
                // console.log(blockSum / count)
                let greyLevel = Math.floor(blockSum / count / 255 * asciiChars.length)
                // if (blockSum === 0) {
                //     console.log(imageData)
                //     a = imageData
                //     return
                // }
                // console.log('test', imageData.data.length)
                displayString += asciiChars[greyLevel]
                if (x >= video.videoWidth) {
                    y += selectorHeight
                    // console.log(y, displayString.split('\n')[y/10-1].length)
                    x = 0
                    displayString += "\n"
                    lineCount += 1
                }
            }
            // console.log("set inner text")
            display.innerText = displayString
            await new Promise(r => setTimeout(r, 1000));
            // return

        }

        button.onclick = (evt) => stopped = true;
        button.textContent = "stop";
    } else {
        console.error("your browser doesn't support this API yet");
    }
};

async function getVideoElement() {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = "https://upload.wikimedia.org/wikipedia/commons/a/a4/BBH_gravitational_lensing_of_gw150914.webm";
    // video.src = "https://ia802905.us.archive.org/19/items/TouhouBadApple/Touhou%20-%20Bad%20Apple.mp4"
    video.hidden = true
    await video.play();
    return video;
}