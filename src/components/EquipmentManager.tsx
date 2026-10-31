import { useState } from 'react';
import { useStore } from '../store/useStore';
import { INITIAL_CAMPUS_DATA } from '../data/campus';
import { Equipment } from '../types';
import { Plus, Edit2, Trash2, Power, Search, Filter, Cpu, X } from 'lucide-react';

export default function EquipmentManager() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment, toggleEquipment, user } = useStore();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', wattage: 0, startHour: 8, endHour: 18,
    efficiencyFactor: 0.85, roomId: '', isActive: true, scheduleMultiplier: 1,
  });

  const departments = INITIAL_CAMPUS_DATA.flatMap(b => b.departments);
  const rooms = INITIAL_CAMPUS_DATA.flatMap(b => b.departments).flatMap(d => d.labs).flatMap(l => l.rooms);

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase());
    if (filterDept === 'all') return matchesSearch;
    const room = rooms.find(r => r.id === eq.roomId);
    if (!room) return matchesSearch;
    const lab = INITIAL_CAMPUS_DATA.flatMap(b => b.departments).flatMap(d => d.labs).find(l => l.id === room.labId);
    return matchesSearch && lab?.departmentId === filterDept;
  });

  const getRoomName = (roomId: string) => rooms.find(r => r.id === roomId)?.name || roomId;
  const getLabName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return '';
    const lab = INITIAL_CAMPUS_DATA.flatMap(b => b.departments).flatMap(d => d.labs).find(l => l.id === room.labId);
    return lab?.name || '';
  };
  const getDeptName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return '';
    const lab = INITIAL_CAMPUS_DATA.flatMap(b => b.departments).flatMap(d => d.labs).find(l => l.id === room.labId);
    if (!lab) return '';
    const dept = departments.find(d => d.id === lab.departmentId);
    return dept?.name || '';
  };

  const handleSave = () => {
    const eqData = {
      name: formData.name,
      wattage: formData.wattage,
      operatingHours: { start: formData.startHour, end: formData.endHour },
      efficiencyFactor: formData.efficiencyFactor,
      roomId: formData.roomId,
      isActive: formData.isActive,
      scheduleMultiplier: formData.scheduleMultiplier,
    };
    if (editingId) {
      updateEquipment(editingId, eqData);
    } else {
      addEquipment(eqData);
    }
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (eq: Equipment) => {
    setFormData({
      name: eq.name, wattage: eq.wattage, startHour: eq.operatingHours.start,
      endHour: eq.operatingHours.end, efficiencyFactor: eq.efficiencyFactor,
      roomId: eq.roomId, isActive: eq.isActive, scheduleMultiplier: eq.scheduleMultiplier,
    });
    setEditingId(eq.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', wattage: 0, startHour: 8, endHour: 18, efficiencyFactor: 0.85, roomId: rooms[0]?.id || '', isActive: true, scheduleMultiplier: 1 });
  };

  const totalWattage = filteredEquipment.reduce((s, e) => s + (e.isActive ? e.wattage : 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipment Inventory</h1>
          <p className="text-slate-400 text-sm mt-1">Manage lab devices, power ratings & operating schedules</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Total Devices</p>
          <p className="text-2xl font-bold text-white mt-1">{filteredEquipment.length}</p>
          <p className="text-xs text-slate-500 mt-1">{filteredEquipment.filter(e => e.isActive).length} active</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Total Rated Power</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{(totalWattage / 1000).toFixed(1)} kW</p>
          <p className="text-xs text-slate-500 mt-1">Active equipment only</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Est. Daily Energy</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{(totalWattage * 10 / 1000).toFixed(1)} kWh</p>
          <p className="text-xs text-slate-500 mt-1">Based on 10hr avg operation</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search equipment..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Device</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Location</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Wattage</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Hours</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Efficiency</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map(eq => (
                <tr key={eq.id} className="border-t border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-white font-medium">{eq.name}</p>
                        <p className="text-xs text-slate-500">{getDeptName(eq.roomId)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-300 text-xs">{getLabName(eq.roomId)}</p>
                    <p className="text-slate-500 text-xs">{getRoomName(eq.roomId)}</p>
                  </td>
                  <td className="py-3 px-4 text-right text-yellow-400 font-mono">{eq.wattage}W</td>
                  <td className="py-3 px-4 text-right text-slate-300 font-mono">{eq.operatingHours.start}:00-{eq.operatingHours.end}:00</td>
                  <td className="py-3 px-4 text-right text-slate-300">{(eq.efficiencyFactor * 100).toFixed(0)}%</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleEquipment(eq.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        eq.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-500'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      {eq.isActive ? 'ON' : 'OFF'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(eq)}
                        className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEquipment(eq.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Edit Equipment' : 'Add New Equipment'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Device Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="e.g., NVIDIA A100 Server"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Wattage (W)</label>
                  <input
                    type="number"
                    value={formData.wattage}
                    onChange={e => setFormData({ ...formData, wattage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Efficiency (η)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.efficiencyFactor}
                    onChange={e => setFormData({ ...formData, efficiencyFactor: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Start Hour (0-23)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.startHour}
                    onChange={e => setFormData({ ...formData, startHour: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">End Hour (0-23)</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={formData.endHour}
                    onChange={e => setFormData({ ...formData, endHour: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Room</label>
                <select
                  value={formData.roomId}
                  onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50"
                  />
                  <span className="text-sm text-slate-300">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                {editingId ? 'Update' : 'Add Equipment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
