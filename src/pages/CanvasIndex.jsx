import { Canvas } from '../components/canvas/Canvas'
import { CanvasHeader } from '../components/canvas/CanvasHeader'
import { useTheme } from '../customHooks/useTheme'

export function CanvasIndex() {
  const { getThemeClass } = useTheme()

  return (
    <section
      className={`canvas-index flex column animate__animated animate__slideInRight ${getThemeClass()}`}
    >
      <CanvasHeader />
      <Canvas />
    </section>
  )
}
