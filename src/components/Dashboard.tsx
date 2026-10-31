import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { INITIAL_CAMPUS_DATA } from '../data/campus';
import { formatEnergy, formatCarbon } from '../utils/carbon';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Zap, Leaf, AlertTriangle, TrendingDown, Activity, Building2 } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const { events, alerts, getDepartmentMetrics, getHourlyData, isSimulating, startSimulation, stopSimulation, tickCount } = useStore();

  const metrics = getDepartmentMetrics();
  const hourlyData = getHourlyData();

  const totals = useMemo(() => {
    const recentEvents = events.slice(-500);
    const totalEnergy = recentEvents.reduce((s, e) => s + e.energyKWh, 0);
    const totalCarbon = recentEvents.reduce((s, e) => s + e.carbonKgCO2e, 0);
    const anomalyCount = alerts.filter(a => !a.acknowledged).length;
    const avgReduction = metrics.reduce((s, m) => s + m.reductionPercent, 0) / (metrics.length || 1);
    return { totalEnergy, totalCarbon, anomalyCount, avgReduction };
  }, [events, alerts, metrics]);

  const pieData = useMemo(() => {
    return metrics.map((m, i) => {
      const dept = INITIAL_CAMPUS_DATA.flatMap(b => b.departments).find(d => d.id === m.departmentId);
      return {
        name: dept?.name || m.departmentId,
        value: parseFloat(m.totalCarbonKgCO2e.toFixed(2)),
        color: COLORS[i % COLORS.length],
      };
    });
  }, [metrics]);

  const deptChartData = useMemo(() => {
    return metrics.map((m, i) => {
      const dept = INITIAL_CAMPUS_DATA.flatMap(b => b.departments).find(d => d.id === m.departmentId);
      return {
        name: dept?.name?.split(' ')[0] || '',
        energy: parseFloat(m.totalEnergyKWh.toFixed(2)),
        carbon: parseFloat(m.totalCarbonKgCO2e.toFixed(2)),
        reduction: parseFloat(m.reductionPercent.toFixed(1)),
        color: COLORS[i % COLORS.length],
      };
    });
  }, [metrics]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Energy Analytics Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time campus energy & carbon monitoring</p>
        </div>
        <button
          onClick={isSimulating ? stopSimulation : startSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            isSimulating
              ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
        >
          <Activity className={`w-4 h-4 ${isSimulating ? 'animate-pulse' : ''}`} />
          {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<Zap className="w-5 h-5" />}
          label="Total Energy"
          value={formatEnergy(totals.totalEnergy)}
          sublabel="Last 500 readings"
          color="yellow"
        />
        <KPICard
          icon={<Leaf className="w-5 h-5" />}
          label="Carbon Footprint"
          value={formatCarbon(totals.totalCarbon)}
          sublabel="CO₂e emissions"
          color="emerald"
        />
        <KPICard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Active Alerts"
          value={totals.anomalyCount.toString()}
          sublabel="Unacknowledged"
          color="red"
        />
        <KPICard
          icon={<TrendingDown className="w-5 h-5" />}
          label="Avg. Reduction"
          value={`${totals.avgReduction.toFixed(1)}%`}
          sublabel="vs. baseline"
          color="blue"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Over Time */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Hourly Energy Consumption (kWh)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tickFormatter={h => `${h}:00`} />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
                labelFormatter={h => `${h}:00`}
              />
              <Area type="monotone" dataKey="energy" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Energy (kWh)" />
              <Area type="monotone" dataKey="baseline" stroke="#64748b" fill="#64748b" fillOpacity={0.05} name="Baseline" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Carbon by Department Pie */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            Carbon by Department
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                formatter={(value: number) => [`${value} kg CO₂e`, '']}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px' }}
                formatter={(value) => <span className="text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Comparison */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            Department Energy Comparison
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="energy" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Energy (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reduction Performance */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            Monthly Reduction Performance
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" unit="%" />
              <YAxis type="category" dataKey="name" stroke="#64748b" width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(value: number) => [`${value}%`, 'Reduction']}
              />
              <Bar dataKey="reduction" radius={[0, 4, 4, 0]} name="Reduction %" fill="#10b981">
                {deptChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.reduction > 15 ? '#10b981' : entry.reduction > 10 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-400" />
          Department Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Department</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Energy (kWh)</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Carbon (kg CO₂e)</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Reduction</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Anomalies</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => {
                const dept = INITIAL_CAMPUS_DATA.flatMap(b => b.departments).find(d => d.id === m.departmentId);
                return (
                  <tr key={m.departmentId} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-white font-medium">{dept?.name}</td>
                    <td className="py-3 px-4 text-right text-slate-300">{m.totalEnergyKWh.toFixed(3)}</td>
                    <td className="py-3 px-4 text-right text-slate-300">{m.totalCarbonKgCO2e.toFixed(3)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        m.reductionPercent > 15 ? 'bg-emerald-500/10 text-emerald-400' :
                        m.reductionPercent > 10 ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {m.reductionPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">{m.anomalyCount}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-xs ${m.anomalyCount > 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${m.anomalyCount > 0 ? 'bg-yellow-400' : 'bg-emerald-400'}`}></span>
                        {m.anomalyCount > 0 ? 'Warning' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sublabel, color }: { icon: React.ReactNode; label: string; value: string; sublabel: string; color: string }) {
  const colorClasses: Record<string, string> = {
    yellow: 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-yellow-400',
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    red: 'from-red-500/10 to-red-600/5 border-red-500/20 text-red-400',
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${colorClasses[color].split(' ').pop()}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>
    </div>
  );
}
