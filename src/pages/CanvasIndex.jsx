import { Canvas } from '../components/canvas/Canvas'
import { CanvasHeader } from '../components/canvas/CanvasHeader'

export function CanvasIndex() {
  return (
    <section className="canvas-index flex column animate__animated animate__slideInRight">
      <CanvasHeader />
      <Canvas />
    </section>
  )
}
