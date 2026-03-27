import { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import API from '../../services/api';
import { motion } from 'framer-motion';

const InternTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [status, setStatus] = useState('');

  const columns = [
    { header: 'Task', accessor: 'title' },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Priority', accessor: 'priority', render: (priority) => (
      <Badge variant={priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'default'}>
        {priority?.toUpperCase()}
      </Badge>
    ) },
    { header: 'Status', accessor: 'status', render: (status) => (
      <Badge variant={
        status === 'completed' ? 'success' :
        status === 'in-progress' ? 'warning' :
        'default'
      }>
        {status?.replace('-', ' ').toUpperCase()}
      </Badge>
    ) },
    { header: 'Actions', accessor: 'actions', render: () => (
      <button className="btn-primary text-sm px-4 py-1.5" onClick={() => setShowModal(true)}>
        Update
      </button>
    ) }
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await API.get('/task/my');
      setTasks(response.data || [
        { 
          id: 1, title: 'Week 4 Progress Report', dueDate: '2024-01-20', priority: 'high', status: 'pending' 
        },
        { 
          id: 2, title: 'API Documentation', dueDate: '2024-01-18', priority: 'medium', status: 'in-progress' 
        },
        { 
          id: 3, title: 'Code Review', dueDate: '2024-01-15', priority: 'low', status: 'completed' 
        }
      ]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Fallback data
      setTasks([
        { id: 1, title: 'Week 4 Progress Report', dueDate: '2024-01-20', priority: 'high', status: 'pending' },
        { id: 2, title: 'API Documentation', dueDate: '2024-01-18', priority: 'medium', status: 'in-progress' },
        { id: 3, title: 'Code Review', dueDate: '2024-01-15', priority: 'low', status: 'completed' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async () => {
    if (selectedTask && status) {
      try {
        // await API.put(`/task/${selectedTask.id}`, { status });
        setTasks(tasks.map(task => 
          task.id === selectedTask.id ? { ...task, status } : task
        ));
        setShowModal(false);
        setStatus('');
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setStatus(task.status);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">Track your assigned tasks and progress</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline px-6" onClick={fetchTasks}>
            🔄 Refresh
          </button>
        </div>
      </motion.div>

      <Table 
        columns={columns}
        data={tasks}
        loading={loading}
        onRowClick={handleRowClick}
      />

      {/* Update Status Modal */}
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Update ${selectedTask?.title}`}
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
                selectedTask?.status === 'completed' ? 'bg-emerald-500' :
                selectedTask?.status === 'in-progress' ? 'bg-yellow-500' :
                'bg-gray-400'
              }`}>
                {selectedTask?.status === 'completed' ? '✅' : selectedTask?.status === 'in-progress' ? '⏳' : '📝'}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-1">{selectedTask?.title}</h3>
                <p className="text-gray-600">Due {selectedTask?.dueDate}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 shadow-sm transition-all"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              Notes (Optional)
            </label>
            <textarea
              rows="3"
              className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-vertical bg-blue-50/50"
              placeholder="Any comments about this task..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button 
              className="btn-outline px-8"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button 
              className="btn-primary px-8"
              onClick={updateTaskStatus}
            >
              Update Status
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InternTasks;

