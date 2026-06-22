import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Settings, Clock, Edit, Sparkles, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import logoIcon from '../../../public/icon.png'

export function Layout() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Sparkles className="w-5 h-5" /> },
    { name: 'Compose', path: '/compose', icon: <Edit className="w-5 h-5" /> },
    { name: 'History', path: '/history', icon: <Clock className="w-5 h-5" /> },
  ]

  return (
    <div className="flex h-screen w-full bg-sidebar text-text antialiased relative overflow-hidden">
      {/* Organic Noise Texture Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <aside className={`${isCollapsed ? 'w-[64px]' : 'w-56'} transition-all duration-300 border-r border-border/60 bg-transparent flex flex-col select-none relative z-10 shadow-[inset_-1px_0_0_rgba(0,0,0,0.02)]`}>
        <div className={`p-3 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} h-[56px] overflow-hidden`}>
          <img src={logoIcon} alt="Mail Genie Logo" className="w-6 h-6 rounded-md object-contain shrink-0 shadow-sm" />
          <h1 className={`text-[15px] font-semibold tracking-tight text-text whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Mail Genie
          </h1>
        </div>
        <nav className="flex-1 px-2 py-1.5 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5 px-2.5'} py-1.5 rounded-md text-xs transition-colors duration-150 ${isActive
                    ? 'bg-surface text-text font-semibold shadow-sm border border-border/80'
                    : 'text-text-muted hover:bg-surface/50 hover:text-text border border-transparent'
                  }`}
              >
                <div className={`transition-colors shrink-0 ${isActive ? 'text-text' : 'text-text-muted'}`}>
                  {item.icon}
                </div>
                <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Compact Footer: Settings + Collapse */}
        <div className="p-2 border-t border-border/50 space-y-0.5">
          <Link
            to="/settings"
            title={isCollapsed ? "Settings" : undefined}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5 px-2.5'} py-1.5 rounded-md text-xs transition-colors duration-150 ${location.pathname === '/settings'
                ? 'bg-surface text-text font-semibold shadow-sm border border-border/80'
                : 'text-text-muted hover:bg-surface/50 hover:text-text border border-transparent'
              }`}
          >
            <div className={`transition-colors shrink-0 ${location.pathname === '/settings' ? 'text-text' : 'text-text-muted'}`}>
              <Settings className="w-4 h-4" />
            </div>
            <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
              Settings
            </span>
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5 px-2.5'} py-1.5 text-text-muted hover:text-text hover:bg-surface/50 rounded-md transition-colors border border-transparent`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <div className="shrink-0">
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
              Collapse
            </span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-surface relative z-10 m-2 rounded-xl shadow-lg border border-border/50">
        <Outlet />
      </main>
    </div>
  )
}
