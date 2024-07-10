import { NavLink } from 'react-router-dom'
import { utilService } from '../../services/util.service'

export function AppHeader() {
  return (
    <header className="app-header flex align-center justify-between">
      <NavLink to={'/'}>
        <h1 className="logo">
          <span>S</span>ketch<span>M</span>ate
        </h1>
      </NavLink>

      <h3 className="greeting-msg">{utilService.greetBasedOnHour()}</h3>
    </header>
  )
}
