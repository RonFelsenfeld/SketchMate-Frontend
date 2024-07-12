import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { utilService } from './services/util.service'
import { ThemeContext } from './contexts/ThemeContext'

import { CanvasIndex } from './pages/CanvasIndex'
import { HomePage } from './pages/HomePage'
import { DynamicTooltip } from './components/general/DynamicTooltip'

export function App() {
  // If local storage has theme -> set dark mode on
  const [isDarkMode, setIsDarkMode] = useState(utilService.loadFromStorage('themeDB') || false)

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <Router>
        <section className={`app ${isDarkMode ? 'dark' : ''}`}>
          <main>
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<CanvasIndex />} path="/canvas" />
            </Routes>
          </main>

          <DynamicTooltip />
        </section>
      </Router>
    </ThemeContext.Provider>
  )
}
