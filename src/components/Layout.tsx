import { ReactNode } from 'react';
import { useStore } from '../store/useStore';
import { Leaf, LayoutDashboard, Cpu, Bell, Trophy, Settings, LogOut, Activity } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout, isSimulating, tickCount, alerts } = useStore();
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'equipment', label: 'Equipment', icon: Cpu },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unacknowledgedAlerts },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CampusEco</h1>
              <p className="text-xs text-slate-500">Energy Audit Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge ? (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Simulation Status */}
        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isSimulating ? 'bg-emerald-500/10' : 'bg-slate-800'}`}>
            <Activity className={`w-4 h-4 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className={`text-xs ${isSimulating ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isSimulating ? `Live • ${tickCount} ticks` : 'Paused'}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
