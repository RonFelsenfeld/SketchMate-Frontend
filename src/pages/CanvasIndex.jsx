import { useRef } from 'react'
import { useNavigate } from 'react-router'

import { utilService } from '../services/util.service'
import { useTheme } from '../customHooks/useTheme'

import { CanvasHeader } from '../components/canvas/CanvasHeader'
import { Canvas } from '../components/canvas/Canvas'

export function CanvasIndex() {
  const canvasIndex = useRef(null)
  const { getThemeClass } = useTheme()
  const navigate = useNavigate()

  function onBackToHome() {
    utilService.animateCSS(canvasIndex.current, 'slideOutRight')
    setTimeout(() => navigate('/'), 700)
  }

  return (
    <section
      ref={canvasIndex}
      className={`canvas-index flex column animate__animated animate__slideInRight ${getThemeClass()}`}
    >
      <CanvasHeader onBackToHome={onBackToHome} />
      <Canvas />
    </section>
  )
}
