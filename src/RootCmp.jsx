import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { CanvasIndex } from './pages/CanvasIndex'
import { AppHeader } from './components/general/AppHeader'
import { HomePage } from './pages/HomePage'

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
      </section>
    </Router>
  )
}
