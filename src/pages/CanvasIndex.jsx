import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { utilService } from '../services/util.service'
import { useTheme } from '../customHooks/useTheme'

import { CanvasHeader } from '../components/canvas/CanvasHeader'
import { Canvas } from '../components/canvas/Canvas'

export function CanvasIndex() {
  const [isShowingSettings, setIsShowingSettings] = useState(false)
  const canvasIndex = useRef(null)
  const { getThemeClass } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    window.onbeforeunload = () => true
    return () => (window.onbeforeunload = null)
  }, [])

  function onBackToHome() {
    utilService.animateCSS(canvasIndex.current, 'slideOutRight')
    setTimeout(() => navigate('/'), 700)
  }

  return (
    <section
      ref={canvasIndex}
      className={`canvas-index flex column animate__animated animate__slideInRight  ${getThemeClass()}`}
    >
      <CanvasHeader onBackToHome={onBackToHome} setIsShowingSettings={setIsShowingSettings} />
      <Canvas isShowingSettings={isShowingSettings} setIsShowingSettings={setIsShowingSettings} />
    </section>
  )
}
