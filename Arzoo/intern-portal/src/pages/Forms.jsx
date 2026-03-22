import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mockForms } from "../data/mockData";

export default function Forms() {
  const { user } = useAuth();
  const [forms, setForms] = useState(mockForms);
  const [showCreate, setShowCreate] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", description: "" });
  const [activeForm, setActiveForm] = useState(null);
  const [formResponse, setFormResponse] = useState({ answer1: "", answer2: "", answer3: "" });

  const handleCreateForm = (e) => {
    e.preventDefault();
    const form = {
      id: Date.now(), ...newForm, createdBy: user.id,
      status: "active", responses: 0,
      createdAt: new Date().toISOString().split("T")[0],
      link: `/forms/${Date.now()}`,
    };
    setForms([...forms, form]);
    setNewForm({ title: "", description: "" });
    setShowCreate(false);
  };

  const handleSubmitResponse = (e) => {
    e.preventDefault();
    setForms(forms.map((f) => f.id === activeForm.id ? { ...f, responses: f.responses + 1 } : f));
    setActiveForm(null);
    setFormResponse({ answer1: "", answer2: "", answer3: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Forms</h1>
        {user?.role === "admin" && (
          <button onClick={() => setShowCreate(!showCreate)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            + Create Form
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Create New Form</h3>
          <form onSubmit={handleCreateForm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
              <input type="text" value={newForm.title} onChange={(e) => setNewForm({ ...newForm, title: e.target.value })} placeholder="Enter form title" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} placeholder="Describe the form..." rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Create</button>
              <button type="button" onClick={() => setShowCreate(false)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Form Response Modal */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">{activeForm.title}</h3>
              <button onClick={() => setActiveForm(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmitResponse} className="p-5 space-y-4">
              <p className="text-sm text-gray-500 mb-4">{activeForm.description}</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
                <textarea value={formResponse.answer1} onChange={(e) => setFormResponse({ ...formResponse, answer1: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Write your response..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-10)</label>
                <input type="number" min="1" max="10" value={formResponse.answer2} onChange={(e) => setFormResponse({ ...formResponse, answer2: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
                <textarea value={formResponse.answer3} onChange={(e) => setFormResponse({ ...formResponse, answer3: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Any additional comments..." />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700">Submit Response</button>
            </form>
          </div>
        </div>
      )}

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <div key={form.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${form.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{form.status}</span>
              <span className="text-xs text-gray-400">{form.createdAt}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">{form.title}</h3>
            <p className="text-xs text-gray-500 mb-4">{form.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{form.responses} responses</span>
              {user?.role === "intern" && form.status === "active" && (
                <button onClick={() => setActiveForm(form)} className="text-green-600 text-sm hover:underline">Fill Form</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
