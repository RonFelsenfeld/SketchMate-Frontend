import { ELLIPSE, LINE, RECT } from '../../services/canvas.service'

export function CanvasControls({
  setPen,
  shapes,
  setShapes,
  selectedShape,
  setSelectedShape,
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

  return (
    <section className="canvas-controls flex">
      <button className="btn btn-pen" onClick={() => onSetShape(LINE)}></button>

      <button className="btn btn-shape square" onClick={() => onSetShape(RECT)}></button>

      <button className="btn btn-shape ellipse" onClick={() => onSetShape(ELLIPSE)}></button>

      <button className="btn btn-size plus" onClick={() => onSetSize(1)}></button>

      <button className="btn btn-size minus" onClick={() => onSetSize(-1)}></button>

      <button className="btn-clear" onClick={clearCanvas}>
        Clear
      </button>
    </section>
  )
}
