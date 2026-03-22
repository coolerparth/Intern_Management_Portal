import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import API from '../../services/api';

const InternDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 15,
    completedTasks: 12,
    pendingTasks: 3,
    avgScore: 4.5
  });
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setStats({
            totalTasks: 15,
            completedTasks: 12,
            pendingTasks: 3,
            avgScore: 4.5
          });
          setRecentTasks([
            { title: 'Week 3 Report', status: 'pending', deadline: 'Tomorrow' },
            { title: 'Project Update', status: 'completed', deadline: 'Done' },
            { title: 'Code Review', status: 'in-progress', deadline: '2 days' }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error:', error);
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
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
          Welcome Back!
        </h1>
        <p className="text-xl text-gray-600 max-w-xl">
          Here's what's happening with your internship progress
        </p>
      </motion.div>

      {/* Personal Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card 
          title="Total Tasks" 
          value={stats.totalTasks} 
          trend={12}
          icon="📝"
          variant="primary"
        />
        <Card 
          title="Completed" 
          value={stats.completedTasks} 
          trend={18}
          icon="✅"
        />
        <Card 
          title="Pending" 
          value={stats.pendingTasks}
          icon="⏳"
          variant="primary"
        />
        <Card 
          title="Avg Score" 
          value={stats.avgScore}
          trend={5}
          icon="⭐"
        />
      </motion.div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Progress */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
            <Badge variant="success">View All</Badge>
          </div>
          <div className="space-y-4">
            {recentTasks.map((task, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm">
                  {task.status === 'completed' ? '✅' : task.status === 'pending' ? '⏳' : '⚡'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.deadline}</p>
                </div>
                <Badge variant={task.status === 'completed' ? 'success' : task.status === 'pending' ? 'warning' : 'default'}>
                  {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-8">Your Performance</h3>
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-xl mb-4">
                <span className="text-2xl font-bold text-white">92%</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">Overall Progress</h4>
              <p className="text-gray-600">You're doing great!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-600">Tasks On Time</p>
                <p className="text-2xl font-bold text-emerald-600">95%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-blue-600">1.2 days</p>
              </div>
            </div>
            <div className="pt-6">
              <button className="w-full btn-primary">Submit Weekly Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;

