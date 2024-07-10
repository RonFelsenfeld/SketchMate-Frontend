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

    // If shape is of type string --> Generate and render new shape.
    // Else --> Draw existing shape (represented as an object)
    let shapeToAdd
    if (typeof shape === 'string') {
      shapeToAdd = canvasService.getNewShape(shape, x, y)
    } else {
      shapeToAdd = { ...shape }
    }

    contextRef.current.beginPath()
    shapesDrawingMap[shapeToAdd.type](shapeToAdd, x, y)
    contextRef.current.closePath()
    setPen(prevPen => ({ ...prevPen, isDrawing: false }))
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
    const { width, height } = rect
    contextRef.current.strokeRect(x, y, width, height)
    setShapes(prevShapes => [...prevShapes, rect])
  }

  function _drawEllipse(ellipse, x, y) {
    const { width, height } = ellipse
    contextRef.current.ellipse(x, y, width, height, 0, 0, 2 * Math.PI)
    contextRef.current.stroke()
    setShapes(prevShapes => [...prevShapes, ellipse])
  }

  function highlightSelectedShape(shape) {
    const { type, x, y, width, height } = shape

    contextRef.current.beginPath()
    contextRef.current.setLineDash([10, 10])
    contextRef.current.lineWidth = 2
    contextRef.current.strokeStyle = 'black'

    if (type === RECT) {
      contextRef.current.strokeRect(x - 10, y - 10, width + 2 * 10, height + 2 * 10)
    } else if (type === ELLIPSE) {
      contextRef.current.ellipse(x, y, width + 10, height + 10, 0, 0, 2 * Math.PI)
      contextRef.current.stroke()
    }
    contextRef.current.closePath()
  }

  function resetContext() {
    contextRef.current.setLineDash([])
    contextRef.current.lineWidth = 1
  }

  function clearCanvas() {
    const { width, height } = canvasRef.current
    contextRef.current.clearRect(0, 0, width, height)
    setShapes([])
  }

  return {
    pen,
    setPen,
    shapes,
    setShapes,
    onDrawShape,
    highlightSelectedShape,
    resetContext,
    clearCanvas,
  }
}
