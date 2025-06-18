import { defineStore } from 'pinia'

export const useGLStore = defineStore('gl', {
  state: () => ({
    rawCtx: null as WebGL2RenderingContext | null,
    resolution: [0, 0],
    mousePos: null as number[] | null,
    center: [0, 0],
    centerV: [0, 0],
    vMin: 0.01,
    acceleration: 5,
    dampening: 0.1,
    dragging: false,
    zoom: [0],
    zoomFactor: [0.15],
    zoomPinch: 10,
    lastTick: null as Date | null,
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
    tick(): number {
      const lastTick = this.lastTick
      this.lastTick = new Date()
      const delta = lastTick ? (this.lastTick.getTime() - lastTick.getTime()) / 1000 : 0
      this.center[0] += this.centerV[0] * delta
      this.center[1] += this.centerV[1] * delta
      this.centerV[0] *= this.dampening ** delta
      this.centerV[1] *= this.dampening ** delta
      this.centerV[0] =
        Math.abs(this.centerV[0]) < this.vMin * this.zoomMult[0] ? 0 : this.centerV[0]
      this.centerV[1] =
        Math.abs(this.centerV[1]) < this.vMin * this.zoomMult[0] ? 0 : this.centerV[1]
      return delta
    },
  },
})
