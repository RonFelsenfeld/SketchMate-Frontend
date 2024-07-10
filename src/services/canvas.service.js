export const LINE = 'line'
export const CIRCLE = 'circle'
export const RECT = 'rect'

export const canvasService = {
  getDefaultPen,
}

function getDefaultPen() {
  return {
    pos: null,
    color: '#000',
    shape: LINE,
    isDrawing: false,
  }
}
