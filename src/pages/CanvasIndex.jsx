import { useEffect, useRef, useState } from 'react'
import { canvasService } from '../services/canvas.service'

export function CanvasIndex() {
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
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setPen(prevPen => ({ ...prevPen, isDrawing: true }))
  }

  function onDrawing({ nativeEvent }) {
    if (!pen.isDrawing) return
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }

  function onEndDrawing() {
    contextRef.current.closePath()
    setPen(prevPen => ({ ...prevPen, isDrawing: false }))
  }

  function resizeCanvas(canvasEl) {
    canvasEl.width = canvasContainerRef.current.clientWidth
    canvasEl.height = canvasContainerRef.current.clientHeight
  }

  return (
    <section className="canvas-index flex column align-center">
      <h1>Canvas</h1>

      <div ref={canvasContainerRef} className="canvas-container">
        <canvas
          ref={canvasRef}
          className="canvas"
          onMouseDown={onStartDrawing}
          onMouseMove={onDrawing}
          onMouseUp={onEndDrawing}
        ></canvas>
      </div>
    </section>
  )
}
