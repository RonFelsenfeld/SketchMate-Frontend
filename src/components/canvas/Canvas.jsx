/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { canvasService, ELLIPSE, LINE, RECT } from '../../services/canvas.service'
import { CanvasControls } from './CanvasControls'

export function Canvas() {
  const [pen, setPen] = useState(canvasService.getDefaultPen())
  const [shapes, setShapes] = useState([])
  const canvasContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    contextRef.current = context
    resizeCanvas(canvas)
  }, [])

  function onStartDrawing({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.moveTo(offsetX, offsetY)
    contextRef.current.beginPath()
    setPen(prevPen => ({ ...prevPen, isDrawing: true }))
  }

  function onDrawing({ nativeEvent }) {
    const { isDrawing, shape } = pen
    // todo: enable unlimited drawing shapes?
    if (!isDrawing || shape !== LINE) return

    const { offsetX, offsetY } = nativeEvent
    if (shape === LINE) {
      contextRef.current.lineTo(offsetX, offsetY)
      contextRef.current.stroke()
    } else {
      onAddShape(shape, offsetX, offsetY)
    }
  }

  function onAddShape(shape, x, y) {
    if (shape === LINE) return

    contextRef.current.beginPath()
    switch (shape) {
      case RECT:
        drawRect(x, y)
        break

      case ELLIPSE:
        drawEllipse(x, y)
        break
    }
    contextRef.current.closePath()
  }

  function onEndDrawing() {
    contextRef.current.closePath()
    setPen(prevPen => ({ ...prevPen, isDrawing: false }))
  }

  function onCanvasClicked({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent
    const clickedShape = canvasService.getClickedShape(shapes, offsetX, offsetY)

    if (clickedShape) {
      console.log('clicked!')
    } else {
      onAddShape(pen.shape, offsetX, offsetY)
    }
  }

  function resizeCanvas(canvasEl) {
    canvasEl.width = canvasContainerRef.current.clientWidth
    canvasEl.height = canvasContainerRef.current.clientHeight
  }

  function drawRect(x, y) {
    const rect = canvasService.generateShape(RECT, x, y)
    const { width, height } = rect
    contextRef.current.strokeRect(x, y, width, height)
    setShapes(prevShapes => [...prevShapes, rect])
  }

  function drawEllipse(x, y) {
    const ellipse = canvasService.generateShape(ELLIPSE, x, y)
    const { width, height } = ellipse
    contextRef.current.ellipse(x, y, width, height, 0, 0, 2 * Math.PI)
    contextRef.current.stroke()
    setShapes(prevShapes => [...prevShapes, ellipse])
  }

  return (
    <section className="canvas-section">
      <CanvasControls setPen={setPen} />

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
