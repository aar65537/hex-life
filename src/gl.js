import { src as vSrc } from "./shaders/vertex"

function loadShader (ctx, type, src) {
    const shader = ctx.createShader(type)

    ctx.shaderSource(shader, src)
    ctx.compileShader(shader)

    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${ctx.getShaderInfoLog(shader)}`)
        ctx.deleteShader(shader)
        return null
    }

    return shader
}

function initProgram(ctx, fSrc) {
    const vShader = loadShader(ctx, ctx.VERTEX_SHADER, vSrc)
    const fShader = loadShader(ctx, ctx.FRAGMENT_SHADER, fSrc)
    const program = ctx.createProgram()

    ctx.attachShader(program, vShader)
    ctx.attachShader(program, fShader)
    ctx.linkProgram(program)

    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
        alert(`An error occurred linking the shaders: ${ctx.getProgramInfoLog(program)}`)
        ctx.deleteProgram(program)
        return null
     }

     return program
}

function initBuffers(ctx) {
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
    const positionBuffer = ctx.createBuffer()

    ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer)
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(positions), ctx.STATIC_DRAW)

    return {
        position: positionBuffer
    }
}

function setPositionAttribute(ctx, programInfo, buffers) {
    const numComponents = 2
    const type = ctx.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.position)
    ctx.vertexAttribPointer(programInfo.attributeLocations.vertexPosition, numComponents, type, normalize, stride, offset)
    ctx.enableVertexAttribArray(programInfo.attributeLocations.vertexPosition)
}

function setResolutionUniform (ctx, programInfo, resolution) {
    ctx.uniform2f(programInfo.uniformLocations.resolution, resolution.width, resolution.height)
}

function draw(ctx, programInfo, buffers, resolution) {
    const offset = 0
    const vertexCount = 4
    ctx.viewport(0, 0, resolution.width, resolution.height)
    ctx.clear(ctx.COLOR_BUFFER_BIT)
    ctx.useProgram(programInfo.program)
    setPositionAttribute(ctx, programInfo, buffers)
    setResolutionUniform(ctx, programInfo, resolution)
    ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, vertexCount)
}

function onResize (canvas, resolution) {
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
            resolution.width = displayWidth
            resolution.height = displayHeight
        })
    }
}

function observeCanvasResize(canvas, resolution) {
    const resizeObserver = new ResizeObserver(onResize(canvas, resolution))
    try {
        resizeObserver.observe(canvas, {box: "device-pixel-content-box"})
    } catch (ex) {
        resizeObserver.observe(canvas, {box: "content-box"})
    }
}

export {
    draw,
    initProgram,
    initBuffers,
    observeCanvasResize,
}