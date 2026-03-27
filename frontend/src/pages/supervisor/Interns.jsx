import { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import API from '../../services/api';

const SupervisorInterns = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Team Lead', accessor: 'teamLeadId', render: (lead) => lead ? lead.name : 'Unassigned' },
    { 
      header: 'Role', 
      accessor: 'role', 
      render: (role) => <Badge variant="success">{role}</Badge> 
    }
  ];

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const res = await API.get('/supervisor/interns');
      setInterns(res.data || []);
    } catch (error) {
      console.error('Error fetching interns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Global Intern Roster</h1>
          <p className="text-gray-500 text-sm mt-1">View all interns across every team</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
             <Loader size="lg" />
          </div>
        ) : interns.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 font-medium">
            No interns found in the system
          </div>
        ) : (
          <Table 
            columns={columns}
            data={interns}
            loading={false}
          />
        )}
      </div>
    </div>
  );
};

export default SupervisorInterns;
