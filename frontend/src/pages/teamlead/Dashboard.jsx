import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // ✅ ADDED
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import API from '../../services/api';

const TeamLeadDashboard = () => {
  const navigate = useNavigate(); // ✅ ADDED

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    myInterns: 12,
    pendingTasks: 8,
    pendingReports: 5,
    teamAvgScore: 4.3
  });

  const [recentInterns, setRecentInterns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [internsRes, tasksRes, reportsRes] = await Promise.all([
          API.get('/intern/'),
          API.get('/task/teamlead'),
          API.get('/report/')
        ]);
        
        const leaderboardRes = await API.get('/leaderboard');
        
        const myInterns = internsRes.data.filter(i => i.teamLeadId === API.getUserId?.() || true).length; // using all for now
        const pendingTasks = tasksRes.data.filter(t => t.status !== 'completed').length;
        const pendingReports = reportsRes.data.filter(r => r.status === 'pending').length;
        
        setStats({
          myInterns,
          pendingTasks,
          pendingReports,
          teamAvgScore: 4.8 // Kept mock average since we didn't implement it system-wide yet
        });
        
        const leaderboardData = leaderboardRes.data.slice(0, 5).map((intern) => ({
          name: intern.name,
          score: intern.totalMarks.toFixed(1),
          tasks: intern.submissions
        }));
        setRecentInterns(leaderboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
          Team Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Monitor your team's progress and performance metrics
        </p>
      </motion.div>

      {/* CARDS */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        <Card title="My Interns" value={stats.myInterns} trend={2.3} icon="👨‍🎓" />
        <Card title="Pending Tasks" value={stats.pendingTasks} trend={-1.2} icon="⏳" />
        <Card title="Pending Reports" value={stats.pendingReports} trend={5.8} icon="📋" variant="primary" />
        <Card title="Team Avg Score" value={stats.teamAvgScore} trend={8.1} icon="⭐" />
      </motion.div>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEADERBOARD */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Team Leaderboard (Top 5)
            </h3>

            <div className="space-y-3">
              {recentInterns.map((intern, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                    <span className="font-semibold text-emerald-700">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{intern.name}</p>
                    <p className="text-sm text-gray-600">
                      {intern.tasks} tasks completed
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      {intern.score}
                    </div>
                    <div className="text-xs text-gray-500">/ 5.0</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Actions
            </h3>

            <div className="space-y-3">
              
              {/* FIXED BUTTONS */}
              <button
                className="w-full btn-primary text-left py-3 px-4 rounded-xl"
                onClick={() => navigate('/teamlead/tasks')}
              >
                Assign New Task
              </button>

              <button
                className="w-full btn-outline text-left py-3 px-4 rounded-xl"
                onClick={() => navigate('/teamlead/reports')}
              >
                Review Reports
              </button>

              <button
                className="w-full btn-primary text-left py-3 px-4 rounded-xl"
                onClick={() => navigate('/teamlead/leaderboard')}
              >
                View Leaderboard
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamLeadDashboard;