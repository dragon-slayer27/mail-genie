import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Compose } from './pages/Compose'
import { History } from './pages/History'
import { Settings } from './pages/Settings'
import { useEffect } from 'react'
import { useSettingsStore } from './stores/settingsStore'

export default function App() {
  const loadSettings = useSettingsStore(state => state.loadSettings)

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="compose" element={<Compose />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
