import { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import API from '../../services/api';

const SupervisorTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { header: 'Task Title', accessor: 'title' },
    { header: 'Assigned To', accessor: 'assignedTo', render: (u) => u?.name || 'Unassigned' },
    { header: 'Assigned By', accessor: 'assignedBy', render: (u) => u?.name || 'System' },
    { header: 'Status', accessor: 'status', render: (status) => (
      <Badge variant={
        status === 'completed' ? 'success' : 
        status === 'in-progress' ? 'warning' : 
        'default'
      }>{status.replace('-', ' ').toUpperCase()}</Badge>
    ) },
    { header: 'Due Date', accessor: 'dueDate', render: (_, t) => new Date(t.deadline || t.createdAt).toLocaleDateString() }
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/supervisor/tasks');
      setTasks(res.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Global Task Roster</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor assignments across all teams</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
             <Loader size="lg" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 font-medium">
            No tasks found in the system
          </div>
        ) : (
          <Table 
            columns={columns}
            data={tasks}
            loading={false}
          />
        )}
      </div>
    </div>
  );
};

export default SupervisorTasks;
