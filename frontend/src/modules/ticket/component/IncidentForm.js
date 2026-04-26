import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../services/ticketService';

const IncidentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    priority: 'LOW',
    preferredContact: ''
  });
  
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });
    try {
      await createTicket(formData, files);
      setStatus({ loading: false, error: null, success: true });
      setFormData({ category: '', description: '', location: '', priority: 'LOW', preferredContact: '' });
      setFiles([]);
      // Redirect after 1.5s so the user sees the success message
      setTimeout(() => navigate('/tickets'), 1500);
    } catch (err) {
      setStatus({ loading: false, error: err.message || 'Failed to submit', success: false });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-card rounded-2xl border border-gray-50">
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-[#2D3748] hover:text-[#A78BFA] transition-colors duration-200 font-['Inter'] text-sm font-medium mb-6 group"
      >
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      <h2 className="text-3xl font-bold mb-8 text-[#2D3748] font-['Manrope']">Report an Issue</h2>
      
      {status.success && (
        <div className="p-4 mb-6 text-green-700 bg-green-50 border border-green-200 rounded-lg font-['Inter']">
          Ticket submitted successfully! Our technicians will review it shortly.
        </div>
      )}
      {status.error && (
        <div className="p-4 mb-6 text-red-700 bg-red-50 border border-red-200 rounded-lg font-['Inter']">
          {status.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 font-['Inter'] text-[#2D3748]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">Category</label>
            <input 
              type="text" 
              name="category"
              value={formData.category} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent transition-all"
              placeholder="e.g., Electrical, Plumbing" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">Location</label>
            <input 
              type="text" 
              name="location"
              value={formData.location} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent transition-all"
              placeholder="e.g., Building A, Room 101" 
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">Priority</label>
            <select 
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent transition-all"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Preferred Contact</label>
            <input 
              type="text" 
              name="preferredContact"
              value={formData.preferredContact} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent transition-all"
              placeholder="Email or Phone" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Description</label>
          <textarea 
            name="description"
            value={formData.description} 
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent transition-all h-32 resize-none"
            placeholder="Please describe the issue in detail..." 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Attach Files (optional)</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent transition-all text-sm text-[#2D3748] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#A78BFA] file:text-white hover:file:bg-[#7B61FF]"
          />
          {files.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">{files.length} file(s) selected</p>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={status.loading}
          className="w-full py-4 text-white font-bold rounded-xl transition-all duration-300 bg-[#7B61FF] hover:bg-[#A78BFA] disabled:opacity-70 font-['Manrope'] shadow-glass hover:shadow-lg mt-4"
        >
          {status.loading ? 'Submitting...' : 'Submit Incident Report'}
        </button>
      </form>
    </div>
  );
};

export default IncidentForm;
