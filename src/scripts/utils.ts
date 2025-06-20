import { useGLStore } from '@/stores/gl'
import { useHexStore } from '@/stores/hex'

export function imod(a: number, b: number): number {
  return ((a % b) + b) % b
}

export function nextPowerOfTwo(x: number) {
  let power = 0
  while (true) {
    const value = 1 << power
    if (x <= value) {
      return value
    }
    power += 1
  }
}

export function axialToIndex(q: number, r: number) {
  // Calculate cell index
  const hex = useHexStore()
  return imod(q + r * hex.rStep, hex.cellCount)
}

export function clipToAxial(x: number, y: number) {
  const hex = useHexStore()

  // Calculate cube coordinates
  x /= hex.size[0]
  y /= hex.size[0]
  const qFrac = (x * 3 ** 0.5) / 3 + y / 3
  const rFrac = (-y * 2) / 3
  const sFrac = -qFrac - rFrac
  let q = Math.round(qFrac)
  let r = Math.round(rFrac)
  let s = Math.round(sFrac)

  // Round cube coordinates
  const qDiff = Math.abs(q - qFrac)
  const rDiff = Math.abs(r - rFrac)
  const sDiff = Math.abs(s - sFrac)
  if (qDiff > rDiff && qDiff > sDiff) {
    q = -r - s
  } else if (rDiff > sDiff) {
    r = -q - s
  } else {
    s = -q - r
  }

  return [q, r]
}

export function clipToIndex(x: number, y: number) {
  const [q, r] = clipToAxial(x, y)
  return axialToIndex(q, r)
}

export function inCore(q: number, r: number) {
  const hex = useHexStore()
  const s = Math.abs(q + r)
  q = Math.abs(q)
  r = Math.abs(r)
  return Math.max(q, r, s) < hex.boardSize[0]
}

export function indexToAxial(index: number, boardSize?: number) {
  const hex = useHexStore()
  boardSize = typeof boardSize === 'undefined' ? hex.boardSize[0] : boardSize
  const cellCount = 3 * boardSize ** 2 - 3 * boardSize + 1
  index = index % cellCount
  let q = 0
  let r = 0
  let width = boardSize
  while (true) {
    if (index < width) {
      return [q + index, r]
    }
    index -= width
    if (r > 0) {
      r -= boardSize
    } else {
      r += boardSize - 1
    }
    q = -(boardSize - 1) - Math.min(r, 0)
    width = 2 * boardSize - Math.abs(r) - 1
  }
}

export function pixelToClip(x: number, y: number) {
  const gl = useGLStore()
  const dpi = window.devicePixelRatio
  const minRes = Math.min(...gl.resolution)
  return [
    (gl.zoomMult[0] * (2 * x * dpi - gl.resolution[0])) / minRes + gl.center[0],
    (gl.zoomMult[0] * (gl.resolution[1] - 2 * y * dpi)) / minRes + gl.center[1],
  ]
}

export function pixelToAxial(x: number, y: number) {
  ;[x, y] = pixelToClip(x, y)
  return clipToAxial(x, y)
}

export function pixelToIndex(x: number, y: number) {
  const gl = useGLStore()
  const hex = useHexStore()
  const [q, r] = pixelToAxial(x, y)
  return !gl.dragging && (hex.mirror[0] || inCore(q, r)) ? axialToIndex(q, r) : -1
}

export function getCSSColor(color: string) {
  const colorString = window.getComputedStyle(document.body).getPropertyValue(color).slice(1, 7)
  const colorInt = parseInt(colorString, 16)
  const red = ((colorInt >> 16) & 0xff) / 0xff
  const green = ((colorInt >> 8) & 0xff) / 0xff
  const blue = (colorInt & 0xff) / 0xff
  return [red, green, blue, 1.0]
}

export function syncColors() {
  const hex = useHexStore()
  hex.aliveColor = getCSSColor('--color-foreground-mute')
  hex.borderColor = getCSSColor('--color-border')
  hex.deadColor = getCSSColor('--color-background-mute')
  hex.highlightBorderColor = getCSSColor('--color-border-hover')
  hex.marginColor = getCSSColor('--color-background-soft')
}
