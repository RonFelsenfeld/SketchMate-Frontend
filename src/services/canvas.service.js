export const LINE = 'line'
export const ELLIPSE = 'ellipse'
export const RECT = 'rect'

export const canvasService = {
  getDefaultPen,
}

function getDefaultPen() {
  return {
    color: '#000',
    shape: LINE,
    isDrawing: false,
  }
}
