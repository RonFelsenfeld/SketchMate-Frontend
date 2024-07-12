import { useState } from 'react'
import { canvasService, ELLIPSE, RECT } from '../services/canvas.service'
import { useTheme } from './useTheme'

export function useCanvas(canvasRef, contextRef) {
  const [pen, setPen] = useState(canvasService.getDefaultPen())
  const [shapes, setShapes] = useState([])
  const { isDarkMode } = useTheme()

  function onDrawShape(shape, x, y) {
    const shapesDrawingHandlersMap = {
      line: _processLine,
      rect: _processRect,
      ellipse: _processEllipse,
    }

    // If shape is of type string --> Generate and draw new shape.
    // Else --> Draw existing shape (represented as an object)
    let shapeToDraw
    if (typeof shape === 'string') {
      shapeToDraw = canvasService.getNewShape(shape, x, y, pen.strokeColor, pen.fillColor)
    } else {
      shapeToDraw = { ...shape }
    }

    contextRef.current.beginPath()
    contextRef.current.strokeStyle = shapeToDraw.strokeColor
    contextRef.current.fillStyle = shapeToDraw.fillColor
    shapesDrawingHandlersMap[shapeToDraw.type](shapeToDraw)
    contextRef.current.closePath()

    setPen(prevPen => ({ ...prevPen, isDrawing: false }))
  }

  function drawAllShapes(shapesToRender = shapes) {
    resetStrokeStyle()
    shapesToRender.forEach(shape => onDrawShape(shape, shape.x, shape.y))
  }

  function highlightSelectedShape(shape) {
    const { _id, type, angle } = shape
    const highlightDrawingMap = {
      rect: _performRectDraw,
      ellipse: _performEllipseDraw,
    }

    contextRef.current.save()
    contextRef.current.beginPath()
    contextRef.current.setLineDash([8])
    contextRef.current.lineWidth = 4
    contextRef.current.strokeStyle = isDarkMode ? '#4b8fd7' : '#5bc5a7'

    if (angle) _rotateShape(shape, _id)
    else highlightDrawingMap[type](shape, _id)

    contextRef.current.closePath()
    contextRef.current.restore()
  }

  function resetStrokeStyle() {
    contextRef.current.setLineDash([])
    contextRef.current.lineWidth = 1
  }

  function removeShape(shape) {
    const updatedShapes = shapes.filter(s => s._id !== shape._id)
    clearCanvas()
    drawAllShapes(updatedShapes)
  }

  function clearCanvas() {
    const { width, height } = canvasRef.current
    contextRef.current.clearRect(0, 0, width, height)
    setShapes([])
  }

  function _processLine(line) {
    const { positions, strokeColor } = line
    positions.forEach(({ x, y }) => performLineDraw(x, y, strokeColor))
    setShapes(prevShapes => [...prevShapes, line])
  }

  function _processRect(rect) {
    const { angle } = rect

    if (angle) _rotateShape(rect)
    else _performRectDraw(rect)

    setShapes(prevShapes => [...prevShapes, rect])
  }

  function _processEllipse(ellipse) {
    const { angle } = ellipse

    if (angle) _rotateShape(ellipse)
    else _performEllipseDraw(ellipse)

    setShapes(prevShapes => [...prevShapes, ellipse])
  }

  function _rotateShape(shape, selectedShapeId = '') {
    const { type, x, y, width, height, angle } = shape
    contextRef.current.save()

    // Calculating the center point to rotate around
    const verticalCenter = y + height / 2
    const horizontalCenter = x + width / 2

    // Rotating the shape + Translating for around-center rotation
    contextRef.current.translate(horizontalCenter, verticalCenter)
    contextRef.current.rotate((angle * Math.PI) / 180)
    contextRef.current.translate(-horizontalCenter, -verticalCenter)

    if (type === RECT) _performRectDraw(shape, selectedShapeId)
    else if (type === ELLIPSE) _performEllipseDraw(shape, selectedShapeId)

    contextRef.current.restore()
  }

  function performLineDraw(x, y, color = pen.strokeColor) {
    contextRef.current.strokeStyle = color
    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
  }

  // ! if selectedShape is the "drawn" shape, don't fill it with the pen fill color
  function _performRectDraw({ _id, x, y, width, height }, selectedShapeId = '') {
    contextRef.current.strokeRect(x, y, width, height)
    if (_id !== selectedShapeId) {
      contextRef.current.fillRect(x, y, width, height)
    }
  }

  function _performEllipseDraw({ _id, x, y, width, height }, selectedShapeId = '') {
    contextRef.current.ellipse(x, y, width, height, 0, 0, 2 * Math.PI)
    contextRef.current.stroke()
    if (_id !== selectedShapeId) contextRef.current.fill()
  }

  return {
    pen,
    setPen,
    shapes,
    setShapes,
    performLineDraw,
    onDrawShape,
    drawAllShapes,
    highlightSelectedShape,
    resetStrokeStyle,
    removeShape,
    clearCanvas,
  }
}
