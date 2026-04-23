import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardWithSidebar from "../../../components/layout/DashboardWithSidebar";
import CreateUserModal from "../components/CreateUserModal";
import EditUserModal from "../components/EditUserModal";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/users/${id}`, {
        headers: { "X-Admin-ID": localStorage.getItem("userId") }
      });
      toast.success("User deleted successfully!");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <DashboardWithSidebar>
      <div className="absolute inset-0 bg-[#f8f9fc] pointer-events-none" />
      <div className="relative z-10 w-full max-w-6xl mx-auto mb-10 mt-6 min-h-[60vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] p-8 shadow-glass mb-6 border border-surface-container-highest flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="font-aldrich text-4xl text-on-surface">User Management</h1>
            <p className="text-on-surface/60 font-medium mt-1">Manage accounts, verify profiles, and configure roles.</p>
          </div>
          
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="px-6 py-3 rounded-full font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all shadow-md active:scale-95"
          >
            + Create User
          </button>
        </div>

        {/* List View */}
        <div className="flex-1 bg-white rounded-[2rem] p-6 sm:p-8 shadow-glass border border-surface-container-highest overflow-hidden">
          {loading ? (
             <div className="py-20 text-center text-on-surface/50 font-bold animate-pulse">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-highest">
                    <th className="pb-4 pt-2 px-4 text-xs font-black uppercase text-on-surface/40 tracking-wider">User details</th>
                    <th className="pb-4 pt-2 px-4 text-xs font-black uppercase text-on-surface/40 tracking-wider">Role</th>
                    <th className="pb-4 pt-2 px-4 text-xs font-black uppercase text-on-surface/40 tracking-wider">Status</th>
                    <th className="pb-4 pt-2 px-4 text-xs font-black uppercase text-on-surface/40 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-surface-container-lowest last:border-0 hover:bg-surface-container-low/20 transition-colors">
                      <td className="py-4 px-4">
                         <div className="font-bold text-on-surface">{user.name}</div>
                         <div className="text-xs text-on-surface/50 font-medium">{user.email}</div>
                      </td>
                      <td className="py-4 px-4">
                         <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                           {user.role}
                         </span>
                      </td>
                      <td className="py-4 px-4">
                         {user.verified ? (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Verified</span>
                         ) : (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Pending</span>
                         )}
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button onClick={() => setEditingUser(user)} className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                     <tr>
                        <td colSpan="4" className="text-center py-10 opacity-50 font-bold">No users found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isCreateOpen && (
         <CreateUserModal 
            onClose={() => setIsCreateOpen(false)} 
            onCreated={() => { setIsCreateOpen(false); fetchUsers(); }} 
         />
      )}

      {editingUser !== null && (
         <EditUserModal 
            user={editingUser} 
            onClose={() => setEditingUser(null)} 
            onUpdated={() => { setEditingUser(null); fetchUsers(); }} 
         />
      )}
    </DashboardWithSidebar>
  );
}
