import { defineStore } from 'pinia'
import { pixelToClip } from '@/scripts/utils'

export const useGLStore = defineStore('gl', {
  state: () => ({
    rawCtx: null as WebGL2RenderingContext | null,
    resolution: [0, 0],
    mousePos: [0, 0],
    center: [0, 0],
    zoom: [0],
    zoomFactor: [0.15],
  }),
  getters: {
    ctx(): WebGL2RenderingContext {
      if (!this.rawCtx) {
        throw new Error('WebGL context not available')
      }
      return this.rawCtx
    },
    zoomMult(): number[] {
      return [Math.pow(1 + this.zoomFactor[0], -this.zoom[0])]
    },
  },
  actions: {
    clearCtx(): void {
      this.rawCtx = null
    },
    setCtxFromCanvas(canvas: HTMLCanvasElement): void {
      this.rawCtx = canvas.getContext('webgl2')
      if (this.rawCtx === null) {
        throw new Error('Unable to initialize WebGL context.')
      }
    },
    setResolution(width: number, height: number): void {
      this.resolution = [width, height]
    },
    setMousePos(x: number, y: number): void {
      this.mousePos = pixelToClip(x, y)
    },
  },
})
