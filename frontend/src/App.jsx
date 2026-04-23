import { ThemeProvider } from './ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Features from './components/Features'
import Pipeline from './components/Pipeline'
import Demo from './components/Demo'
import Architecture from './components/Architecture'
import Metrics from './components/Metrics'
import Footer from './components/Footer'

export default function App() {
  return (
    <ThemeProvider>
      <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background 0.3s' }}>
        <Navbar />
        <Hero />
        <Problem />
        <Features />
        <Pipeline />
        <Demo />
        <Architecture />
        <Metrics />
        <Footer />
      </div>
    </ThemeProvider>
  )
}
