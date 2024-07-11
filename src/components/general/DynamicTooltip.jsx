import { useEffect, useState } from 'react'
import { eventBus, UPDATE_TOOLTIP } from '../../services/event-bus.service'

export function DynamicTooltip() {
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    // Disabling tooltip for mobile devices
    if (window.innerWidth < 850) return
    const unsubscribe = eventBus.on(UPDATE_TOOLTIP, setTooltip)
    return unsubscribe
  }, [])

  function getHorizontalPos() {
    return pos.x + targetWidth / 2
  }

  // The remove and the clear buttons doesn't have hover animation (static)
  // Therefore, the tooltip's translate is different than the other btns
  function isStaticClass(txt) {
    const staticBtns = ['Erase Shape', 'Clear Canvas']
    return staticBtns.includes(txt) ? 'static' : ''
  }

  if (!tooltip) return <span></span>

  const { pos, txt, targetWidth, isOpen } = tooltip
  return (
    <span
      className={`dynamic-tooltip animate__animated animate__fadeIn ${isStaticClass(txt)}`}
      style={{
        left: getHorizontalPos(pos?.x, targetWidth),
        top: pos?.y,
        display: `${isOpen ? 'block' : 'none'}`,
      }}
    >
      {txt}
    </span>
  )
}
