import { useState } from 'react'
import { canvasService } from '../services/canvas.service'

export function useDrawingKit(canvasRef, contextRef) {
  const [pen, setPen] = useState(canvasService.getDefaultPen())
  const [shapes, setShapes] = useState([])

  function onDrawShape(shape, x, y) {
    const shapesDrawingMap = {
      line: drawLine,
      rect: drawRect,
      ellipse: drawEllipse,
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

  function drawLine(line) {
    const { positions } = line
    positions.forEach(pos => {
      contextRef.current.lineTo(pos.x, pos.y)
      contextRef.current.stroke()
    })
    setShapes(prevShapes => [...prevShapes, line])
  }

  function drawRect(rect, x, y) {
    const { width, height } = rect
    contextRef.current.strokeRect(x, y, width, height)
    setShapes(prevShapes => [...prevShapes, rect])
  }

  function drawEllipse(ellipse, x, y) {
    const { width, height } = ellipse
    contextRef.current.ellipse(x, y, width, height, 0, 0, 2 * Math.PI)
    contextRef.current.stroke()
    setShapes(prevShapes => [...prevShapes, ellipse])
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
    clearCanvas,
  }
}
