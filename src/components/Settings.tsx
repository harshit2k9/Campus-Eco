import { useStore } from '../store/useStore';
import { GRID_INTENSITY_FACTORS } from '../utils/carbon';
import { Globe, Database, Bell, Shield, Cpu, Info } from 'lucide-react';

export default function Settings() {
  const { region, setRegion, user } = useStore();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure platform parameters and regional factors</p>
      </div>

      {/* Regional Settings */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          Regional Carbon Intensity
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Select your regional grid carbon intensity factor for accurate CO₂e calculations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(GRID_INTENSITY_FACTORS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setRegion(key)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                region === key
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="text-sm font-medium">{key.replace(/_/g, ' ')}</span>
              <span className="text-xs font-mono">{value} kg CO₂e/kWh</span>
            </button>
          ))}
        </div>
        <div className="mt-4 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
          <p className="text-xs text-blue-300 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Current factor: <strong>{GRID_INTENSITY_FACTORS[region]} kg CO₂e/kWh</strong> applied to all carbon calculations.
          </p>
        </div>
      </div>

      {/* System Architecture */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          System Architecture
        </h3>
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Data Pipeline</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">Telemetry Generator</span>
              <span>→</span>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">Carbon Engine</span>
              <span>→</span>
              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded">Analytics Store</span>
              <span>→</span>
              <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded">Dashboard</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Mathematical Models</h4>
            <div className="space-y-2 text-xs text-slate-400 font-mono">
              <p>E(t) = P<sub>rated</sub> × S(t) × η</p>
              <p className="text-slate-500 pl-4">Energy = Wattage × Schedule × Efficiency</p>
              <p className="mt-2">CO₂e = E(t) × Grid_Intensity_Factor</p>
              <p className="text-slate-500 pl-4">Carbon = Energy × Regional Factor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Configuration */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          Alert Thresholds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-white font-medium mb-1">Anomaly Detection</p>
            <p className="text-xs text-slate-400">Triggered when consumption exceeds 150% of baseline</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '150%' }}></div>
              </div>
              <span className="text-xs text-red-400 font-mono">150%</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-white font-medium mb-1">Off-Peak Detection</p>
            <p className="text-xs text-slate-400">Flags equipment running outside scheduled hours (before 8am or after 6pm)</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-yellow-400">
              <span>Active: Weekdays 18:00-08:00, Weekends 24/7</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-white font-medium mb-1">Weekend Alert</p>
            <p className="text-xs text-slate-400">Critical severity for any equipment active during Saturday/Sunday</p>
            <div className="mt-2">
              <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">Severity: Critical</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-white font-medium mb-1">Department Threshold</p>
            <p className="text-xs text-slate-400">Warning when department approaches 80% of allocated energy budget</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <span className="text-xs text-yellow-400 font-mono">80%</span>
            </div>
          </div>
        </div>
      </div>

      {/* RBAC Info */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Role-Based Access Control
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-sm text-white font-medium">Administrator</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Full system access</li>
              <li>• Manage all departments</li>
              <li>• Configure thresholds</li>
              <li>• View all analytics</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white font-medium">Department Chair</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Department-level view</li>
              <li>• Manage own labs</li>
              <li>• View leaderboard</li>
              <li>• Acknowledge alerts</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white font-medium">Lab Technician</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Lab-level access</li>
              <li>• Manage equipment</li>
              <li>• View room metrics</li>
              <li>• Report issues</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
          <p className="text-xs text-emerald-300">
            Current session: <strong>{user?.name}</strong> ({user?.role})
          </p>
        </div>
      </div>
    </div>
  );
}
