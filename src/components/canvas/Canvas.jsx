import { useEffect, useRef, useState } from 'react'
import { canvasService, ELLIPSE, LINE, RECT } from '../../services/canvas.service'
import { CanvasControls } from './CanvasControls'

export function Canvas() {
  const [pen, setPen] = useState(canvasService.getDefaultPen())
  const [shapes, setShapes] = useState([])
  const [selectedShape, setSelectedShape] = useState(null)

  const canvasContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    contextRef.current = context
    resizeCanvas(canvas)
  }, [])

  useEffect(() => {
    clearCanvas()
    renderShapes()
    if (selectedShape) highlightSelectedShape()
  }, [selectedShape])

  function onStartDrawing({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.moveTo(offsetX, offsetY)
    contextRef.current.beginPath()

    const pos = { x: offsetX, y: offsetY }
    setPen(prevPen => ({ ...prevPen, linePositions: [pos], isDrawing: true }))
  }

  function onDrawing({ nativeEvent }) {
    const { isDrawing, shape } = pen
    // todo: enable unlimited drawing shapes?
    if (!isDrawing || shape !== LINE) return

    const { offsetX, offsetY } = nativeEvent
    if (shape === LINE) {
      contextRef.current.lineTo(offsetX, offsetY)
      contextRef.current.stroke()

      const linePositions = [...pen.linePositions, { x: offsetX, y: offsetY }]
      setPen(prevPen => ({ ...prevPen, linePositions, isDrawing: true }))
    } else {
      onDrawShape(shape, offsetX, offsetY)
    }
  }

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

  function onEndDrawing() {
    contextRef.current.closePath()
    if (pen.shape !== LINE) return

    const newLine = canvasService.getNewLine(pen.linePositions)

    setPen(prevPen => ({ ...prevPen, linePositions: [], isDrawing: false }))
    setShapes(prevShapes => [...prevShapes, newLine])
  }

  function onCanvasClicked({ nativeEvent }) {
    setSelectedShape(null)

    const { offsetX, offsetY } = nativeEvent
    const clickedShape = canvasService.getClickedShape(shapes, offsetX, offsetY)

    if (clickedShape) {
      setSelectedShape(clickedShape)
    } else if (pen.shape !== LINE) {
      onDrawShape(pen.shape, offsetX, offsetY)
    }
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

  function renderShapes() {
    const shapesToRender = [...shapes]
    setShapes([])
    contextRef.current.setLineDash([])
    contextRef.current.lineWidth = 1
    shapesToRender.forEach(shape => onDrawShape(shape, shape.x, shape.y))
  }

  function clearCanvas() {
    const { width, height } = canvasRef.current
    contextRef.current.clearRect(0, 0, width, height)
    setShapes([])
  }

  function resizeCanvas(canvasEl) {
    canvasEl.width = canvasContainerRef.current.clientWidth
    canvasEl.height = canvasContainerRef.current.clientHeight
  }

  function highlightSelectedShape() {
    const { type, x, y, width, height } = selectedShape

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

  return (
    <section className="canvas-section">
      <CanvasControls
        setPen={setPen}
        shapes={shapes}
        setShapes={setShapes}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        clearCanvas={clearCanvas}
      />

      <div ref={canvasContainerRef} className="canvas-container">
        <canvas
          ref={canvasRef}
          className="canvas"
          onMouseDown={onStartDrawing}
          onMouseMove={onDrawing}
          onMouseUp={onEndDrawing}
          onClick={onCanvasClicked}
        ></canvas>
      </div>
    </section>
  )
}
