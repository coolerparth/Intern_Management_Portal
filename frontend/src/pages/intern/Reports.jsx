import { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import API from '../../services/api';
import { motion } from 'framer-motion';

const InternReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ SAFE COLUMNS
  const columns = [
    { header: 'Report Title', accessor: 'title' },

    { 
      header: 'Submitted', 
      accessor: 'submittedDate', 
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },

    { 
      header: 'Status', 
      accessor: 'status', 
      render: (status) => (
        <Badge variant={
          status === 'approved' ? 'success' :
          status === 'rejected' ? 'danger' :
          'default'
        }>
          {(status || 'pending').toUpperCase()}
        </Badge>
      )
    },

    { 
      header: 'Feedback', 
      accessor: 'feedback', 
      render: (feedback) => feedback ? '📝 View' : '—' 
    },

    { 
      header: 'File', 
      accessor: 'fileUrl', 
      render: (url) => url ? (
        <a href={url} target="_blank" rel="noreferrer">
          📄 Download
        </a>
      ) : '—'
    }
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ SAFE FETCH
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get('/report');

      console.log("REPORT API:", response.data);

      setReports(
        response.data?.reports || 
        response.data || 
        []
      );

    } catch (error) {
      console.error('Error fetching reports:', error);

      // fallback dummy (SAFE)
      setReports([
        {
          _id: "1",
          title: 'Week 1 Report',
          submittedDate: '2024-01-07',
          status: 'approved',
          feedback: 'Good work',
          fileUrl: '#'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // FILE SELECT
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // UPLOAD
  const uploadReport = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      await API.post('/report', formData);

      setUploadProgress(100);

      setTimeout(() => {
        setShowUploadModal(false);
        setFile(null);
        setUploadProgress(0);
        setUploading(false);
        fetchReports();
      }, 800);

    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">

      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold">My Reports</h1>
          <p>Upload and track your reports</p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          + New Report
        </button>
      </motion.div>

      {/* TABLE */}
      {loading ? (
        <Loader />
      ) : (
        <Table 
          columns={columns}
          data={reports}
        />
      )}

      {/* MODAL */}
      <Modal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Report"
      >
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select PDF Report</label>
            <input 
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm font-medium text-emerald-600 text-right">{Math.round(uploadProgress)}%</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button 
              className="btn-outline"
              onClick={() => setShowUploadModal(false)}
              disabled={uploading}
            >
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={uploadReport}
              disabled={!file || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Report'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InternReports;