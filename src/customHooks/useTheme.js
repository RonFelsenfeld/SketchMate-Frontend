import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export function useTheme() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext)

  function getThemeClass() {
    return isDarkMode ? 'dark' : ''
  }

  return {
    isDarkMode,
    setIsDarkMode,
    getThemeClass,
  }
}
