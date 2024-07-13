import { memo, useEffect, useRef, useState } from 'react'
import { hideTooltip, showTooltip } from '../../services/event-bus.service'
import { useTheme } from '../../customHooks/useTheme'
import { useClickOutside } from '../../customHooks/useClickOutside'
import { utilService } from '../../services/util.service'

export const CanvasSettings = memo(CanvasSettingsCmp)

function CanvasSettingsCmp({
  settingsRef,
  penWidth,
  setPen,
  setSelectedShape,
  setIsShowingSettings,
}) {
  const settingsElRef = useRef(null)
  const [_, setForcedRendered] = useState(0)
  const { getThemeClass } = useTheme()

  useClickOutside(settingsElRef, () => {
    utilService.animateCSS(settingsElRef.current, 'rotateOutUpRight')
    setTimeout(() => {
      setIsShowingSettings(false)
    }, 600)
  })

  function onUpdateSettings({ target }) {
    let { value, name: field } = target
    settingsRef.current = { ...settingsRef.current, [field]: +value }
    setForcedRendered(prev => prev + 1)
    showTooltip(target, value)
  }

  useEffect(() => {
    setSelectedShape(null)
  }, [])

  function onSetPenWidth({ target }) {
    const { value } = target
    setPen(prevPen => ({ ...prevPen, width: +value }))
    showTooltip(target, value)
  }

  const { rotateAngle, sizeDiff } = settingsRef.current

  return (
    <section
      className={`canvas-settings animate__animated animate__rotateInDownRight ${getThemeClass()}`}
      ref={settingsElRef}
    >
      <form className="settings-form flex column align-center">
        <div className="input-container flex align-center justify-between">
          <label htmlFor="penWidth">Pen width</label>
          <input
            type="range"
            name="penWidth"
            onChange={onSetPenWidth}
            value={penWidth}
            min={1}
            max={30}
            onMouseEnter={ev => showTooltip(ev.currentTarget, penWidth)}
            onMouseLeave={hideTooltip}
          />
        </div>

        <div className="input-container flex align-center justify-between">
          <label htmlFor="sizeDiff">Resize by</label>
          <input
            type="range"
            name="sizeDiff"
            onChange={onUpdateSettings}
            value={sizeDiff}
            min={1}
            max={20}
            onMouseEnter={ev => showTooltip(ev.currentTarget, sizeDiff)}
            onMouseLeave={hideTooltip}
          />
        </div>

        <div className="input-container flex align-center justify-between">
          <label htmlFor="rotateAngle">Rotation angle</label>
          <input
            type="range"
            name="rotateAngle"
            onChange={onUpdateSettings}
            value={rotateAngle}
            min={1}
            max={360}
            onMouseEnter={ev => showTooltip(ev.currentTarget, rotateAngle)}
            onMouseLeave={hideTooltip}
          />
        </div>
      </form>
    </section>
  )
}
