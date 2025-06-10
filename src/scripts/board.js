import { boardSize, cellCount, mirror, resolution, rStep, size, viewCenter, zoom } from "@/store"

export function observeCanvasResize(canvas) {
    const resizeObserver = new ResizeObserver(onResize(canvas))
    try {
        resizeObserver.observe(canvas, {box: "device-pixel-content-box"})
    } catch (ex) {
        resizeObserver.observe(canvas, {box: "content-box"})
    }
}

export function pixelToIndex(x, y) {
    let q, r
    [q, r] = pixelToAxial(x, y)
    if(!mirror.value && !inCore(q, r)) {
        return null
    }
    return axialToIndex(q, r)
}

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

function pixelToAxial(x, y) {
    // Calculate position in clip space
    const minRes = Math.min(...resolution.value)
    const dpi = window.devicePixelRatio
    x = (2 * x * dpi - resolution.value[0]) / minRes
    y = (resolution.value[1] - 2 * y * dpi) / minRes
    x = x / zoom.value + viewCenter.value[0]
    y = y / zoom.value + viewCenter.value[1]

    // Calculate cube coordinates
    x /= size.value
    y /= size.value
    const qFrac = x * 3**0.5 / 3 + y / 3
    const rFrac = -y * 2 / 3
    const sFrac = -qFrac - rFrac
    let q = Math.round(qFrac)
    let r = Math.round(rFrac)
    let s = Math.round(sFrac)

    // Round cube coordinates
    const qDiff = Math.abs(q - qFrac)
    const rDiff = Math.abs(r - rFrac)
    const sDiff = Math.abs(s - sFrac)
    if(qDiff > rDiff && qDiff > sDiff) {
        q = -r - s
    } else if(rDiff > sDiff) {
        r = -q - s
    } else {
        s = -q - r
    }

    console.log({q, r, s})
    return [q, r]
}

function inCore(q, r) {
    const s = Math.abs(q + r)
    q = Math.abs(q)
    r = Math.abs(r)
    return Math.max(q, r, s) < boardSize.value
}

function axialToIndex(q, r) {
    // Calculate cell index
    return (q + r * rStep.value).mod(cellCount.value)
}
