import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import API from '../../services/api';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'teamlead' });
  const [formLoading, setFormLoading] = useState(false);

  // Requirement: Display all team leads in a table
  const teamLeads = users.filter(u => u.role === 'teamlead');

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Created At', 
      accessor: 'createdAt', 
      render: (date) => <span>{date ? new Date(date).toLocaleDateString() : 'N/A'}</span> 
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (status) => <Badge variant="success">{status || 'Active'}</Badge> 
    }
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users');
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // POST to /users/create or /teamlead/create (server handles /users/create)
      await API.post('/users/create', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'teamlead' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating team lead:', error);
      alert(error.response?.data?.msg || 'Error creating team lead');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Team Leads</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Create Team Lead
        </button>
      </div>

      {/* 🔹 Team Leads Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader size="lg" />
          </div>
        ) : teamLeads.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 font-medium">
            No team leads found
          </div>
        ) : (
          <Table 
            columns={columns}
            data={teamLeads}
            loading={false}
          />
        )}
      </div>

      {/* 🔹 Create Team Lead Modal */}
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Team Lead"
        size="md"
      >
        <form onSubmit={handleCreate} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Full Name"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Email Address"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Password"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              className="btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button 
              disabled={formLoading}
              type="submit"
              className="btn-primary"
            >
              {formLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
