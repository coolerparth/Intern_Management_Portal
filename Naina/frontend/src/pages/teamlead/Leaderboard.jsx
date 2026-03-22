import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import API from '../../services/api';

const TeamLeadLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // week, month, all-time

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setLeaderboard([
          { 
            rank: 1, name: 'Alice Johnson', score: 4.92, tasks: 28, reports: 8, trend: 12,
            avatar: 'AJ'
          },
          { 
            rank: 2, name: 'Mike Chen', score: 4.78, tasks: 25, reports: 7, trend: 8,
            avatar: 'MC'
          },
          { 
            rank: 3, name: 'Sarah Lee', score: 4.63, tasks: 22, reports: 6, trend: -2,
            avatar: 'SL'
          },
          { 
            rank: 4, name: 'David Kim', score: 4.51, tasks: 20, reports: 6, trend: 5,
            avatar: 'DK'
          },
          { 
            rank: 5, name: 'Emma Wilson', score: 4.42, tasks: 18, reports: 5, trend: 3,
            avatar: 'EW'
          }
        ]);
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-600 to-green-600 bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <p className="text-xl text-gray-600 mt-2">Top performers in {periods.find(p => p.value === period)?.label}</p>
        </div>
        <div className="flex gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg border">
          {periods.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                period === value
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Top 3 podium */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-4">
              <span className="text-2xl font-bold text-white shadow-2xl">🥇</span>
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">{leaderboard[0]?.name}</h3>
            <div className="text-3xl font-bold text-emerald-600 mb-4">{leaderboard[0]?.score}</div>
            <div className="space-y-1 text-sm text-gray-600 mb-6">
              <div>{leaderboard[0]?.tasks} tasks</div>
              <div>{leaderboard[0]?.reports} reports</div>
            </div>
            <Badge variant="success" className="px-4 py-1 text-sm">🏆 #1</Badge>
          </div>

          {/* Honorable mentions */}
          <div className="space-y-3">
            {[leaderboard[3], leaderboard[4]].map((intern, idx) => (
              <div key={intern.rank} className="flex items-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4 font-semibold text-gray-700">
                  #{intern.rank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{intern.name}</p>
                  <p className="text-sm text-gray-600">{intern.tasks} tasks</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-emerald-600">{intern.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Full Leaderboard</h3>
              <p className="text-gray-600">Complete ranking of all interns</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {leaderboard.slice(0, 10).map((intern, idx) => (
                <motion.div
                  key={intern.rank}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-8 py-6 hover:bg-emerald-50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 bg-gradient-to-r ${
                        intern.rank === 1 ? 'from-yellow-400 to-yellow-500' :
                        intern.rank === 2 ? 'from-gray-400 to-gray-500' :
                        intern.rank === 3 ? 'from-orange-400 to-orange-500' :
                        'from-gray-200 to-gray-300'
                      } rounded-2xl flex items-center justify-center shadow-lg font-bold text-white text-lg`}>
                        #{intern.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-emerald-700">{intern.name}</p>
                        <p className="text-sm text-gray-600">{intern.tasks} tasks • {intern.reports} reports</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                        {intern.score}
                      </div>
                      <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                        intern.trend >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {intern.trend >= 0 ? '↑' : '↓'}{Math.abs(intern.trend)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <Card title="Team Average" value="4.62" trend={3.2} icon="📊" />
        <Card title="Tasks Completed" value="156" trend={12} icon="✅" variant="primary" />
        <Card title="Improvement Rate" value="+8.4%" icon="📈" />
      </div>
    </div>
  );
};

export default TeamLeadLeaderboard;

