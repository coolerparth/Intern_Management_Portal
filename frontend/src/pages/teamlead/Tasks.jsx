import { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const TeamLeadTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
  const [interns, setInterns] = useState([]);

  const columns = [
    { header: 'Task Title', accessor: 'title' },
    { header: 'Assigned To', accessor: 'assignedTo', render: (name) => name || 'Unassigned' },
    { header: 'Status', accessor: 'status', render: (status) => (
      <Badge variant={
        status === 'completed' ? 'success' : 
        status === 'in-progress' ? 'warning' : 
        'default'
      }>{status.replace('-', ' ').toUpperCase()}</Badge>
    ) },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Priority', accessor: 'priority', render: (priority) => (
      <Badge variant={priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'default'}>
        {(priority || 'medium').toUpperCase()}
      </Badge>
    ) }
  ];

  useEffect(() => {
    fetchTasks();
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await API.get('/intern/');
      // Filter interns assigned to this lead
      const filtered = res.data.filter(i => i.teamLeadId === user._id || i.teamLeadId === user.id);
      setInterns(filtered || []);
    } catch (error) {
      console.error('Error fetching interns:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/task/teamlead');
      const mappedTasks = res.data.map(t => ({
        ...t,
        id: t._id,
        assignedTo: t.assignedTo?.name || 'Unassigned',
        dueDate: new Date(t.deadline || t.createdAt).toISOString().split('T')[0],
        priority: 'medium' // Add priority to schema if needed, defaulting to medium for now
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        deadline: formData.deadline || new Date(Date.now() + 7*24*60*60*1000)
      };
      await API.post('/task/create', data);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Assign tasks to your interns and track progress</p>
        </div>
        <button 
          className="btn-primary px-8"
          onClick={() => setShowCreateModal(true)}
        >
          + New Task
        </button>
      </div>

      <Table 
        columns={columns}
        data={tasks}
        onRowClick={handleRowClick}
        loading={loading}
      />

      {/* Create Task Modal */}
      <Modal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Assign New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Week 4 Progress Report"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-vertical"
              placeholder="Detailed instructions..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign To *</label>
            <select
              required
              value={formData.assignedTo}
              onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Intern</option>
              {interns.map((intern) => (
                <option key={intern._id} value={intern._id}>
                  {intern.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" className="btn-outline px-6" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary px-8">
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Details Modal */}
      <Modal 
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title={selectedTask?.title}
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="warning" size="lg">{selectedTask.status.toUpperCase()}</Badge>
                  <div>
                    <p className="font-semibold text-lg">{selectedTask.assignedTo}</p>
                    <p className="text-sm text-gray-600">{selectedTask.dueDate}</p>
                  </div>
                </div>
                <Badge variant={selectedTask.priority === 'high' ? 'danger' : 'warning'}>
                  {selectedTask.priority.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="prose max-w-none">
              <p>Task description and details would go here...</p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button className="btn-outline px-6">Close</button>
              <button className={`px-6 py-2.5 rounded-xl font-medium shadow-lg ${selectedTask.status === 'completed' ? 'btn-success' : 'btn-primary'}`}>
                Mark as {selectedTask.status === 'completed' ? 'Reopened' : 'Completed'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeamLeadTasks;

