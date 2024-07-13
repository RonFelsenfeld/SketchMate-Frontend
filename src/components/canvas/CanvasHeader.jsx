import { useTheme } from '../../customHooks/useTheme'
import { ThemeToggleBtn } from '../general/ThemeToggleBtn'

export function CanvasHeader({ onBackToHome, setIsShowingSettings }) {
  const { getThemeClass } = useTheme()

  return (
    <header className={`canvas-header flex align-center justify-between ${getThemeClass()}`}>
      <h1 className="logo" onClick={onBackToHome}>
        <span>S</span>ketch<span>M</span>ate
      </h1>

      <div className="btns-container flex align-center">
        <ThemeToggleBtn additionalFn={() => setIsShowingSettings(false)} />

        <button
          className="btn-settings"
          title="Show settings"
          onClick={() => setIsShowingSettings(true)}
        ></button>

        <button className="btn-home" title="Return to home page" onClick={onBackToHome}></button>
      </div>
    </header>
  )
}
