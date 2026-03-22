import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import API from '../../services/api';

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
        }, 1500);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Overview of your intern management system. Monitor users, tasks, and performance metrics.
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
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
          icon="✅"
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

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
          <div className="h-80 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">85%</span>
              </div>
              <p className="font-medium">Overall Completion Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {['John Doe submitted report', 'Team A completed milestone', 'Evaluation scores updated'].map((activity, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl group hover:bg-emerald-50 transition-colors">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm text-gray-900 font-medium">{activity}</span>
                <span className="ml-auto text-xs text-gray-500">2h ago</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;

