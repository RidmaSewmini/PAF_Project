import React, { useState } from 'react';
import { updateTicketStatus } from '../services/ticketService';

const TicketModal = ({ ticket, onClose, onUpdate }) => {
  const [status, setStatus] = useState(ticket?.status || 'OPEN');
  const [resolutionNotes, setResolutionNotes] = useState(ticket?.resolutionNotes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!ticket) return null;

  const handleUpdate = async () => {
    // Client-side guard — backend also enforces this
    if (status === 'RESOLVED' && !resolutionNotes.trim()) {
      setError('Resolution notes are required when marking a ticket as Resolved.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updated = await updateTicketStatus(ticket.id, { status, resolutionNotes });
      onUpdate(updated);        // propagates new badge to the card grid immediately
      setSuccess(true);         // show confirmation before closing
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(
        typeof err === 'string' ? err : err.message || 'Failed to update status'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3748]/40 backdrop-blur-md transition-all font-['Inter']">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/50 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#2D3748] font-['Manrope']">Ticket Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 flex-grow">
          {/* Main Info */}
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-[#2D3748] font-['Manrope'] mb-2">{ticket.category} - {ticket.location}</h3>
            <p className="text-[#2D3748]/80 text-sm whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Attachments Section */}
          {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
            <div>
              <h4 className="font-bold text-[#2D3748] mb-3 font-['Manrope']">Attachments</h4>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {ticket.attachmentUrls.map((url, idx) => (
                  <div key={idx} className="relative group min-w-[120px] h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer">
                    <img src={url} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold drop-shadow-md">View</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment Thread */}
          <div>
            <h4 className="font-bold text-[#2D3748] mb-4 font-['Manrope']">Comment Thread</h4>
            <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 max-h-60 overflow-y-auto">
              {(!ticket.comments || ticket.comments.length === 0) ? (
                <p className="text-sm text-gray-400 text-center py-4">No comments yet.</p>
              ) : (
                ticket.comments.map((comment, idx) => {
                  // Assume 'admin' or 'staff' has a different role/owner format
                  const isStaff = comment.owner?.toLowerCase() === 'admin' || comment.owner?.toLowerCase() === 'technician';
                  return (
                    <div key={idx} className={`flex flex-col max-w-[80%] ${isStaff ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <div className="text-xs text-gray-500 mb-1 px-1">
                        <span className="font-bold">{comment.owner || 'User'}</span> • {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                      <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        isStaff 
                          ? 'bg-[#7B61FF] text-white rounded-tr-sm' 
                          : 'bg-white border border-gray-200 text-[#2D3748] rounded-tl-sm'
                      }`}>
                        {comment.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Technician Update Section */}
          <div className="bg-[#F0F3FF] p-5 rounded-2xl border border-[#A78BFA]/30">
            <h4 className="font-bold text-[#2D3748] mb-4 font-['Manrope']">Admin Status Update</h4>

            {/* Success confirmation banner */}
            {success && (
              <div className="mb-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Ticket status updated successfully! Closing…
              </div>
            )}

            {error && <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">{error}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D3748] mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3748] mb-1">
                  Resolution Notes
                  {status === 'RESOLVED' && <span className="ml-1 text-red-500">*required</span>}
                </label>
                <textarea 
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Add notes before resolving..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20 h-24 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white/50 rounded-b-3xl">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-[#A78BFA] text-[#2D3748] font-bold hover:bg-[#F0F3FF] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdate}
            disabled={loading || success}
            className="px-6 py-2.5 rounded-xl bg-[#7B61FF] text-white font-bold hover:bg-[#674bb5] shadow-glass transition-colors disabled:opacity-70"
          >
            {loading ? 'Updating…' : success ? '✓ Updated' : 'Update Status'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TicketModal;
