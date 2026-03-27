import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import API from '../../services/api';

const AdminForms = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', description: '', formType: 'Evaluation', targetRole: 'intern' });
  const [formLoading, setFormLoading] = useState(false);
  
  const [editingForm, setEditingForm] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await API.get('/forms');
      setForms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await API.post('/forms/create', formData);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', formType: 'Evaluation', targetRole: 'intern' });
      fetchForms();
    } catch (error) {
      console.error(error);
      alert('Error creating form');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCopyLink = (formId) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  // Field Editor Logic
  const openEditModal = (form) => {
    setEditingForm(JSON.parse(JSON.stringify(form))); // clone
    setShowEditModal(true);
  };

  const handleAddField = () => {
    setEditingForm({
      ...editingForm,
      fields: [...(editingForm.fields || []), { label: '', fieldType: 'text', options: [], required: false }]
    });
  };

  const handleUpdateField = (index, key, value) => {
    const updatedFields = [...editingForm.fields];
    updatedFields[index][key] = value;
    setEditingForm({ ...editingForm, fields: updatedFields });
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...editingForm.fields];
    updatedFields.splice(index, 1);
    setEditingForm({ ...editingForm, fields: updatedFields });
  };

  const handeSaveEdit = async () => {
    setFormLoading(true);
    try {
      await API.put(`/forms/${editingForm._id}`, editingForm);
      setShowEditModal(false);
      fetchForms();
    } catch (err) {
      console.error('Failed to update schema', err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
          <p className="text-gray-600 mt-1">Create and manage dynamic forms and view responses</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-8 whitespace-nowrap"
        >
          + New Form
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader size="lg" /></div>
      ) : forms.length === 0 ? (
        <div className="text-center p-12 text-gray-500">No forms available. Create one to get started!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form._id} className="group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border border-gray-100 flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{form.title}</h3>
                    <p className="text-sm text-gray-500">{form.formType} • For {form.targetRole}</p>
                  </div>
                  <Badge variant="success">{form.submissions || 0} res</Badge>
                </div>
                {form.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{form.description}</p>}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Fields:</span>
                    <span className="font-semibold">{form.fields?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-semibold">{new Date(form.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn-primary text-xs py-2" onClick={() => openEditModal(form)}>✏️ Edit Form</button>
                  <button className="btn-outline text-xs py-2 bg-white" onClick={() => window.open(`/form/${form._id}`, '_blank')}>👁️ Preview</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn-outline text-xs py-2 bg-white border-dashed border-gray-400 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700" onClick={() => handleCopyLink(form._id)}>
                    🔗 Copy Link
                  </button>
                  <button className="btn-success text-xs py-2 text-white bg-green-600 hover:bg-green-700 font-semibold rounded-xl" onClick={() => navigate(`/admin/forms/${form._id}/responses`)}>
                    📊 Responses
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE FORM MODAL */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Form" size="sm">
        <form onSubmit={handleCreateForm} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Title *</label>
            <input 
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Form Type</label>
              <select value={formData.formType} onChange={(e) => setFormData({...formData, formType: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                <option>Evaluation</option>
                <option>Onboarding</option>
                <option>Weekly Report</option>
                <option>Feedback</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
              <select value={formData.targetRole} onChange={(e) => setFormData({...formData, targetRole: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                <option value="intern">Interns</option>
                <option value="teamlead">Team Leads</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" className="btn-outline px-6" onClick={() => setShowCreateModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary px-8" disabled={formLoading}>
              {formLoading ? <Loader size="sm" /> : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT FORM FIELDS MODAL */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Editing Fields: ${editingForm?.title}`} size="xl">
        {editingForm && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Form Fields</h3>
              {(!editingForm.fields || editingForm.fields.length === 0) && (
                <p className="text-gray-500 italic">No fields configured yet. Add some below.</p>
              )}
              {editingForm.fields?.map((field, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        placeholder="Question / Label" 
                        value={field.label}
                        onChange={(e) => handleUpdateField(idx, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-emerald-500 outline-none"
                      />
                      <div className="flex gap-4">
                        <select 
                          value={field.fieldType}
                          onChange={(e) => handleUpdateField(idx, 'fieldType', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded outline-none"
                        >
                          <option value="text">Short Text</option>
                          <option value="textarea">Paragraph</option>
                          <option value="dropdown">Dropdown</option>
                          <option value="radio">Multiple Choice (Radio)</option>
                          <option value="checkbox">Checkboxes</option>
                          <option value="rating">Rating (1-5)</option>
                        </select>
                        <label className="flex items-center space-x-2 text-sm text-gray-700">
                          <input type="checkbox" checked={field.required} onChange={(e) => handleUpdateField(idx, 'required', e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                          <span>Required</span>
                        </label>
                      </div>
                      
                      {['dropdown', 'radio', 'checkbox'].includes(field.fieldType) && (
                        <div className="pl-4 border-l-2 border-emerald-300 space-y-2">
                          <p className="text-xs font-semibold text-gray-600">Options (Comma separated)</p>
                          <input 
                            type="text" 
                            placeholder="e.g. Option A, Option B, Option C"
                            value={field.options?.join(', ')}
                            onChange={(e) => handleUpdateField(idx, 'options', e.target.value.split(',').map(s=>s.trim()))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none"
                          />
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleRemoveField(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Remove Field">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={handleAddField} className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 hover:border-emerald-500 hover:text-emerald-600 rounded-xl font-medium transition-all">
              + Add Field
            </button>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button className="btn-outline px-6" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary px-8" onClick={handeSaveEdit} disabled={formLoading}>
                {formLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminForms;
