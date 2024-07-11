import { useState } from 'react'
import { canvasService, ELLIPSE, RECT } from '../services/canvas.service'

export function useDrawingKit(canvasRef, contextRef) {
  const [pen, setPen] = useState(canvasService.getDefaultPen())
  const [shapes, setShapes] = useState([])

  function onDrawShape(shape, x, y) {
    const shapesDrawingMap = {
      line: _processLine,
      rect: _processRect,
      ellipse: _processEllipse,
    }

    // If shape is of type string --> Generate and draw new shape.
    // Else --> Draw existing shape (represented as an object)
    const shapeToDraw =
      typeof shape === 'string'
        ? canvasService.getNewShape(shape, x, y, pen.strokeColor, pen.fillColor)
        : { ...shape }

    contextRef.current.beginPath()
    contextRef.current.strokeStyle = shapeToDraw.strokeColor
    contextRef.current.fillStyle = shapeToDraw.fillColor
    shapesDrawingMap[shapeToDraw.type](shapeToDraw)
    contextRef.current.closePath()

    setPen(prevPen => ({ ...prevPen, isDrawing: false }))
  }

  function drawAllShapes(shapesToRender = shapes) {
    const shapesToDraw = [...shapesToRender]
    // Clearing the shapes state for the functions to fill it when drawing
    setShapes([])
    resetStrokeStyle()
    shapesToDraw.forEach(shape => onDrawShape(shape, shape.x, shape.y))
  }

  function highlightSelectedShape(shape) {
    const { type, angle } = shape
    const highlightDrawingMap = {
      rect: _performRectDraw,
      ellipse: _performEllipseDraw,
    }

    contextRef.current.save()
    contextRef.current.beginPath()
    contextRef.current.setLineDash([8])
    contextRef.current.lineWidth = 4
    contextRef.current.strokeStyle = '#ead940'

    if (angle) _rotateShape(shape)
    else highlightDrawingMap[type](shape, true)

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
    const { positions } = line
    positions.forEach(({ x, y }) => performLineDraw(x, y))
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

  function _rotateShape({ type, x, y, width, height, angle }) {
    contextRef.current.save()

    // Calculating the center point to rotate around
    const verticalCenter = y + height / 2
    const horizontalCenter = x + width / 2

    // Rotating the shape + Translating for around-center rotation
    contextRef.current.translate(horizontalCenter, verticalCenter)
    contextRef.current.rotate((angle * Math.PI) / 180)
    contextRef.current.translate(-horizontalCenter, -verticalCenter)

    if (type === RECT) _performRectDraw(x, y, width, height)
    else if (type === ELLIPSE) _performEllipseDraw(x, y, width, height)

    contextRef.current.restore()
  }

  function performLineDraw(x, y) {
    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
  }

  function _performRectDraw({ x, y, width, height }, isHighlight = false) {
    contextRef.current.strokeRect(x, y, width, height)
    if (!isHighlight) contextRef.current.fillRect(x, y, width, height)
  }

  function _performEllipseDraw({ x, y, width, height }, isHighlight = false) {
    contextRef.current.ellipse(x, y, width, height, 0, 0, 2 * Math.PI)
    contextRef.current.stroke()
    if (!isHighlight) contextRef.current.fill()
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
