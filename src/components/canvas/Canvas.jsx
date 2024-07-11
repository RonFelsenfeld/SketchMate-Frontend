import { useEffect, useRef, useState } from 'react'
import { canvasService, LINE } from '../../services/canvas.service'
import { useDrawingKit } from '../../customHooks/useDrawingKit'
import { CanvasControls } from './CanvasControls'

export function Canvas() {
  const [selectedShape, setSelectedShape] = useState(null)
  const [dragInfo, setDragInfo] = useState(canvasService.getDefaultDragInfo())
  const canvasContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const {
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
  } = useDrawingKit(canvasRef, contextRef)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    contextRef.current = context
    resizeCanvas(canvas)
  }, [])

  useEffect(() => {
    clearCanvas()
    drawAllShapes()
    if (selectedShape) highlightSelectedShape(selectedShape)
  }, [selectedShape])

  function onCanvasClicked({ nativeEvent }) {
    // When dragging and releasing, it counts as a click. (Therefore, need to prevent it)
    if (dragInfo.isDragging) return handleEndDragging()
    setSelectedShape(null)

    const { offsetX, offsetY } = nativeEvent
    const clickedShape = canvasService.findClickedShape(shapes, offsetX, offsetY)

    if (clickedShape) {
      setSelectedShape(clickedShape)
    } else if (pen.shape !== LINE) {
      onDrawShape(pen.shape, offsetX, offsetY)
    }
  }

  function onStartDrawing({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent
    const clickedShape = canvasService.findClickedShape(shapes, offsetX, offsetY)
    if (clickedShape) return handleStartDragging(clickedShape, offsetX, offsetY)

    contextRef.current.moveTo(offsetX, offsetY)
    contextRef.current.beginPath()

    resetStrokeStyle()
    const pos = { x: offsetX, y: offsetY }
    setPen(prevPen => ({ ...prevPen, linePositions: [pos], isDrawing: true }))
  }

  function onDrawing({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent
    if (dragInfo.isDragging) return handleDrag(offsetX, offsetY)

    const { isDrawing, shape } = pen
    if (!isDrawing || shape !== LINE) return
    // todo: allow unlimited drawing shapes?

    if (shape === LINE) {
      performLineDraw(offsetX, offsetY)
      const linePositions = [...pen.linePositions, { x: offsetX, y: offsetY }]
      setPen(prevPen => ({ ...prevPen, linePositions }))
    } else {
      onDrawShape(shape, offsetX, offsetY)
    }
  }

  function onEndDrawing() {
    contextRef.current.closePath()
    if (pen.shape !== LINE) return

    const newLine = canvasService.getNewLine(pen.linePositions, pen.strokeColor)
    setPen(prevPen => ({ ...prevPen, linePositions: [], isDrawing: false }))
    setShapes(prevShapes => [...prevShapes, newLine])
  }

  function resizeCanvas(canvasEl) {
    canvasEl.width = canvasContainerRef.current.clientWidth
    canvasEl.height = canvasContainerRef.current.clientHeight
  }

  function onRemoveShape() {
    // todo: disable btn when has no selected shape
    if (!selectedShape) return
    removeShape(selectedShape)
    setSelectedShape(null)
  }

  function handleStartDragging(shape, x, y) {
    setSelectedShape(shape)
    setDragInfo({ isDragging: true, pos: { x, y } })
  }

  function handleDrag(offsetX, offsetY) {
    const { pos } = dragInfo
    const deltaX = offsetX - pos.x
    const deltaY = offsetY - pos.y

    const newPos = { x: pos.x + deltaX, y: pos.y + deltaY }
    const updatedShape = { ...selectedShape, ...newPos }

    setSelectedShape(updatedShape)
    setShapes(shapes.map(s => (s._id === updatedShape._id ? updatedShape : s)))
    setDragInfo(prevInfo => ({ ...prevInfo, ...newPos }))
  }

  function handleEndDragging() {
    setDragInfo(canvasService.getDefaultDragInfo())
  }

  return (
    <section className="canvas-section flex align-center">
      <CanvasControls
        pen={pen}
        setPen={setPen}
        shapes={shapes}
        setShapes={setShapes}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        onRemoveShape={onRemoveShape}
        clearCanvas={clearCanvas}
      />

      <div ref={canvasContainerRef} className="canvas-container">
        <canvas
          ref={canvasRef}
          className="canvas"
          onClick={onCanvasClicked}
          onMouseDown={onStartDrawing}
          onMouseMove={onDrawing}
          onMouseUp={onEndDrawing}
        ></canvas>
      </div>
    </section>
  )
}
