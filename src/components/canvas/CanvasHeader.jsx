import { NavLink } from 'react-router-dom'

export function CanvasHeader() {
  return (
    <header className="canvas-header flex align-center justify-between">
      <NavLink to={'/'}>
        <h1 className="logo">
          <span>S</span>ketch<span>M</span>ate
        </h1>
      </NavLink>
    </header>
  )
}
