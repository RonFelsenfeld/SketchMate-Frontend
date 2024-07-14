import { useContext, useEffect } from 'react'
import { utilService } from '../services/util.service'
import { ThemeContext } from '../contexts/ThemeContext'

export function useTheme() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext)

  // Saving theme in local storage
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
