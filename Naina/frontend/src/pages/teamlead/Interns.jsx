import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import API from '../../services/api';

const TeamLeadInterns = () => {
  const { user } = useAuth();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formLoading, setFormLoading] = useState(false);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (status) => <Badge variant="success">{status || 'Active'}</Badge> 
    }
  ];

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const res = await API.get('/intern/');
      // Filter interns assigned to this lead
      const filtered = res.data.filter(i => i.teamLeadId === user._id || i.teamLeadId === user.id);
      setInterns(filtered || []);
    } catch (error) {
      console.error('Error fetching interns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = {
        ...formData,
        teamLeadId: user._id || user.id
      };
      await API.post('/intern/create', data);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '' });
      fetchInterns();
    } catch (error) {
      console.error('Error creating intern:', error);
      alert(error.response?.data?.msg || 'Error creating intern');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Interns</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Create Intern
        </button>
      </div>

      {/* 🔹 Interns Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader size="lg" />
          </div>
        ) : interns.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 font-medium">
            No interns found
          </div>
        ) : (
          <Table 
            columns={columns}
            data={interns}
            loading={false}
          />
        )}
      </div>

      {/* 🔹 Create Intern Modal */}
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Intern"
        size="md"
      >
        <form onSubmit={handleCreate} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
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
              {formLoading ? 'Creating...' : 'Create Intern'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamLeadInterns;

