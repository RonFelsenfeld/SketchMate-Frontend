import { useState } from 'react'
import { canvasService, ELLIPSE, RECT } from '../services/canvas.service'

export function useDrawingKit(canvasRef, contextRef) {
  const [pen, setPen] = useState(canvasService.getDefaultPen())
  const [shapes, setShapes] = useState([])

  function onDrawShape(shape, x, y) {
    const shapesDrawingMap = {
      line: _drawLine,
      rect: _drawRect,
      ellipse: _drawEllipse,
    }

    let shapeToAdd
    if (typeof shape === 'string') {
      // If shape is of type string --> Generate and render new shape.
      shapeToAdd = canvasService.getNewShape(shape, x, y)
    } else {
      // Else --> Draw existing shape (represented as an object)
      shapeToAdd = { ...shape }
    }

    contextRef.current.beginPath()
    shapesDrawingMap[shapeToAdd.type](shapeToAdd, x, y)
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
    const { type, x, y, width, height, angle } = shape

    contextRef.current.save()
    contextRef.current.beginPath()

    contextRef.current.setLineDash([5, 5])
    contextRef.current.lineWidth = 4
    contextRef.current.strokeStyle = '#ead940'

    if (angle) {
      _rotateShape(shape)
    } else if (type === RECT) {
      _performRectDraw(x, y, width, height)
    } else if (type === ELLIPSE) {
      _performEllipseDraw(x, y, width, height)
    }

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

  function _drawLine(line) {
    const { positions } = line
    positions.forEach(pos => {
      contextRef.current.lineTo(pos.x, pos.y)
      contextRef.current.stroke()
    })
    setShapes(prevShapes => [...prevShapes, line])
  }

  function _drawRect(rect, x, y) {
    const { width, height, angle } = rect

    if (angle) _rotateShape(rect)
    else _performRectDraw(x, y, width, height)

    setShapes(prevShapes => [...prevShapes, rect])
  }

  function _drawEllipse(ellipse, x, y) {
    const { width, height, angle } = ellipse

    if (angle) _rotateShape(ellipse)
    else _performEllipseDraw(x, y, width, height)

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

  function _performRectDraw(x, y, width, height) {
    contextRef.current.strokeRect(x, y, width, height)
  }

  function _performEllipseDraw(x, y, width, height) {
    contextRef.current.ellipse(x, y, width, height, 0, 0, 2 * Math.PI)
    contextRef.current.stroke()
  }

  return {
    pen,
    setPen,
    shapes,
    setShapes,
    onDrawShape,
    drawAllShapes,
    highlightSelectedShape,
    resetStrokeStyle,
    removeShape,
    clearCanvas,
  }
}
