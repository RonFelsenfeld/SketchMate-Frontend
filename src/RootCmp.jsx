import { AppHeader } from './components/general/AppHeader'
import { CanvasIndex } from './pages/CanvasIndex'

export function App() {
  return (
    <section className="app">
      <AppHeader />

      <main>
        <CanvasIndex />
      </main>
    </section>
  )
}
