import { useEffect, useRef, useState } from 'react'
import { canvasService, ELLIPSE, LINE, RECT } from '../../services/canvas.service'
import { CanvasControls } from './CanvasControls'

export function Canvas() {
  const [pen, setPen] = useState(canvasService.getDefaultPen())
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
    if (!isDrawing) return

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

  function resizeCanvas(canvasEl) {
    canvasEl.width = canvasContainerRef.current.clientWidth
    canvasEl.height = canvasContainerRef.current.clientHeight
  }

  function drawRect(x, y) {
    contextRef.current.strokeRect(x, y, 30, 30)
  }

  function drawEllipse(x, y) {
    contextRef.current.ellipse(x, y, 20, 30, 0, 0, 2 * Math.PI)
    contextRef.current.stroke()
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
          onClick={({ nativeEvent }) => {
            onAddShape(pen.shape, nativeEvent.offsetX, nativeEvent.offsetY)
          }}
        ></canvas>
      </div>
    </section>
  )
}
