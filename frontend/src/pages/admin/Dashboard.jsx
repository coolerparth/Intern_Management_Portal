import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalReports: 0,
    avgScore: 0
  });

  useEffect(() => {
    // Mock API calls
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setStats({
            totalUsers: 127,
            totalTasks: 456,
            totalReports: 89,
            avgScore: 4.2
          });
          setLoading(false);
        }, 1200);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader size="lg" color="green" />
        <p className="text-slate-400 font-medium text-sm animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">Overview of system health and performance across teams.</p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        <Card
          title="Total Interns"
          value={stats.totalUsers.toLocaleString()}
          trend={12.5}
          icon="👥"
          variant="primary"
        />
        <Card
          title="Active Tasks"
          value={stats.totalTasks.toLocaleString()}
          trend={8.2}
          icon="⚡"
        />
        <Card
          title="Reports Submitted"
          value={stats.totalReports.toLocaleString()}
          trend={-3.1}
          icon="📄"
        />
        <Card
          title="Avg Evaluation"
          value={stats.avgScore}
          trend={15.8}
          icon="⭐"
          variant="primary"
        />
      </motion.div>

      {/* Main Sections */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Performance Overview */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-10">
            <h3 className="text-lg font-bold text-slate-900">Performance Matrix</h3>
            <div className="flex space-x-2">
               <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Global</span>
               <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest">Regional</span>
            </div>
          </div>
          
          <div className="w-full h-[320px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center relative group">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg relative border-4 border-slate-100 transition-transform duration-500 group-hover:scale-105">
                 {/* Simple Progress Ring Visualization */}
                 <div className="absolute inset-0 rounded-full border-[6px] border-green-500 border-t-transparent animate-spin-slow rotate-45" />
                 <span className="text-4xl font-black text-green-600">85%</span>
              </div>
              <div className="text-center space-y-1">
                 <p className="font-bold text-slate-800 text-lg">System Completion Rate</p>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">+4.2% from previous week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stream */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col h-full"> 
          <h3 className="text-lg font-bold text-slate-900 mb-8 px-1">Recent Activity</h3>
          <div className="space-y-2 flex-1 scrollbar-hide overflow-y-auto max-h-[400px]">
            {['Sarah Parker submitted report', 'Alpha Team completed phase 2', 'Scores recalculated by Lead', 'New intern profile created'].map((activity, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-all group">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700 font-semibold group-hover:text-slate-900 transition-colors">{activity}</p>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">2h ago</div>
              </div>
            ))}
          </div>
          <button className="btn-outline w-full mt-8">
            View Activity Stream
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
