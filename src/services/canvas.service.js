import axios from 'axios'
import { utilService } from './util.service'

export const LINE = 'line'
export const ELLIPSE = 'ellipse'
export const RECT = 'rect'

const BASE_URL = process.env.NODE_ENV === 'production' ? '/api/shape' : '//localhost:3030/api/shape'

export const canvasService = {
  getDefaultPen,
  getDefaultSettings,
  getNewShape,
  getNewShapeFromServer,
  findClickedShape,
  findHoveredShape,
  getNewLine,
  getDefaultDragInfo,
}

function getDefaultPen() {
  return {
    isDrawing: false,
    shape: LINE,
    width: 1,
    strokeColor: '#000000',
    fillColor: '#ffffff',
  }
}

function getDefaultSettings() {
  return { rotateAngle: 5, sizeDiff: 4 }
}

function getNewShape(shapeData) {
  const { shape, x, y, strokeColor, fillColor, strokeWidth } = shapeData
  return {
    _id: utilService.makeId(),
    type: shape,
    x,
    y,
    width: shape === RECT ? 40 : 30,
    height: 40,
    angle: 0,
    strokeColor,
    fillColor,
    strokeWidth,
  }
}

async function getNewShapeFromServer(shapeDate) {
  const res = await axios.post(BASE_URL, shapeDate)
  return res.data
}

function getNewLine(linePositions, strokeColor, strokeWidth) {
  return {
    _id: utilService.makeId(),
    type: LINE,
    positions: [...linePositions],
    strokeColor,
    strokeWidth,
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

function findHoveredShape(shapes, offsetX, offsetY) {
  return findClickedShape(shapes, offsetX, offsetY)
}

function getDefaultDragInfo() {
  return {
    isDragging: false,
    pos: null,
  }
}
