import { NavLink } from 'react-router-dom'
import { useTheme } from '../../customHooks/useTheme'
import { ThemeToggleBtn } from '../general/ThemeToggleBtn'

export function CanvasHeader() {
  const { getThemeClass } = useTheme()

  return (
    <header className={`canvas-header flex align-center justify-between ${getThemeClass()}`}>
      <NavLink to={'/'}>
        <h1 className="logo">
          <span>S</span>ketch<span>M</span>ate
        </h1>
      </NavLink>

      <div className="btns-container flex align-center">
        <ThemeToggleBtn />

        <NavLink to={'/'}>
          <button className="btn-home" title="Return to home page"></button>
        </NavLink>
      </div>
    </header>
  )
}
