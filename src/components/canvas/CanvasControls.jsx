import { useEffect, useRef } from 'react'
import { ELLIPSE, LINE, RECT } from '../../services/canvas.service'
import { utilService } from '../../services/util.service'
import { showTooltip, hideTooltip } from '../../services/event-bus.service'
import { useTheme } from '../../customHooks/useTheme'

export function CanvasControls({
  pen,
  setPen,
  shapes,
  settings,
  selectedShape,
  onRemoveShape,
  clearCanvas,
  updateShapes,
}) {
  const controlsRef = useRef(null)
  const { getThemeClass } = useTheme()

  useEffect(() => {
    utilService.animateCSS(controlsRef.current, 'fadeIn')
  }, [])

  function onSetShape(shape) {
    setPen(prevPen => ({ ...prevPen, shape }))
  }

  function onSetSize(diff) {
    if (!selectedShape) return

    const width = selectedShape.width + diff
    const height = selectedShape.height + diff
    const updatedShape = { ...selectedShape, width, height }
    updateShapes(updatedShape)
  }

  function onSetColor({ target }) {
    const { value, name: field } = target

    if (selectedShape) {
      const updatedShape = { ...selectedShape, [field]: value }
      updateShapes(updatedShape)
    } else {
      setPen(prevPen => ({ ...prevPen, [field]: value }))
    }
  }

  function onRotateShape(angleDiff) {
    if (!selectedShape) return

    const newAngle = selectedShape.angle + angleDiff
    const updatedShape = { ...selectedShape, angle: newAngle }
    updateShapes(updatedShape)
  }

  function getSelectedClass(shape) {
    return pen.shape === shape ? 'selected' : ''
  }

  function getIsDrawingClass() {
    // Relevant only for mobile devices
    if (window.innerWidth > 850) return ''
    return pen.isDrawing && pen.shape === LINE ? 'drawing' : ''
  }

  const { strokeColor, fillColor } = pen
  const { rotateAngle, sizeDiff } = settings
  return (
    <section
      ref={controlsRef}
      className={`canvas-controls flex ${getThemeClass()} ${getIsDrawingClass()}`}
    >
      <button
        className={`btn btn-pen ${getSelectedClass(LINE)}`}
        onClick={() => onSetShape(LINE)}
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Brush')}
        onMouseLeave={hideTooltip}
      ></button>

      <button
        className={`btn btn-shape square ${getSelectedClass(RECT)}`}
        onClick={() => onSetShape(RECT)}
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Square')}
        onMouseLeave={hideTooltip}
      ></button>

      <button
        className={`btn btn-shape ellipse gap ${getSelectedClass(ELLIPSE)}`}
        onClick={() => onSetShape(ELLIPSE)}
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Ellipse')}
        onMouseLeave={hideTooltip}
      ></button>

      <button
        className="btn btn-size plus"
        onClick={() => onSetSize(sizeDiff)}
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Increase Size')}
        onMouseLeave={hideTooltip}
        disabled={!selectedShape}
      ></button>

      <button
        className="btn btn-size minus gap"
        onClick={() => onSetSize(-sizeDiff)}
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Decrease Size')}
        onMouseLeave={hideTooltip}
        disabled={!selectedShape}
      ></button>

      <button
        className="btn btn-rotate right"
        onClick={() => onRotateShape(rotateAngle)}
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Rotate Right')}
        onMouseLeave={hideTooltip}
        disabled={!selectedShape}
      ></button>

      <button
        className="btn btn-rotate left gap"
        onClick={() => onRotateShape(-rotateAngle)}
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Rotate Left')}
        onMouseLeave={hideTooltip}
        disabled={!selectedShape}
      ></button>

      <button
        className="btn btn-color brush flex"
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Pick Stroke Color')}
        onMouseLeave={hideTooltip}
      >
        <label htmlFor="strokeColor" style={{ color: strokeColor }}></label>
        <input
          type="color"
          name="strokeColor"
          id="strokeColor"
          value={strokeColor}
          onChange={onSetColor}
        />
      </button>

      <button
        className="btn btn-color fill gap flex"
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Pick Fill Color')}
        onMouseLeave={hideTooltip}
      >
        <label htmlFor="fillColor" style={{ color: fillColor }}></label>
        <input
          type="color"
          name="fillColor"
          id="fillColor"
          value={fillColor}
          onChange={onSetColor}
        />
      </button>

      <button
        className="btn btn-remove"
        onClick={onRemoveShape}
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Erase Shape')}
        onMouseLeave={hideTooltip}
        disabled={!selectedShape}
      ></button>

      <button
        className="btn btn-clear"
        onClick={clearCanvas}
        onMouseEnter={ev => showTooltip(ev.currentTarget, 'Clear Canvas')}
        onMouseLeave={hideTooltip}
        disabled={!shapes.length}
      ></button>
    </section>
  )
}
