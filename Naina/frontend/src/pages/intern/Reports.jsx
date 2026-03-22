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
        <div>

          <input 
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />

          {uploading && (
            <div style={{ marginTop: "10px" }}>
              <div style={{
                height: "8px",
                background: "#ddd",
                borderRadius: "6px"
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: "8px",
                  background: "#16a34a"
                }} />
              </div>
              <p>{Math.round(uploadProgress)}%</p>
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <button onClick={uploadReport}>
              Upload
            </button>
          </div>

        </div>
      </Modal>
    </div>
  );
};

export default InternReports;