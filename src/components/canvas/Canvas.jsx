import { useEffect, useRef, useState } from 'react'
import { canvasService, LINE } from '../../services/canvas.service'
import { utilService } from '../../services/util.service'
import { useCanvas } from '../../customHooks/useCanvas'

import { CanvasControls } from './CanvasControls'
import { CanvasSettings } from './CanvasSettings'

export function Canvas({ isShowingSettings, setIsShowingSettings }) {
  const [selectedShape, setSelectedShape] = useState(null)
  const [keyPressed, setKeyPressed] = useState('')

  const dragInfoRef = useRef(canvasService.getDefaultDragInfo())
  const canvasSettingsRef = useRef(canvasService.getDefaultSettings())
  const linePositionsRef = useRef([])

  const canvasContainerElRef = useRef(null)
  const canvasElRef = useRef(null)
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
    resizeCanvas,
  } = useCanvas(canvasElRef, canvasContainerElRef, contextRef)

  useEffect(() => {
    const canvas = canvasElRef.current
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
  }, [selectedShape])

  useEffect(() => {
    if (keyPressed) handleKeyboardPress(keyPressed)
  }, [keyPressed])

  function onCanvasClicked({ nativeEvent }) {
    // When dragging and releasing, it counts as a click. (Therefore, need to prevent it)
    if (dragInfoRef.current.isDragging) return handleEndDragging()

    const { x, y } = utilService.getEvPos(nativeEvent, canvasElRef)
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
    const { x, y } = utilService.getEvPos(nativeEvent, canvasElRef)
    const clickedShape = canvasService.findClickedShape(shapes, x, y)
    if (clickedShape) return handleStartDragging(clickedShape, x, y)

    contextRef.current.moveTo(x, y)
    contextRef.current.beginPath()
    resetStrokeStyle()

    const pos = { x, y }
    linePositionsRef.current = [pos]
    setPen(prevPen => ({ ...prevPen, isDrawing: true }))
  }

  function onDrawing({ nativeEvent }) {
    const { x, y } = utilService.getEvPos(nativeEvent, canvasElRef)
    if (dragInfoRef.current.isDragging) return handleDrag(x, y)

    // Finding an hovered shape for the cursor icon to change
    const hoveredShape = canvasService.findHoveredShape(shapes, x, y)
    const { addClassToElement, removeClassFromElement } = utilService
    const classFn = hoveredShape ? addClassToElement : removeClassFromElement
    classFn(canvasContainerElRef.current, 'hovering')

    const { isDrawing, shape } = pen
    if (!isDrawing || shape !== LINE) return

    performLineDraw(x, y)
    linePositionsRef.current = [...linePositionsRef.current, { x, y }]
  }

  function onEndDrawing() {
    contextRef.current.closePath()
    if (pen.shape !== LINE) return

    const { strokeColor, width } = pen
    const newLine = canvasService.getNewLine(linePositionsRef.current, strokeColor, width)
    linePositionsRef.current = []
    setPen(prevPen => ({ ...prevPen, isDrawing: false }))
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
    setSelectedShape({ ...selectedShape }) // Forcing re-render to change cursor
  }

  function onRemoveShape() {
    if (!selectedShape) return
    removeShape(selectedShape)
    setSelectedShape(null)
  }

  function onClearCanvas() {
    clearCanvas()
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
      <CanvasControls
        pen={pen}
        setPen={setPen}
        shapes={shapes}
        settings={canvasSettingsRef.current}
        selectedShape={selectedShape}
        onRemoveShape={onRemoveShape}
        onClearCanvas={onClearCanvas}
        updateShapes={updateShapes}
      />

      <div ref={canvasContainerElRef} className={`canvas-container ${getClasses()}`}>
        <canvas
          ref={canvasElRef}
          className="canvas"
          onClick={onCanvasClicked}
          onMouseDown={onStartDrawing}
          onMouseMove={onDrawing}
          onMouseUp={onEndDrawing}
          onTouchStart={onStartDrawing}
          onTouchMove={onDrawing}
          onTouchEnd={onEndDrawing}
        ></canvas>

        {isShowingSettings && (
          <CanvasSettings
            penWidth={pen.width}
            setPen={setPen}
            settingsRef={canvasSettingsRef}
            setSelectedShape={setSelectedShape}
            setIsShowingSettings={setIsShowingSettings}
            canvasElRef={canvasElRef}
          />
        )}
      </div>
    </section>
  )
}
