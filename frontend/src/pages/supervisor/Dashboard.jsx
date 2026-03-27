import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import API from '../../services/api';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: null, leaderboard: [] });
  
  // Lists
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [forms, setForms] = useState([]);

  // Modals state
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEverything();
  }, []);

  const fetchEverything = async () => {
    try {
      setLoading(true);
      const [dashRes, internsRes, tasksRes, reportsRes, formsRes] = await Promise.all([
        API.get('/supervisor/dashboard'),
        API.get('/supervisor/interns'),
        API.get('/supervisor/tasks'),
        API.get('/supervisor/reports'),
        API.get('/supervisor/forms')
      ]);

      setData(dashRes.data);
      setInterns(internsRes.data);
      setTasks(tasksRes.data);
      setReports(reportsRes.data);
      setForms(formsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFeedback = async () => {
    try {
      setSubmitting(true);
      await API.put(`/supervisor/report/feedback/${selectedReport._id}`, { feedbackBySupervisor: feedback });
      setShowFeedbackModal(false);
      fetchEverything();
    } catch (err) {
      console.error(err);
      alert('Failed to save feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const internColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Team Lead', accessor: 'teamLeadId', render: (lead) => lead ? lead.name : 'N/A' },
    { header: 'Role', accessor: 'role', render: () => <Badge variant="success">Intern</Badge> }
  ];

  const taskColumns = [
    { header: 'Task Title', accessor: 'title' },
    { header: 'Assigned To', accessor: 'assignedTo', render: (user) => user?.name || '' },
    { header: 'Status', accessor: 'status', render: (s) => <Badge variant={s==='completed'?'success':s==='in-progress'?'primary':'warning'}>{s}</Badge> },
    { header: 'Deadline', setAccessor: 'deadline', render: (date, row) => new Date(row.deadline).toLocaleDateString() }
  ];

  const reportColumns = [
    { header: 'Intern', accessor: 'internId', render: (intern) => intern?.name || '' },
    { header: 'Task', accessor: 'taskId', render: (task) => task?.title || 'General' },
    { header: 'Status', accessor: 'status', render: (s) => <Badge variant={s==='approved'?'success':s==='rejected'?'danger':'warning'}>{s}</Badge> },
    { header: 'Supervisor Review', accessor: 'reviewed', render: (r) => <Badge variant={r?'success':'default'}>{r?'Reviewed':'Pending'}</Badge> },
    { header: 'Actions', accessor: '_id', render: (_, row) => (
      <div className="space-x-2 flex">
        {row.filePath && <a href={`http://localhost:5000/${row.filePath.replace(/\\\\/g, '/')}`} target="_blank" className="text-emerald-600 hover:underline">View PDF</a>}
        <button onClick={() => { setSelectedReport(row); setFeedback(row.feedbackBySupervisor || ''); setShowFeedbackModal(true); }} className="text-blue-600 hover:underline">Leave Feedback</button>
      </div>
    )}
  ];

  if (loading) return <div className="p-20 flex justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
          Oversight Dashboard
        </h1>
        <p className="text-lg text-gray-600">Full system monitoring and evaluation</p>
      </motion.div>

      {/* STATS */}
      {data.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Total Interns" value={data.stats.totalInterns} trend={0} icon="👨🎓" />
          <Card title="Total Tasks" value={data.stats.totalTasks} trend={0} icon="📋" />
          <Card title="Pending Reports" value={data.stats.pendingReports} trend={0} icon="⏳" variant="warning" />
          <Card title="Evaluations" value={data.stats.completedEvaluations} trend={0} icon="⭐" variant="success" />
        </div>
      )}

      {/* LEADERBOARD & RECENT CRITICAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
           <h3 className="text-xl font-bold mb-6">Real-Time Leaderboard</h3>
           <div className="space-y-3">
              {data.leaderboard.length === 0 && <p className="text-gray-500 italic">No evaluated interns yet.</p>}
              {data.leaderboard.slice(0, 5).map((l, idx) => (
                 <div key={l._id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                   <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-bold text-indigo-700 mr-4">
                     #{idx + 1}
                   </div>
                   <div className="flex-1">
                     <p className="font-semibold">{l.name}</p>
                     <p className="text-xs text-gray-500">{l.submissions} Submissions Evaluated</p>
                   </div>
                   <div className="text-right">
                     <span className="text-xl font-bold text-indigo-600">{l.totalMarks.toFixed(1)}</span>
                   </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-full flex flex-col">
           <h3 className="text-xl font-bold mb-6">System Forms</h3>
           <div className="space-y-4 flex-1">
             {forms.slice(0, 4).map(f => (
               <div key={f._id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/form/${f._id}`)}>
                 <div>
                   <p className="font-semibold text-sm line-clamp-1">{f.title}</p>
                   <p className="text-xs text-gray-500">For: {f.targetRole}</p>
                 </div>
                 <Badge variant="primary">View</Badge>
               </div>
             ))}
           </div>
           <button className="w-full btn-outline mt-4" onClick={() => navigate('/supervisor/forms')}>Manage Forms</button>
        </div>
      </div>

      {/* INTERNS & TASKS */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
         <h3 className="text-xl font-bold mb-6">Intern Roster</h3>
         <Table columns={internColumns} data={interns} />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
         <h3 className="text-xl font-bold mb-6">Global Tasks</h3>
         <Table columns={taskColumns} data={tasks} />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
         <h3 className="text-xl font-bold mb-6">Global Reports & Feedback</h3>
         <Table columns={reportColumns} data={reports} />
      </div>

      <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title="Add Supervisor Oversight">
         <div className="space-y-4">
           {selectedReport && (
             <div className="bg-indigo-50 p-4 rounded-xl mb-4">
               <p className="text-sm"><strong>Intern:</strong> {selectedReport.internId?.name}</p>
               <p className="text-sm"><strong>Task:</strong> {selectedReport.taskId?.title}</p>
             </div>
           )}
           <label className="block text-sm font-semibold">Oversight Notes / Feedback</label>
           <textarea 
             rows={4}
             value={feedback}
             onChange={(e) => setFeedback(e.target.value)}
             className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
             placeholder="Include administrative overrides or feedback..."
           />
           <div className="flex justify-end space-x-3 pt-4 border-t">
             <button className="btn-outline px-6" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
             <button className="btn-primary px-8" onClick={handleSaveFeedback} disabled={submitting}>
               {submitting ? 'Saving...' : 'Finalize Feedback'}
             </button>
           </div>
         </div>
      </Modal>

    </div>
  );
};

export default SupervisorDashboard;
