import { useTheme } from '../../customHooks/useTheme'

export function ThemeToggleBtn({ additionalFn = null }) {
  const { isDarkMode, setIsDarkMode, getThemeClass } = useTheme()

  function toggleIsDarkMode() {
    setIsDarkMode(!isDarkMode)
    if (additionalFn) additionalFn()
  }

  return (
    <div className="btn-toggle-theme" title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <input
        type="checkbox"
        className="theme-input"
        id="theme-input"
        onChange={toggleIsDarkMode}
        checked={isDarkMode}
      />

      <label
        htmlFor="theme-input"
        className={`flex align-center justify-between theme-label ${getThemeClass()}`}
      >
        <span className="icon moon"></span>
        <span className="icon sun"></span>
        <span className="ball"></span>
      </label>
    </div>
  )
}
