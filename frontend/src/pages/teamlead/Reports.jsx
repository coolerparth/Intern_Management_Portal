import { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import API from '../../services/api';

const TeamLeadReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState(''); // 'review' or 'evaluate'

  const columns = [
    { header: 'Intern', accessor: 'internName' },
    { header: 'Report Title', accessor: 'title' },
    { header: 'Submitted', accessor: 'submittedDate', render: (date) => new Date(date).toLocaleDateString() },
    { header: 'Status', accessor: 'status', render: (status) => (
      <Badge variant={
        status === 'approved' ? 'success' :
        status === 'rejected' ? 'danger' :
        status === 'pending' ? 'warning' :
        'default'
      }>
        {status.toUpperCase()}
      </Badge>
    ) },
    { header: 'File', accessor: 'file', render: () => (
      <a href="#" className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">📄 Download PDF</a>
    ) },
    { header: 'Actions', accessor: 'actions', render: () => (
      <div className="flex space-x-2">
        <button className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50">👁️ Review</button>
        <button className="text-emerald-600 hover:text-emerald-800 p-1.5 rounded-lg hover:bg-emerald-50">⭐ Evaluate</button>
      </div>
    ) }
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await API.get('/report');
      const formattedData = res.data.map(r => ({
        id: r._id,
        internName: r.internId?.name || 'Unknown',
        title: r.title || r.taskId?.title || 'Progress Report',
        submittedDate: r.submittedAt,
        status: r.status || 'pending',
        file: r.filePath,
      }));
      setReports(formattedData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (report) => {
    setSelectedReport(report);
    setAction('review');
    setShowModal(true);
  };

  const handleEvaluate = (report) => {
    setSelectedReport(report);
    setAction('evaluate');
    setShowModal(true);
  };

  const handleStatusUpdate = async (status) => {
    if (selectedReport) {
      try {
        await API.put(`/report/${selectedReport.id}/status`, { status });
        setReports(reports.map(r => 
          r.id === selectedReport.id 
            ? { ...r, status }
            : r
        ));
      } catch (err) {
        console.error("Failed to update status", err);
      }
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Reviews</h1>
          <p className="text-gray-600 mt-1">Review and evaluate intern submissions</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline px-8">Download All</button>
          <button className="btn-primary px-8">Bulk Approve</button>
        </div>
      </div>

      <Table 
        columns={columns}
        data={reports}
        loading={loading}
      />

      {/* Report Review Modal */}
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${action === 'review' ? 'Review' : 'Evaluate'} ${selectedReport?.title}`}
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-3xl">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">{selectedReport.internName.split(' ').map(n => n[0]).join('')}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedReport.internName}</h3>
                <p className="text-gray-600 mb-2">{selectedReport.title}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Submitted: {new Date(selectedReport.submittedDate).toLocaleDateString()}</span>
                  <Badge variant={selectedReport.status}>{selectedReport.status}</Badge>
                </div>
              </div>
            </div>

            {/* Report Preview */}
            <div className="bg-white rounded-3xl shadow-inner p-8 border-2 border-dashed border-gray-200">
              <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white border-4 border-dashed border-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <a href="#" className="text-emerald-600 hover:text-emerald-800 font-semibold text-lg block mb-2">📄 report.pdf</a>
                  <p className="text-sm text-gray-500">Click to download full report</p>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              {action === 'review' ? (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Quick Decision</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleStatusUpdate('approved')}
                        className="btn-success px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
                      >
                        ✅ Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate('rejected')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-4">Overall Score</label>
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, idx) => (
                        <svg key={idx} className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                      <span className="text-2xl font-bold text-gray-900">4.8</span>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Feedback</label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-vertical"
                      placeholder="Write your detailed feedback..."
                      defaultValue="Excellent work! The report structure is clear and the progress is impressive. Continue maintaining this quality."
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button className="btn-outline px-8" onClick={() => setShowModal(false)}>
                Close
              </button>
              <button className="btn-primary px-8">
                {action === 'review' ? 'Save Decision' : 'Submit Evaluation'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeamLeadReports;

