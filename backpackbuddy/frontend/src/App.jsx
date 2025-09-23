import Home from './pages/Home'
import { ThemeProvider } from './components/ThemeProvider'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="min-h-screen bg-background text-foreground">
        <Home />
      </main>
    </ThemeProvider>
  )
}

export default App
