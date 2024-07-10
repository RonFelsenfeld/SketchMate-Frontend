import { ELLIPSE, LINE, RECT } from '../../services/canvas.service'

export function CanvasControls({
  pen,
  setPen,
  shapes,
  setShapes,
  selectedShape,
  setSelectedShape,
  onRemoveShape,
  clearCanvas,
}) {
  function onSetShape(shape) {
    setPen(prevPen => ({ ...prevPen, shape }))
  }

  function onSetSize(diff) {
    // todo: disable btns when has no selected shape
    if (!selectedShape) return

    const width = selectedShape.width + diff
    const height = selectedShape.height + diff
    const updatedShape = { ...selectedShape, width, height }

    setSelectedShape(updatedShape)
    setShapes(shapes.map(s => (s._id === updatedShape._id ? updatedShape : s)))
  }

  function onSetColor({ target }) {
    const { value, name: field } = target
    setPen(prevPen => ({ ...prevPen, [field]: value }))
  }

  function getSelectedClass(shape) {
    return pen.shape === shape ? 'selected' : ''
  }

  const { strokeColor, fillColor } = pen
  return (
    <section className="canvas-controls flex">
      <button
        className={`btn btn-pen ${getSelectedClass(LINE)}`}
        onClick={() => onSetShape(LINE)}
      ></button>

      <button
        className={`btn btn-shape square ${getSelectedClass(RECT)}`}
        onClick={() => onSetShape(RECT)}
      ></button>

      <button
        className={`btn btn-shape ellipse ${getSelectedClass(ELLIPSE)}`}
        onClick={() => onSetShape(ELLIPSE)}
      ></button>

      <button className="btn btn-size plus" onClick={() => onSetSize(1)}></button>

      <button className="btn btn-size minus" onClick={() => onSetSize(-1)}></button>

      <button className="btn btn-color brush flex">
        <label htmlFor="strokeColor" style={{ color: strokeColor }}></label>
        <input
          type="color"
          name="strokeColor"
          id="strokeColor"
          value={strokeColor}
          onChange={onSetColor}
        />
      </button>

      <button className="btn btn-color fill flex">
        <label htmlFor="fillColor" style={{ color: fillColor }}></label>
        <input
          type="color"
          name="fillColor"
          id="fillColor"
          value={fillColor}
          onChange={onSetColor}
        />
      </button>

      <button className="btn btn-remove" onClick={onRemoveShape}></button>

      <button className="btn-clear" onClick={clearCanvas}>
        Clear
      </button>
    </section>
  )
}
