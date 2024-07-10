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
    <section className="canvas-controls">
      <button className="btn-shape" onClick={() => onSetShape(LINE)}>
        Pen
      </button>

      <button className="btn-shape" onClick={() => onSetShape(RECT)}>
        Square
      </button>

      <button className="btn-shape" onClick={() => onSetShape(ELLIPSE)}>
        Ellipse
      </button>

      <button className="btn-size" onClick={() => onSetSize(1)}>
        +
      </button>

      <button className="btn-size" onClick={() => onSetSize(-1)}>
        -
      </button>

      <button className="btn-clear" onClick={clearCanvas}>
        Clear
      </button>
    </section>
  )
}
