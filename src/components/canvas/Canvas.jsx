import { useEffect, useRef, useState } from 'react'
import { canvasService, LINE } from '../../services/canvas.service'
import { useDrawingKit } from '../../customHooks/useDrawingKit'
import { CanvasControls } from './CanvasControls'

export function Canvas() {
  const [selectedShape, setSelectedShape] = useState(null)
  const canvasContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const {
    pen,
    setPen,
    shapes,
    setShapes,
    onDrawShape,
    highlightSelectedShape,
    resetContext,
    clearCanvas,
  } = useDrawingKit(canvasRef, contextRef)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    contextRef.current = context
    resizeCanvas(canvas)
  }, [])

  useEffect(() => {
    clearCanvas()
    renderShapes()
    if (selectedShape) highlightSelectedShape(selectedShape)
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
      resetContext()
      contextRef.current.stroke()

      const linePositions = [...pen.linePositions, { x: offsetX, y: offsetY }]
      setPen(prevPen => ({ ...prevPen, linePositions, isDrawing: true }))
    } else {
      onDrawShape(shape, offsetX, offsetY)
    }
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

  function renderShapes() {
    const shapesToRender = [...shapes]
    setShapes([])
    resetContext()
    shapesToRender.forEach(shape => onDrawShape(shape, shape.x, shape.y))
  }

  function resizeCanvas(canvasEl) {
    canvasEl.width = canvasContainerRef.current.clientWidth
    canvasEl.height = canvasContainerRef.current.clientHeight
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
