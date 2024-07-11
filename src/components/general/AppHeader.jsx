import { NavLink } from 'react-router-dom'
import { utilService } from '../../services/util.service'
import { useTheme } from '../../customHooks/useTheme'
import { ThemeToggleBtn } from './ThemeToggleBtn'

export function AppHeader() {
  const { getThemeClass } = useTheme()

  return (
    <header className={`app-header flex align-center justify-between ${getThemeClass()}`}>
      <NavLink to={'/'}>
        <h1 className="logo">
          <span>S</span>ketch<span>M</span>ate
        </h1>
      </NavLink>

      <div className="guest-container flex align-center">
        <h3 className="greeting-msg">{utilService.greetBasedOnHour()}</h3>
        <ThemeToggleBtn />
      </div>
    </header>
  )
}
