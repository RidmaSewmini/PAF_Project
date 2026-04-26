import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets, getTicketsByUserId } from '../services/ticketService';
import TicketModal from '../component/TicketModal';
import { useAuth } from '../../../context/AuthContext';

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  // Normalise role to uppercase so 'admin' and 'ADMIN' both match
  const isAdmin = (user?.role || '').toUpperCase() === 'ADMIN';

  useEffect(() => {
    // Wait until AuthContext has resolved the user before fetching
    if (authLoading) return;
    fetchTickets();
  }, [authLoading, isAdmin]);

  const fetchTickets = async () => {
    try {
      let data;
      if (isAdmin) {
        // Admin sees every ticket across the campus
        data = await getAllTickets();
      } else {
        // Regular user sees only their own submitted tickets
        const userId = localStorage.getItem('userId');
        data = await getTicketsByUserId(userId);
      }
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeElapsed = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const created = new Date(dateString);
    const diffInHours = Math.abs(now - created) / 36e5;
    
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const isOver24hOpen = (ticket) => {
    if (ticket.status !== 'OPEN' || !ticket.createdAt) return false;
    const now = new Date();
    const created = new Date(ticket.createdAt);
    const diffInHours = Math.abs(now - created) / 36e5;
    return diffInHours > 24;
  };

  const handleTicketUpdate = (updatedTicket) => {
    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'OPEN':
        return <span className="px-3 py-1 text-xs font-bold text-white bg-[#F472B6] rounded-full shadow-sm">OPEN</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 text-xs font-bold text-white bg-[#A78BFA] rounded-full shadow-sm">IN PROGRESS</span>;
      case 'RESOLVED':
        return <span className="px-3 py-1 text-xs font-bold text-white bg-[#7B61FF] rounded-full shadow-sm">RESOLVED</span>;
      case 'CLOSED':
        return <span className="px-3 py-1 text-xs font-bold text-white bg-gray-400 rounded-full shadow-sm">CLOSED</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full shadow-sm">REJECTED</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold text-white bg-[#2D3748] rounded-full shadow-sm">{status || 'UNKNOWN'}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    const Dot = ({ active }) => (
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#F472B6]' : 'bg-gray-200'}`}></div>
    );
    
    switch(priority) {
      case 'HIGH':
        return (
          <div className="flex items-center gap-1" title="High Priority">
            <Dot active={true} /><Dot active={true} /><Dot active={true} />
          </div>
        );
      case 'MEDIUM':
        return (
          <div className="flex items-center gap-1" title="Medium Priority">
            <Dot active={true} /><Dot active={true} /><Dot active={false} />
          </div>
        );
      case 'LOW':
        return (
          <div className="flex items-center gap-1" title="Low Priority">
            <Dot active={true} /><Dot active={false} /><Dot active={false} />
          </div>
        );
      default:
        return null;
    }
  };

  // Filter based on search term (category, location, or description)
  const filteredTickets = tickets.filter(t => {
    const term = searchTerm.toLowerCase();
    return (
      (t.category || '').toLowerCase().includes(term) ||
      (t.location || '').toLowerCase().includes(term) ||
      (t.description || '').toLowerCase().includes(term)
    );
  });

  // ── Admin summary stats (derived from full ticket list, not filtered) ──
  const stats = isAdmin ? {
    total:      tickets.length,
    open:       tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved:   tickets.filter(t => t.status === 'RESOLVED').length,
  } : null;

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* ── Back Button ── */}
        <button
          onClick={() => navigate(isAdmin ? '/admin-dashboard' : '/dashboard')}
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
          {isAdmin ? 'Back to Admin Dashboard' : 'Back to Dashboard'}
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#2D3748] font-['Manrope'] mb-2">
              {isAdmin ? 'Incident Management Console' : 'Incident Dashboard'}
            </h1>
            <p className="text-[#2D3748]/70 font-['Inter'] text-sm">
              {isAdmin
                ? 'Review, triage, and update all campus incident tickets.'
                : 'Manage and track all campus maintenance requests.'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Search incidents by location, category..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-full border border-gray-200 bg-white shadow-sm text-[#2D3748] font-['Inter'] focus:outline-none focus:border-[#A78BFA] focus:ring-4 focus:ring-[#A78BFA]/20 transition-all"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {!isAdmin && (
              <button 
                onClick={() => navigate('/report-incident')}
                className="w-full sm:w-auto px-6 py-3 bg-[#7B61FF] text-white font-bold rounded-xl hover:bg-[#674bb5] transition-colors shadow-sm whitespace-nowrap font-['Manrope']"
              >
                + Report Incident
              </button>
            )}
          </div>
        </div>

        {/* ── Admin Stats Strip ── */}
        {isAdmin && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total',       value: stats.total,      color: 'bg-[#2D3748]',  text: 'text-white' },
              { label: 'Open',        value: stats.open,       color: 'bg-[#F472B6]',  text: 'text-white' },
              { label: 'In Progress', value: stats.inProgress, color: 'bg-[#A78BFA]',  text: 'text-white' },
              { label: 'Resolved',    value: stats.resolved,   color: 'bg-[#7B61FF]',  text: 'text-white' },
            ].map(({ label, value, color, text }) => (
              <div key={label} className={`${color} rounded-2xl p-5 shadow-sm flex flex-col gap-1`}>
                <span className={`text-3xl font-bold font-['Manrope'] ${text}`}>{value}</span>
                <span className={`text-xs font-semibold font-['Inter'] ${text} opacity-80`}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7B61FF]"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="bg-[#F7FAFC] p-6 rounded-full mb-6">
                  <svg className="w-16 h-16 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#2D3748] font-['Manrope'] text-2xl font-bold mb-2">All systems go.</p>
                <p className="text-[#2D3748]/70 font-['Inter'] text-base mb-6">
                  {isAdmin ? 'No campus incidents to manage right now.' : 'No incidents reported.'}
                </p>
                
                {!isAdmin && (
                  <button 
                    onClick={() => navigate('/report-incident')}
                    className="px-8 py-3.5 bg-[#7B61FF] text-white font-bold rounded-2xl hover:bg-[#674bb5] transition-all shadow-md hover:shadow-lg font-['Manrope'] transform hover:-translate-y-0.5"
                  >
                    Report an Incident
                  </button>
                )}
              </div>
            ) : (
              filteredTickets.map(ticket => {
                const isAlert = isOver24hOpen(ticket);
                return (
                <div key={ticket.id} className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col h-full group ${isAlert ? 'border-2 border-[#F472B6] animate-pulse' : 'border border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#2D3748] font-['Manrope'] line-clamp-1 group-hover:text-[#7B61FF] transition-colors">
                      {ticket.category || 'Uncategorized'}
                    </h3>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(ticket.status)}
                      <span className="text-xs font-bold text-gray-400 font-['Inter']">{getTimeElapsed(ticket.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="font-['Inter'] text-[#2D3748]/80 text-sm mb-4 line-clamp-3 min-h-[60px] flex-grow">
                    {ticket.description || 'No description provided.'}
                  </div>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm font-['Inter'] font-medium text-[#2D3748]">
                        <svg className="w-4 h-4 mr-2 text-[#F472B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {ticket.location || 'Unknown Location'}
                      </div>
                      <div className="ml-6">
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <button 
                        onClick={() => { setSelectedTicket(ticket); setIsModalOpen(true); }}
                        className="p-2.5 bg-gray-50 rounded-full hover:bg-[#F472B6]/10 text-[#2D3748] hover:text-[#F472B6] transition-colors group-hover:scale-110 duration-200"
                        title="Quick Actions"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )})
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <TicketModal 
          ticket={selectedTicket} 
          onClose={() => setIsModalOpen(false)} 
          onUpdate={handleTicketUpdate} 
        />
      )}
    </div>
  );
};

export default TicketDashboard;
