import { useStore } from '../store/useStore';
import { INITIAL_CAMPUS_DATA } from '../data/campus';
import { Trophy, Medal, TrendingDown, Leaf, Star, Crown, Award } from 'lucide-react';

export default function Leaderboard() {
  const { getDepartmentMetrics } = useStore();
  const metrics = getDepartmentMetrics();

  const leaderboardData = metrics.map((m, i) => {
    const dept = INITIAL_CAMPUS_DATA.flatMap(b => b.departments).find(d => d.id === m.departmentId);
    const building = INITIAL_CAMPUS_DATA.find(b => b.departments.some(d => d.id === m.departmentId));
    return {
      rank: i + 1,
      department: dept?.name || '',
      building: building?.name || '',
      chair: dept?.chair || '',
      reduction: m.reductionPercent,
      carbon: m.totalCarbonKgCO2e,
      energy: m.totalEnergyKWh,
      score: Math.round(m.reductionPercent * 10 + (100 - Math.min(m.anomalyCount * 5, 50))),
    };
  }).sort((a, b) => b.score - a.score).map((item, i) => ({ ...item, rank: i + 1 }));

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return { icon: <Crown className="w-5 h-5 text-yellow-400" />, bg: 'bg-yellow-500/10 border-yellow-500/30', text: 'text-yellow-400' };
      case 2: return { icon: <Medal className="w-5 h-5 text-slate-300" />, bg: 'bg-slate-500/10 border-slate-500/30', text: 'text-slate-300' };
      case 3: return { icon: <Award className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-600' };
      default: return { icon: <Star className="w-5 h-5 text-slate-500" />, bg: 'bg-slate-800 border-slate-700', text: 'text-slate-500' };
    }
  };

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-7 h-7 text-yellow-400" />
          Green Leaderboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">Monthly departmental carbon emission reduction rankings</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topThree.map((item, i) => {
          const badge = getRankBadge(item.rank);
          const heights = ['h-48', 'h-40', 'h-36'];
          const order = [1, 0, 2]; // Display 2nd, 1st, 3rd
          
          return (
            <div key={item.department} className={`flex flex-col items-center ${i === 1 ? 'md:order-first' : ''}`}>
              <div className={`${heights[order[i]]} w-full bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-2xl border border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${badge.bg} border mb-3`}>
                    {badge.icon}
                  </div>
                  <p className={`text-3xl font-bold ${badge.text} mb-1`}>#{item.rank}</p>
                  <p className="text-white font-semibold text-sm">{item.department}</p>
                  <p className="text-slate-400 text-xs mt-1">{item.building}</p>
                  <div className="mt-3 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-lg">{item.reduction.toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Score: {item.score}</p>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-b-lg py-2 text-center">
                <p className="text-xs text-slate-400">{item.chair}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Rankings Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            Full Rankings
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Department</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Chair</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Reduction</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Carbon (kg CO₂e)</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Score</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Badge</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item) => {
                const badge = getRankBadge(item.rank);
                return (
                  <tr key={item.department} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${badge.bg} border ${badge.text} font-bold text-sm`}>
                        {item.rank}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-white font-medium">{item.department}</p>
                      <p className="text-xs text-slate-500">{item.building}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{item.chair}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-medium ${
                        item.reduction > 15 ? 'text-emerald-400' : item.reduction > 10 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        <TrendingDown className="w-3 h-3" />
                        {item.reduction.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">{item.carbon.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-white font-bold">{item.score}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.rank <= 3 && (
                        <span className="inline-flex items-center gap-1 text-xs">
                          {item.rank === 1 && '🏆 Gold'}
                          {item.rank === 2 && '🥈 Silver'}
                          {item.rank === 3 && '🥉 Bronze'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scoring Methodology */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="text-white font-semibold mb-4">Scoring Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white font-medium">Reduction (70%)</span>
            </div>
            <p className="text-xs text-slate-400">
              Monthly percentage reduction in carbon emissions compared to baseline. Higher reduction = higher score.
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white font-medium">Efficiency (20%)</span>
            </div>
            <p className="text-xs text-slate-400">
              Absolute carbon footprint per department. Lower emissions contribute positively to ranking.
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white font-medium">Compliance (10%)</span>
            </div>
            <p className="text-xs text-slate-400">
              Fewer anomalies and alerts indicate better equipment management and scheduling compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
