import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeContext } from './contexts/ThemeContext'

import { CanvasIndex } from './pages/CanvasIndex'
import { HomePage } from './pages/HomePage'
import { DynamicTooltip } from './components/general/DynamicTooltip'

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)

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
