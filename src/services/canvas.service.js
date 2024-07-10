import { utilService } from './util.service'

export const LINE = 'line'
export const ELLIPSE = 'ellipse'
export const RECT = 'rect'

export const canvasService = {
  getDefaultPen,
  getNewShape,
  getClickedShape,
  getNewLine,
}

function getDefaultPen() {
  return {
    color: '#000',
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
    width: shape === RECT ? 30 : 20,
    height: 30,
  }
}

function getNewLine(linePositions) {
  return {
    _id: utilService.makeId(),
    type: LINE,
    positions: [...linePositions],
    isDrawing: false,
  }
}

function getClickedShape(shapes, offsetX, offsetY) {
  return shapes.find(shape => {
    const { x, y, width, height } = shape

    const isInXRange = offsetX >= x && offsetX <= x + width
    const isInYRange = offsetY >= y && offsetY <= y + height

    return isInXRange && isInYRange
  })
}
