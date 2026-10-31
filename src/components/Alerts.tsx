import { useStore } from '../store/useStore';
import { AlertTriangle, Bell, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import { useState } from 'react';
import { Alert } from '../types';

export default function Alerts() {
  const { alerts, acknowledgeAlert, clearAcknowledged } = useStore();
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(a => {
    const ackMatch = filter === 'all' ? true : filter === 'acknowledged' ? a.acknowledged : !a.acknowledged;
    const sevMatch = severityFilter === 'all' || a.severity === severityFilter;
    return ackMatch && sevMatch;
  });

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'medium': return <Bell className="w-5 h-5 text-yellow-400" />;
      default: return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500/30 bg-red-500/5';
      case 'high': return 'border-orange-500/30 bg-orange-500/5';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/5';
      default: return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  const getTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'idle_load': return 'Idle Load';
      case 'threshold_exceeded': return 'Threshold';
      case 'weekend_activity': return 'Weekend Activity';
      case 'anomaly': return 'Anomaly';
    }
  };

  const unacknowledged = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts & Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">Automated idle load detection & threshold alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-500/20">
            {unacknowledged} Active
          </span>
          <button
            onClick={clearAcknowledged}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Clear Acknowledged
          </button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl border border-red-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Critical</span>
          </div>
          <p className="text-2xl font-bold text-white">{alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-orange-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">High</span>
          </div>
          <p className="text-2xl font-bold text-white">{alerts.filter(a => a.severity === 'high' && !a.acknowledged).length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-yellow-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Medium</span>
          </div>
          <p className="text-2xl font-bold text-white">{alerts.filter(a => a.severity === 'medium' && !a.acknowledged).length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-blue-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Low</span>
          </div>
          <p className="text-2xl font-bold text-white">{alerts.filter(a => a.severity === 'low' && !a.acknowledged).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
            {(['all', 'unacknowledged', 'acknowledged'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  filter === f ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-white font-medium">No alerts to display</p>
            <p className="text-slate-400 text-sm mt-1">
              {alerts.length === 0 ? 'Start the simulation to generate alerts' : 'All alerts have been filtered out'}
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 transition-all ${getSeverityColor(alert.severity)} ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {getTypeLabel(alert.type)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-white">{alert.message}</p>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.acknowledged && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <CheckCircle className="w-3 h-3" />
                    Acknowledged
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Alert Detection Logic
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="flex items-start gap-2">
            <span className="text-red-400">●</span>
            <p><strong className="text-slate-300">Anomaly:</strong> Equipment consuming &gt;150% of baseline power draw</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400">●</span>
            <p><strong className="text-slate-300">Idle Load:</strong> Equipment running outside scheduled hours</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400">●</span>
            <p><strong className="text-slate-300">Weekend Activity:</strong> Equipment active during weekends (critical)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-400">●</span>
            <p><strong className="text-slate-300">Threshold:</strong> Department approaching energy consumption limits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
