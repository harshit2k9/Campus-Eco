import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Leaf, Zap, BarChart3, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@campus.edu');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const login = useStore(s => s.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials. Try: admin@campus.edu, sarah@campus.edu, or tech@campus.edu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Panel - Branding */}
        <div className="text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CampusEco</h1>
              <p className="text-emerald-300 text-sm">Smart Carbon & Energy Audit Platform</p>
            </div>
          </div>
          
          <p className="text-lg text-slate-300 leading-relaxed">
            Zero-hardware energy monitoring for academic campuses. Track, analyze, and reduce your department's carbon footprint in real-time.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Zap className="w-6 h-6 text-yellow-400 mb-2" />
              <p className="text-sm text-slate-300">Real-time telemetry every 60s</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <BarChart3 className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-sm text-slate-300">Department-level analytics</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Shield className="w-6 h-6 text-purple-400 mb-2" />
              <p className="text-sm text-slate-300">RBAC access control</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Leaf className="w-6 h-6 text-emerald-400 mb-2" />
              <p className="text-sm text-slate-300">15-25% waste reduction target</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-slate-400 mb-6">Access your campus energy dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="your.email@campus.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/25"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-500 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p><span className="text-emerald-400">Admin:</span> admin@campus.edu</p>
              <p><span className="text-blue-400">Chair:</span> sarah@campus.edu</p>
              <p><span className="text-purple-400">Technician:</span> tech@campus.edu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
