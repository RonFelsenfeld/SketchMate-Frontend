import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { CanvasIndex } from './pages/CanvasIndex'
import { HomePage } from './pages/HomePage'
import { AppHeader } from './components/general/AppHeader'
import { DynamicTooltip } from './components/general/DynamicTooltip'

export function App() {
  return (
    <Router>
      <section className="app">
        <AppHeader />

        <main>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<CanvasIndex />} path="/canvas" />
          </Routes>
        </main>

        <DynamicTooltip />
      </section>
    </Router>
  )
}
