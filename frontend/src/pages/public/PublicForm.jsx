import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const PublicForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await API.get(`/forms/public/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("Error fetching form:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleChange = (fieldLabel, value) => {
    setAnswers({ ...answers, [fieldLabel]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/forms/submit/${id}`, { answers });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit form.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading form...</div>;
  if (!form) return <div className="p-10 text-center text-red-500">Form not found.</div>;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-4xl">✅</div>
          <h2 className="text-2xl font-bold text-gray-900">Submitted!</h2>
          <p className="text-gray-600">Your response has been recorded successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-10 text-white">
          <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
          {form.description && <p className="text-emerald-50">{form.description}</p>}
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {form.fields && form.fields.map((field, idx) => (
            <div key={idx} className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.fieldType === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Your answer"
                />
              )}

              {field.fieldType === 'textarea' && (
                <textarea
                  required={field.required}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-vertical"
                  placeholder="Your answer"
                  rows="4"
                />
              )}

              {field.fieldType === 'dropdown' && (
                <select
                  required={field.required}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.fieldType === 'radio' && (
                <div className="space-y-2">
                  {field.options?.map((opt, i) => (
                    <label key={i} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`field_${idx}`}
                        value={opt}
                        required={field.required}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.fieldType === 'checkbox' && (
                <div className="space-y-2">
                  {field.options?.map((opt, i) => (
                    <label key={i} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        value={opt}
                        onChange={(e) => {
                          const current = answers[field.label] || [];
                          const newVal = e.target.checked 
                            ? [...current, opt] 
                            : current.filter(x => x !== opt);
                          handleChange(field.label, newVal);
                        }}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.fieldType === 'rating' && (
                <div className="flex items-center space-x-2 border p-3 rounded-xl inline-flex bg-gray-50 border-gray-200">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleChange(field.label, num)}
                      className={`w-10 h-10 rounded-full font-bold transition-colors ${answers[field.label] === num ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-500 border hover:bg-gray-100'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-4 text-lg"
            >
              {submitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicForm;
