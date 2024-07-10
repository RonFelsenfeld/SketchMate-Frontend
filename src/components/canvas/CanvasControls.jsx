/* eslint-disable react/prop-types */
import { ELLIPSE, RECT } from '../../services/canvas.service'

export function CanvasControls({ setPen }) {
  function onSetShape(shape) {
    setPen(prevPen => ({ ...prevPen, shape }))
  }

  function onSetSize(diff) {
    console.log(diff)
  }

  return (
    <section className="canvas-controls">
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
    </section>
  )
}
