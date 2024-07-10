import { useEffect, useRef } from 'react'
import { Canvas } from '../components/canvas/Canvas'

export function CanvasIndex() {
  const canvasIndexRef = useRef(null)

  useEffect

  return (
    <section className="canvas-index flex column align-center animate__animated animate__slideInRight">
      <Canvas />
    </section>
  )
}
