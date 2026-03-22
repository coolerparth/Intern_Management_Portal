import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';

const AdminForms = () => {
  const [forms, setForms] = useState([
    { id: 1, title: 'Intern Onboarding Form', fields: 8, submissions: 25 },
    { id: 2, title: 'Weekly Progress Report', fields: 12, submissions: 89 },
    { id: 3, title: 'Final Evaluation', fields: 15, submissions: 12 }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateForm = () => {
    setLoading(true);
    setTimeout(() => {
      setForms([
        ...forms,
        { id: Date.now(), title: 'New Form', fields: 0, submissions: 0 }
      ]);
      setLoading(false);
      setShowModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
          <p className="text-gray-600 mt-1">Create and manage evaluation forms for interns</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary px-8 whitespace-nowrap"
        >
          + New Form
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div key={form.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold">F</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{form.title}</h3>
                    <p className="text-sm text-gray-500">Form ID: #{form.id}</p>
                  </div>
                </div>
                <Badge variant="success">{form.submissions} submissions</Badge>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fields</span>
                  <span className="font-semibold text-gray-900">{form.fields}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <button className="btn-primary flex-1 text-sm py-2.5">Edit Form</button>
                <button className="btn-outline flex-1 text-sm py-2.5 border-gray-300">Preview</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Form" size="sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
            <input 
              type="text"
              placeholder="e.g. Intern Weekly Report"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Form Type</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                <option>Evaluation</option>
                <option>Onboarding</option>
                <option>Weekly Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                <option value="intern">Interns</option>
                <option value="teamlead">Team Leads</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button className="btn-outline px-6" onClick={() => setShowModal(false)}>Cancel</button>
            <button 
              className="btn-primary px-8"
              onClick={handleCreateForm}
              disabled={loading}
            >
              {loading ? <Loader size="sm" /> : 'Create Form'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminForms;

