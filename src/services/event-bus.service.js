export const SHOW_MSG = 'show-msg'
export const UPDATE_TOOLTIP = 'update-tooltip'

function createEventEmitter() {
  const listenersMap = {}
  return {
    on(evName, listener) {
      listenersMap[evName] = listenersMap[evName] ? [...listenersMap[evName], listener] : [listener]
      return () => {
        listenersMap[evName] = listenersMap[evName].filter(func => func !== listener)
      }
    },
    emit(evName, data) {
      if (!listenersMap[evName]) return
      listenersMap[evName].forEach(listener => listener(data))
    },
  }
}

export const eventBus = createEventEmitter()

export function showTooltip(target, txt) {
  const { left, top, width } = target.getBoundingClientRect()
  const pos = { x: left, y: top }
  const tooltip = { isOpen: true, pos, txt, targetWidth: width }
  eventBus.emit(UPDATE_TOOLTIP, tooltip)
}

export function hideTooltip() {
  eventBus.emit(UPDATE_TOOLTIP, null)
}
