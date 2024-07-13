import { useEffect, useRef, useState } from 'react'

import { canvasService, LINE } from '../../services/canvas.service'
import { utilService } from '../../services/util.service'

import { useCanvas } from '../../customHooks/useCanvas'
import { CanvasControls } from './CanvasControls'

export function Canvas() {
  const [selectedShape, setSelectedShape] = useState(null)
  const [keyPressed, setKeyPressed] = useState('')

  const canvasContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const dragInfoRef = useRef(canvasService.getDefaultDragInfo())

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
    resizeCanvas,
  } = useCanvas(canvasRef, canvasContainerRef, contextRef)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    contextRef.current = context
    resizeCanvas(canvas)
    addEventListeners()

    return removeEventListeners
  }, [])

  useEffect(() => {
    clearCanvas()
    drawAllShapes()

    if (selectedShape) highlightSelectedShape(selectedShape)
  }, [selectedShape, keyPressed])

  useEffect(() => {
    if (keyPressed) handleKeyboardPress(keyPressed)
  }, [keyPressed])

  function onCanvasClicked({ nativeEvent }) {
    // When dragging and releasing, it counts as a click. (Therefore, need to prevent it)
    if (dragInfoRef.current.isDragging) return handleEndDragging()

    const { x, y } = utilService.getEvPos(nativeEvent)
    const clickedShape = canvasService.findClickedShape(shapes, x, y)

    if (clickedShape) {
      setSelectedShape(clickedShape)
    } else if (selectedShape) {
      setSelectedShape(null)
    } else if (pen.shape !== LINE) {
      onDrawShape(pen.shape, x, y)
    }
  }

  function onStartDrawing({ nativeEvent }) {
    const { x, y } = utilService.getEvPos(nativeEvent)
    const clickedShape = canvasService.findClickedShape(shapes, x, y)
    if (clickedShape) return handleStartDragging(clickedShape, x, y)

    contextRef.current.moveTo(x, y)
    contextRef.current.beginPath()
    resetStrokeStyle()

    const pos = { x, y }
    setPen(prevPen => ({ ...prevPen, linePositions: [pos], isDrawing: true }))
  }

  function onDrawing({ nativeEvent }) {
    const { x, y } = utilService.getEvPos(nativeEvent)
    if (dragInfoRef.current.isDragging) return handleDrag(x, y)

    // Finding an hovered shape for the cursor icon to change
    const hoveredShape = canvasService.findHoveredShape(shapes, x, y)
    const { addClassToElement, removeClassFromElement } = utilService
    const classFn = hoveredShape ? addClassToElement : removeClassFromElement
    classFn(canvasContainerRef.current, 'hovering')

    const { isDrawing, shape } = pen
    if (!isDrawing || shape !== LINE) return

    performLineDraw(x, y)
    const linePositions = [...pen.linePositions, { x, y }]
    setPen(prevPen => ({ ...prevPen, linePositions }))
  }

  function onEndDrawing() {
    contextRef.current.closePath()
    if (pen.shape !== LINE) return

    const newLine = canvasService.getNewLine(pen.linePositions, pen.strokeColor)
    setPen(prevPen => ({ ...prevPen, linePositions: [], isDrawing: false }))
    setShapes(prevShapes => [...prevShapes, newLine])
  }

  function handleStartDragging(shape, x, y) {
    setSelectedShape(shape)
    dragInfoRef.current = { isDragging: true, pos: { x, y } }
    setPen(prevPen => ({ ...prevPen, isDrawing: false }))
  }

  function handleDrag(offsetX, offsetY) {
    const { pos } = dragInfoRef.current
    const deltaX = offsetX - pos.x
    const deltaY = offsetY - pos.y

    const newPos = { x: pos.x + deltaX, y: pos.y + deltaY }
    const updatedShape = { ...selectedShape, ...newPos }

    updateShapes(updatedShape)
    dragInfoRef.current = { ...dragInfoRef.current, ...newPos }
  }

  function handleEndDragging() {
    dragInfoRef.current = canvasService.getDefaultDragInfo()
  }

  function onRemoveShape() {
    if (!selectedShape) return
    removeShape(selectedShape)
    setSelectedShape(null)
  }

  function updateShapes(updatedShape) {
    setSelectedShape(updatedShape)
    setShapes(shapes.map(s => (s._id === updatedShape._id ? updatedShape : s)))
  }

  function addEventListeners() {
    document.addEventListener('resize', resizeCanvas)
    document.addEventListener('keydown', onKeyboardPress)
  }

  function removeEventListeners() {
    document.removeEventListener('resize', resizeCanvas)
    document.removeEventListener('keydown', onKeyboardPress)
  }

  function onKeyboardPress({ key }) {
    const ARROWS_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft']
    if (ARROWS_KEYS.includes(key)) setKeyPressed(key)
  }

  // Could not attach as event listener directly because it doesn't has access to the updated selectedShape and shapes states
  function handleKeyboardPress(key) {
    setKeyPressed('')
    if (!selectedShape) return

    const arrowsMap = {
      ArrowUp: { diffX: 0, diffY: -5 },
      ArrowDown: { diffX: 0, diffY: 5 },
      ArrowRight: { diffX: 5, diffY: 0 },
      ArrowLeft: { diffX: -5, diffY: 0 },
    }

    const { x: prevX, y: prevY } = selectedShape
    const { diffX, diffY } = arrowsMap[key]

    const newPos = { x: prevX + diffX, y: prevY + diffY }
    const updatedShape = { ...selectedShape, ...newPos }
    updateShapes(updatedShape)
  }

  function getClasses() {
    if (dragInfoRef.current.isDragging) return 'dragging'
    if (pen.shape !== LINE) return 'shape'
    return ''
  }

  return (
    <section className="canvas-section flex">
      <div ref={canvasContainerRef} className={`canvas-container ${getClasses()}`}>
        <CanvasControls
          pen={pen}
          setPen={setPen}
          shapes={shapes}
          selectedShape={selectedShape}
          onRemoveShape={onRemoveShape}
          clearCanvas={clearCanvas}
          updateShapes={updateShapes}
        />

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
