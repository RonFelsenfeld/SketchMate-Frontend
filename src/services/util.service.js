export const utilService = {
  makeId,
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  greetBasedOnHour,
  animateCSS,
  getEvPos,
  addClassToElement,
  removeClassFromElement,
}

function makeId(length = 6) {
  const POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let txt = ''

  for (let i = 0; i < length; i++) {
    txt += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE.length))
  }

  return txt
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : undefined
}

function removeFromStorage(key) {
  localStorage.removeItem(key)
}

function greetBasedOnHour() {
  const currentHour = new Date().getHours()

  if (currentHour >= 6 && currentHour < 12) {
    return 'Good morning, guest!'
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good afternoon, guest!'
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'Good evening, guest!'
  } else {
    return 'Good night, guest!'
  }
}

function animateCSS(el, animation = 'bounce') {
  if (!el) return

  const prefix = 'animate__'
  return new Promise(resolve => {
    const animationName = `${prefix}${animation}`
    el.classList.add(`${prefix}animated`, animationName)

    el.addEventListener('animationend', handleAnimationEnd, { once: true })

    function handleAnimationEnd(event) {
      event.stopPropagation()
      el.classList.remove(`${prefix}animated`, animationName)
      resolve('Animation ended')
    }
  })
}

// Calculates event position (support touch event - preciser pos)
function getEvPos(ev, canvasElRef) {
  const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }

  if (TOUCH_EVENTS.includes(ev.type)) {
    ev = ev.changedTouches[0]
    const canvas = canvasElRef.current.getBoundingClientRect()

    pos = {
      x: ev.clientX - canvas.left,
      y: ev.clientY - canvas.top,
    }
  }

  return pos
}

function addClassToElement(el, className) {
  if (el) el.classList.add(className)
}

function removeClassFromElement(el, className) {
  if (el) el.classList.remove(className)
}
