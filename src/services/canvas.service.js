import { utilService } from './util.service'

export const LINE = 'line'
export const ELLIPSE = 'ellipse'
export const RECT = 'rect'

export const ROTATE_ANGLE = 5

const CANVAS_KEY = 'canvasDB'

export const canvasService = {
  getCanvas,
  saveCanvas,
  getDefaultPen,
  getNewShape,
  findClickedShape,
  getNewLine,
  getDefaultDragInfo,
}

function getCanvas() {
  const shapes = utilService.loadFromStorage(CANVAS_KEY)
  return shapes || []
}

function saveCanvas(shapes) {
  utilService.saveToStorage(CANVAS_KEY, shapes)
}

////////////////////////////////////////////////////

function getDefaultPen() {
  return {
    strokeColor: '#000000',
    fillColor: '#000000',
    shape: LINE,
    linePositions: [],
    isDrawing: false,
  }
}

function getNewShape(shape, x, y) {
  return {
    _id: utilService.makeId(),
    type: shape,
    x,
    y,
    width: shape === RECT ? 40 : 30,
    height: 40,
    angle: 0,
  }
}

function getNewLine(linePositions, strokeColor) {
  return {
    _id: utilService.makeId(),
    type: LINE,
    positions: [...linePositions],
    strokeColor,
  }
}

function findClickedShape(shapes, offsetX, offsetY) {
  return shapes.find(shape => {
    const { x, y, width, height } = shape

    const isInXRange = offsetX >= x && offsetX <= x + width
    const isInYRange = offsetY >= y && offsetY <= y + height

    return isInXRange && isInYRange
  })
}

function getDefaultDragInfo() {
  return {
    isDragging: false,
    pos: null,
  }
}

// Calculating new coords after rotate
function rotatePoint(cx, cy, x, y, angle) {
  const radians = (Math.PI / 180) * angle

  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  const nx = cos * (x - cx) - sin * (y - cy) + cx
  const ny = sin * (x - cx) + cos * (y - cy) + cy

  return { x: nx, y: ny }
}
