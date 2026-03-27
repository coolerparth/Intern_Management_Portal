import { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import API from '../../services/api';

const SupervisorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback Modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await API.get('/supervisor/reports');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedback = (report) => {
    setSelectedReport(report);
    setFeedback(report.feedbackBySupervisor || "");
    setShowModal(true);
  };

  const handleSaveFeedback = async () => {
    try {
      setSubmitting(true);
      await API.put(`/supervisor/report/feedback/${selectedReport._id}`, { feedbackBySupervisor: feedback });
      setShowModal(false);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert('Failed to save feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Intern', 
      accessor: 'intern',
      render: (_, row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.internId?.name}</p>
          <p className="text-xs text-gray-500">{row.internId?.email}</p>
        </div>
      )
    },
    { header: 'Task / Title', accessor: 'title', render: (_, row) => row.taskId?.title || row.title },
    { header: 'Submission Date', accessor: 'submittedAt', render: (date) => new Date(date).toLocaleDateString() },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status) => (
        <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning'}>
          {status}
        </Badge>
      )
    },
    {
      header: 'Review Status',
      accessor: 'reviewed',
      render: (reviewed) => (
        <Badge variant={reviewed ? 'success' : 'default'}>
          {reviewed ? 'Reviewed' : 'Needs Review'}
        </Badge>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: (_, row) => (
        <div className="flex space-x-2 items-center">
          {row.filePath && (
             <a 
               href={`http://localhost:5000/${row.filePath.replace(/\\\\/g, '/')}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-sm text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap"
             >
               View File
             </a>
          )}
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium ml-3 whitespace-nowrap"
            onClick={() => handleOpenFeedback(row)}
          >
            Review & Add Feedback
          </button>
        </div>
      )
    }
  ];

  if (loading) return <div className="p-10 flex justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Global Progress Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Review all intern submissions and append oversight</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[300px]">
        {reports.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 font-medium">
            No reports found in the system
          </div>
        ) : (
          <Table columns={columns} data={reports} />
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Oversight Notes" size="md">
        {selectedReport && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-xl border border-indigo-100">
               <p className="text-sm mb-1"><span className="font-semibold text-gray-700">Intern:</span> {selectedReport.internId?.name}</p>
               <p className="text-sm mb-1"><span className="font-semibold text-gray-700">Task:</span> {selectedReport.taskId?.title}</p>
               <p className="text-sm"><span className="font-semibold text-gray-700">Lead's Status:</span> {selectedReport.status}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Supervisor Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Optionally attach oversight notes or corrective feedback..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button" 
                className="btn-outline px-6" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary px-8" 
                disabled={submitting}
                onClick={handleSaveFeedback}
              >
                {submitting ? 'Saving...' : 'Attach Comments'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupervisorReports;
