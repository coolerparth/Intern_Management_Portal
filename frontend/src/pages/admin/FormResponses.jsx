import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';

const FormResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [formRes, respRes] = await Promise.all([
        API.get(`/forms/${id}`),
        API.get(`/forms/${id}/responses`)
      ]);
      setForm(formRes.data);
      setResponses(respRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Submission Date', accessor: 'createdAt', render: (date) => new Date(date).toLocaleString() },
    { header: 'Actions', accessor: 'actions', render: (_, row) => (
      <button 
        className="btn-outline text-sm px-4 py-1"
        onClick={(e) => { e.stopPropagation(); setSelectedResponse(row); setShowModal(true); }}
      >
        View Details
      </button>
    ) }
  ];

  if (loading) return <div className="p-10 text-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button className="p-2 border rounded-xl hover:bg-gray-50" onClick={() => navigate(-1)}>
          ⬅️ Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form?.title} - Responses</h1>
          <p className="text-sm text-gray-500">{responses.length} total submissions</p>
        </div>
      </div>

      <Table 
        columns={columns}
        data={responses}
        loading={loading}
      />

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Response Details"
      >
        {selectedResponse && (
          <div className="space-y-4">
            <div className="text-sm text-gray-500 mb-4 border-b pb-4">
              Submitted: {new Date(selectedResponse.createdAt).toLocaleString()}
            </div>
            {Object.entries(selectedResponse.answers || {}).map(([question, answer], idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                <p className="font-semibold text-gray-800 mb-1">{question}</p>
                <p className="text-gray-600">{Array.isArray(answer) ? answer.join(', ') : answer}</p>
              </div>
            ))}
            <div className="pt-4 flex justify-end">
              <button className="btn-outline px-6" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FormResponses;
