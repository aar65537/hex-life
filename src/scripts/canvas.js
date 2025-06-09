import { resolution } from "@/store"

function onResize (canvas) {
    return (entries) => {
        entries.forEach((entry) => {
            let width
            let height
            let dpr = window.devicePixelRatio
            if (entry.devicePixelContentBoxSize) {
                width = entry.devicePixelContentBoxSize[0].inlineSize
                height = entry.devicePixelContentBoxSize[0].blockSize
                dpr = 1
            } else if (entry.contentBoxSize) {
                if (entry.contentBoxSize[0]) {
                    width =  entry.contentBoxSize[0].inlineSize
                    height = entry.contentBoxSize[0].blockSize
                } else {
                    width = entry.contentBoxSize.inlineSize
                    height = entry.contentBoxSize.blockSize
                }
            } else if (entry.contentRect) {
                width = entry.contentRect.width
                height = entry.contentRect.height
            } else {
                alert("Can not dynamically determine resolution.")
                return
            }

            const displayWidth = Math.round(width * dpr)
            const displayHeight = Math.round(height * dpr)
            canvas.width = displayWidth
            canvas.height = displayHeight
            resolution.value[0] = displayWidth
            resolution.value[1] = displayHeight
        })
    }
}

export function observeCanvasResize(canvas) {
    const resizeObserver = new ResizeObserver(onResize(canvas))
    try {
        resizeObserver.observe(canvas, {box: "device-pixel-content-box"})
    } catch (ex) {
        resizeObserver.observe(canvas, {box: "content-box"})
    }
}
