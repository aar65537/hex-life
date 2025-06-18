import { useGLStore } from '@/stores/gl'

export function startResizeObserver(canvas: HTMLCanvasElement) {
  const gl = useGLStore()
  const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      let width: number
      let height: number
      let dpr = window.devicePixelRatio
      if (entry.devicePixelContentBoxSize) {
        width = entry.devicePixelContentBoxSize[0].inlineSize
        height = entry.devicePixelContentBoxSize[0].blockSize
        dpr = 1
      } else if (entry.contentBoxSize) {
        width = entry.contentBoxSize[0].inlineSize
        height = entry.contentBoxSize[0].blockSize
      } else if (entry.contentRect) {
        width = entry.contentRect.width
        height = entry.contentRect.height
      } else {
        alert('Can not dynamically determine resolution.')
        return
      }
      width = Math.round(width * dpr)
      height = Math.round(height * dpr)
      canvas.width = width
      canvas.height = height
      gl.resolution = [width, height]
    })
  })
  try {
    resizeObserver.observe(canvas, { box: 'device-pixel-content-box' })
  } catch {
    resizeObserver.observe(canvas, { box: 'content-box' })
  }
  return resizeObserver
}
