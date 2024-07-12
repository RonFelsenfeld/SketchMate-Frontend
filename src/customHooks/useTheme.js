import { useContext, useEffect } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import { utilService } from '../services/util.service'

export function useTheme() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext)

  useEffect(() => {
    const THEME_KEY = 'themeDB'
    if (isDarkMode) utilService.saveToStorage(THEME_KEY, 'dark')
    else utilService.removeFromStorage(THEME_KEY)
  }, [isDarkMode])

  function getThemeClass() {
    return isDarkMode ? 'dark' : ''
  }

  return {
    isDarkMode,
    setIsDarkMode,
    getThemeClass,
  }
}
