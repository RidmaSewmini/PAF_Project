import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardWithSidebar from "../../../components/layout/DashboardWithSidebar";
import toast from "react-hot-toast";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/admin/audit", {
        params: {
          search: search || null,
          actionType: actionFilter || null,
          page,
          size: 10
        }
      });
      setLogs(res.data);
    } catch (err) {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, actionFilter, page]);

  const clearLogs = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all audit logs?")) return;
    try {
      await axios.delete("http://localhost:8080/admin/audit/clear");
      toast.success("Audit logs cleared successfully");
      setLogs([]);
    } catch (err) {
      toast.error("Failed to clear logs");
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString();
  };

  const renderActionBadge = (action) => {
    switch (action) {
       case "USER_CREATED": return <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded bg-green-100 text-green-700">CREATED</span>;
       case "USER_UPDATED": return <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded bg-blue-100 text-blue-700">UPDATED</span>;
       case "USER_DELETED": return <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded bg-red-100 text-red-700">DELETED</span>;
       default: return <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded bg-slate-100 text-slate-700">{action}</span>;
    }
  };

  return (
    <DashboardWithSidebar>
      <div className="absolute inset-0 bg-[#f8f9fc] pointer-events-none" />
      <div className="relative z-10 w-full max-w-6xl mx-auto mb-10 mt-6 min-h-[60vh] flex flex-col">
        
        <div className="bg-white rounded-[2rem] p-8 shadow-glass mb-6 border border-surface-container-highest flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="font-aldrich text-4xl text-on-surface">Audit Logs</h1>
            <p className="text-on-surface/60 font-medium mt-1">Immutable tracking of administrative actions and security events.</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <button 
              onClick={async () => {
                const res = await axios.get("http://localhost:8080/admin/audit/download", {
                  responseType: "blob",
                });
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "audit_logs.pdf");
                document.body.appendChild(link);
                link.click();
              }}
              className="px-6 py-3 rounded-full font-bold text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-sm active:scale-95"
            >
              Download PDF
            </button>
            <button 
              onClick={clearLogs}
              disabled={logs.length === 0}
              className="px-6 py-3 rounded-full font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              Clear All Logs
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[2rem] p-6 sm:p-8 shadow-glass border border-surface-container-highest overflow-hidden">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search admin, action, target..."
              value={search}
              onChange={(e) => {
                setPage(0);
                setSearch(e.target.value);
              }}
              className="flex-1 px-4 py-2 border border-surface-container-highest rounded-xl bg-surface-container-lowest focus:outline-none focus:border-primary text-sm"
            />

            <select
              value={actionFilter}
              onChange={(e) => {
                setPage(0);
                setActionFilter(e.target.value);
              }}
              className="px-4 py-2 border border-surface-container-highest rounded-xl bg-surface-container-lowest focus:outline-none focus:border-primary text-sm"
            >
              <option value="">All Actions</option>
              <option value="USER_CREATED">User Created</option>
              <option value="USER_UPDATED">User Updated</option>
              <option value="USER_DELETED">User Deleted</option>
              <option value="ROLE_CHANGE">Role Changed</option>
            </select>
          </div>

          {loading ? (
             <div className="py-20 text-center text-on-surface/50 font-bold animate-pulse">Loading logs...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-surface-container-highest">
                    <th className="pb-4 pt-2 px-4 text-xs font-black uppercase text-on-surface/40 tracking-wider">Timestamp</th>
                    <th className="pb-4 pt-2 px-4 text-xs font-black uppercase text-on-surface/40 tracking-wider">Administrator</th>
                    <th className="pb-4 pt-2 px-4 text-xs font-black uppercase text-on-surface/40 tracking-wider">Action</th>
                    <th className="pb-4 pt-2 px-4 text-xs font-black uppercase text-on-surface/40 tracking-wider">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-surface-container-lowest last:border-0 hover:bg-surface-container-low/20 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-on-surface/80">
                         {formatDate(log.timestamp)}
                      </td>
                      <td className="py-4 px-4">
                         <div className="font-bold text-sm text-on-surface">{log.adminName}</div>
                         <div className="text-xs text-on-surface/50 font-medium font-mono">{log.adminId !== "UNKNOWN_ADMIN" && log.adminId !== "SYSTEM" ? log.adminId : log.adminEmail}</div>
                      </td>
                      <td className="py-4 px-4">
                         {renderActionBadge(log.actionType)}
                         <div className="text-[10px] text-on-surface/50 mt-1 uppercase tracking-wider">{log.description}</div>
                      </td>
                      <td className="py-4 px-4">
                         <div className="font-bold text-sm text-on-surface">{log.targetName}</div>
                         <div className="text-xs text-on-surface/50 font-medium font-mono">ID: {log.targetId}</div>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                     <tr>
                        <td colSpan="5" className="text-center py-10 opacity-50 font-bold">No audit logs found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page === 0}
              onClick={() => setPage(prev => prev - 1)}
              className="px-4 py-2 border border-surface-container-highest rounded-xl disabled:opacity-50 active:scale-95 transition-all text-sm font-bold text-on-surface/80 hover:bg-surface-container-low"
            >
              ◀ Prev
            </button>

            <span className="text-sm font-bold text-on-surface/60">Page {page + 1}</span>

            <button
              disabled={logs.length < 10}
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 border border-surface-container-highest rounded-xl disabled:opacity-50 active:scale-95 transition-all text-sm font-bold text-on-surface/80 hover:bg-surface-container-low"
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </DashboardWithSidebar>
  );
}
