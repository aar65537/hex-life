import { defineStore } from 'pinia'
import { axialToIndex, clipToAxial, inCore } from '@/scripts/utils'
import { useGLStore } from '@/stores/gl'
import type { Game } from '@/scripts/game'

export const useHexStore = defineStore('hex', {
  state: () => ({
    boardSize: [10],
    rules: [1 << 2, 1 << 9],
    border: [0.004],
    margin: [0.0],
    mirror: [0],
    size: [0.075],
    wrap: [1],
    zoomFail: [6],
    aliveColor: [0.9, 0.95, 0.85, 1],
    borderColor: [0.075, 0.115, 0.25, 1],
    deadColor: [0.1, 0.2, 0.35, 1],
    highlightBorderColor: [1.0, 0.8, 0.4, 1],
    marginColor: [0.075, 0.115, 0.25, 1],
    fps: [90],
    sps: [3],
    drawing: true,
    drawID: null as number | null,
    stepping: false,
    stepID: null as number | null,
    deltaPixels: 10,
  }),
  getters: {
    activeCell(): number[] {
      const gl = useGLStore()
      const [q, r] = clipToAxial(gl.mousePos[0], gl.mousePos[1])
      return this.mirror[0] || inCore(q, r) ? [axialToIndex(q, r)] : [-1]
    },
    cellCount(): number {
      return 3 * this.boardSize[0] ** 2 - 3 * this.boardSize[0] + 1
    },
    drawDot(): number[] {
      const gl = useGLStore()
      return [Number(gl.zoom[0] > -this.zoomFail[0])]
    },
    rStep(): number {
      return -3 * this.boardSize[0] + 2
    },
    ruleSet(): number[] {
      return [this.rules.reduce((ruleSet, a) => ruleSet | a, 0)]
    },
  },
  actions: {
    enforceDrawing(game: Game, state?: boolean): void {
      if (state !== undefined) {
        this.drawing = state
      }
      if (this.drawing && this.drawID === null) {
        this.drawID = window.setInterval(() => game.draw(), 1000.0 / this.fps[0])
      } else if (!this.drawing && this.drawID !== null) {
        clearInterval(this.drawID)
        this.drawID = null
      }
    },
    enforceStepping(game: Game, state?: boolean): void {
      if (state !== undefined) {
        this.stepping = state
      }
      if (this.stepping && this.stepID === null) {
        this.stepID = window.setInterval(() => game.step(), 1000.0 / this.sps[0])
      } else if (!this.stepping && this.stepID !== null) {
        clearInterval(this.stepID)
        this.stepID = null
      }
    },
  },
})
