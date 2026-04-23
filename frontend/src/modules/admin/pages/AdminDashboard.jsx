import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/layout/AdminSidebar";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="relative">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#593fd7] via-[#6f56e9] to-[#886af3] rounded-[2rem] p-10 text-white mb-8 shadow-xl shadow-indigo-600/10">
          <h2 className="text-[2.25rem] font-extrabold mb-1 tracking-tight">Welcome, Admin!</h2>
          <p className="text-white/80 font-medium text-[15px]">Manage system users, roles, and notification broadcasts from your central luminary hub.</p>
        </div>

        {/* Row 1: Stats & Logins */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">

          {/* Total Users Card */}
          <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-center min-w-[280px]">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">+3 new this week</span>
            </div>
            <h3 className="text-[2.5rem] font-extrabold text-[#1f2937] leading-none mb-1">24</h3>
            <p className="text-xs font-semibold text-slate-400">Total Registered Users</p>
          </div>

          {/* Recent OAuth Logins */}
          <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-slate-800 text-[17px] flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Recent OAuth Logins
              </h3>
              <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-full">
                View All Logins
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Badge 1 */}
              <div className="bg-[#f8f9fc] border border-[#f1f3f9] px-3.5 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-6 h-6 bg-[#8e24aa] text-white rounded-full flex items-center justify-center text-[9px] font-bold">JD</div>
                <span className="text-xs font-semibold text-slate-600">john@uni.edu</span>
              </div>
              {/* Badge 2 */}
              <div className="bg-[#f8f9fc] border border-[#f1f3f9] px-3.5 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-6 h-6 bg-[#3949ab] text-white rounded-full flex items-center justify-center text-[9px] font-bold">SW</div>
                <span className="text-xs font-semibold text-slate-600">sarah@uni.edu</span>
              </div>
              {/* Badge 3 */}
              <div className="bg-[#f8f9fc] border border-[#f1f3f9] px-3.5 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-6 h-6 bg-[#b39ddb] text-white rounded-full flex items-center justify-center text-[9px] font-bold">ML</div>
                <span className="text-xs font-semibold text-slate-600">mike.tech@uni.edu</span>
              </div>
              {/* Badge 4 */}
              <div className="bg-[#f8f9fc] border border-[#f1f3f9] px-3.5 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-6 h-6 bg-[#5e35b1] text-white rounded-full flex items-center justify-center text-[9px] font-bold">AD</div>
                <span className="text-xs font-semibold text-slate-600">admin@uni.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Grid Container */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          {/* Left Column (Table & Broadcast) */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* User Role Management Table */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-[1.35rem] font-extrabold text-slate-800 mb-0.5">User Role Management</h3>
                  <p className="text-[13px] font-medium text-slate-400">Assign permissions and adjust system access levels.</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <svg className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Search name or email..." className="w-full sm:w-56 bg-[#f8f9fc] rounded-full py-2.5 pl-10 pr-4 text-xs font-medium outline-none text-slate-600 placeholder:text-slate-400 border border-transparent focus:border-indigo-100" />
                  </div>
                  <button className="bg-[#f8f9fc] text-slate-600 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="text-[11px] font-extrabold text-slate-800 tracking-[0.08em] uppercase border-b border-slate-100">
                      <th className="pb-4 pl-2">Name</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {/* Row 1 */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pl-2 font-bold text-sm text-slate-800">Mike Lee</td>
                      <td className="py-4 text-slate-500 text-[13px] font-medium">mike.tech@uni.edu</td>
                      <td className="py-4">
                        <select className="bg-[#f8f9fc] text-slate-600 text-xs font-bold rounded-lg px-3 py-2 outline-none border border-slate-100 cursor-pointer appearance-none pr-8 relative bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_4px_center] hover:border-indigo-200">
                          <option>Technician</option>
                          <option>User</option>
                          <option>Admin</option>
                        </select>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button className="text-indigo-600 font-extrabold text-xs tracking-wider uppercase hover:text-indigo-800 transition-colors">Save</button>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pl-2 font-bold text-sm text-slate-800">Sarah Williams</td>
                      <td className="py-4 text-slate-500 text-[13px] font-medium">sarah@uni.edu</td>
                      <td className="py-4">
                        <select className="bg-[#f8f9fc] text-slate-600 text-xs font-bold rounded-lg px-3 py-2 outline-none border border-slate-100 cursor-pointer appearance-none pr-8 relative bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_4px_center] hover:border-indigo-200" defaultValue="User">
                          <option>Technician</option>
                          <option value="User">User</option>
                          <option>Admin</option>
                        </select>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button className="text-indigo-600 font-extrabold text-xs tracking-wider uppercase hover:text-indigo-800 transition-colors">Save</button>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pl-2 font-bold text-sm text-slate-800">Anna Chen</td>
                      <td className="py-4 text-slate-500 text-[13px] font-medium">a.chen@uni.edu</td>
                      <td className="py-4">
                        <select className="bg-[#f8f9fc] text-slate-600 text-xs font-bold rounded-lg px-3 py-2 outline-none border border-slate-100 cursor-pointer appearance-none pr-8 relative bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_4px_center] hover:border-indigo-200">
                          <option>Technician</option>
                          <option>User</option>
                          <option>Admin</option>
                        </select>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button className="text-indigo-600 font-extrabold text-xs tracking-wider uppercase hover:text-indigo-800 transition-colors">Save</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <p className="text-[11px] text-slate-400 font-semibold tracking-wide">Showing 1-10 of 24 users</p>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg border border-slate-100 text-slate-400 flex items-center justify-center text-sm hover:bg-slate-50 transition-colors">&lt;</button>
                  <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold shadow-md shadow-indigo-200">1</button>
                  <button className="w-8 h-8 rounded-lg border border-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-50 transition-colors">2</button>
                  <button className="w-8 h-8 rounded-lg border border-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-50 transition-colors">3</button>
                  <button className="w-8 h-8 rounded-lg border border-slate-100 text-slate-400 flex items-center justify-center text-sm hover:bg-slate-50 transition-colors">&gt;</button>
                </div>
              </div>
            </div>

            {/* Broadcast Panel */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col h-full">
              <h3 className="text-[1.1rem] font-extrabold text-slate-800 flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.382 17H5a2 2 0 01-2-2V9a2 2 0 012-2h2.382l5.129-3.847C13.254 2.596 14 3.056 14 3.931v16.138c0 .875-.746 1.335-1.489.778L7.382 17z" /><path d="M17.5 12c0-1.875-1.077-3.486-2.617-4.225-.264-.127-.58-.046-.74.2-.18.277-.118.66.14.821A3.492 3.492 0 0116 12a3.493 3.493 0 01-1.717 2.954c-.258.156-.32.535-.14.811.16.246.476.327.74.205A4.996 4.996 0 0017.5 12z" /></svg>
                </div>
                Broadcast Notification
              </h3>

              <label className="block text-xs font-extrabold text-slate-800 mb-2 uppercase tracking-wide">Message Content</label>
              <textarea
                className="w-full bg-[#f8f9fc] rounded-[1.25rem] p-5 text-[13px] font-medium outline-none placeholder:text-slate-400 text-slate-600 resize-none h-32 mb-6 border border-transparent focus:border-indigo-100 transition-colors"
                placeholder="Type your campus-wide announcement here..."
              ></textarea>

              <label className="block text-xs font-extrabold text-slate-800 mb-3 uppercase tracking-wide">Priority Level</label>
              <div className="flex gap-6 mb-8">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="radio" name="priority" defaultChecked className="peer sr-only" />
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 peer-checked:border-indigo-600 transition-colors"></div>
                    <div className="absolute w-2 h-2 rounded-full bg-indigo-600 scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-[13px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Normal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="radio" name="priority" className="peer sr-only" />
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 peer-checked:border-indigo-600 transition-colors"></div>
                    <div className="absolute w-2 h-2 rounded-full bg-indigo-600 scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-[13px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">High</span>
                </label>
              </div>

              <div className="flex gap-4 mt-auto">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-4 font-bold text-sm tracking-wide transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Send Broadcast
                </button>
                <button className="w-28 bg-white hover:bg-slate-50 border-2 border-slate-100 text-slate-600 rounded-2xl py-4 font-bold text-sm tracking-wide transition-colors">
                  Test
                </button>
              </div>
            </div>

          </div>

          {/* Right Column (Stat Cards) */}
          <div className="flex flex-col gap-6">

            {/* Users by Role */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <h3 className="font-extrabold text-slate-800 mb-8 text-[17px]">Users by Role</h3>
              <div className="flex justify-between items-end pb-2">

                <div className="flex flex-col items-center">
                  <div className="text-[2rem] font-extrabold text-indigo-600 mb-1 leading-none">3</div>
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Admins</div>
                  <div className="h-1.5 w-14 bg-indigo-50 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-indigo-600 rounded-full"></div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-[2rem] font-extrabold text-purple-600 mb-1 leading-none">18</div>
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Users</div>
                  <div className="h-1.5 w-14 bg-purple-50 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-purple-600 rounded-full"></div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-[2rem] font-extrabold text-pink-500 mb-1 leading-none">3</div>
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Technicians</div>
                  <div className="h-1.5 w-14 bg-pink-50 rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-pink-500 rounded-full"></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Technician Roster */}
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex-1">
              <h3 className="font-extrabold text-slate-800 mb-8 text-[17px]">Technician Roster</h3>

              <div className="space-y-6">
                {/* Tech 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-sm">ML</div>
                    <div>
                      <p className="font-extrabold text-[13px] text-slate-800">Mike Lee</p>
                      <p className="text-[11px] font-medium text-slate-400">Maintenance Lead</p>
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-50"></div>
                </div>

                {/* Tech 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-sm">AC</div>
                    <div>
                      <p className="font-extrabold text-[13px] text-slate-800">Anna Chen</p>
                      <p className="text-[11px] font-medium text-slate-400">IT Support</p>
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-50"></div>
                </div>

                {/* Tech 3 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-sm">DK</div>
                    <div>
                      <p className="font-extrabold text-[13px] text-slate-800">David Kim</p>
                      <p className="text-[11px] font-medium text-slate-400">AV Specialist</p>
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 ring-4 ring-slate-50"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Notification History Table */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <h3 className="font-extrabold text-slate-800 mb-8 text-[17px]">Recent Notification History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 pl-2 w-32">Time</th>
                  <th className="pb-4 w-32">Type</th>
                  <th className="pb-4">Message</th>
                  <th className="pb-4 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4.5 pl-2 text-xs font-semibold text-slate-500">10:45 AM</td>
                  <td className="py-4.5">
                    <span className="bg-pink-50 text-pink-600 text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider">BROADCAST</span>
                  </td>
                  <td className="py-4.5 text-[13px] font-medium text-slate-700">Campus library will be closed tomorrow for system maintenance...</td>
                  <td className="py-4.5 text-right pr-2">
                    <span className="text-[11px] font-bold text-emerald-500 flex items-center justify-end gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Delivered
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4.5 pl-2 text-xs font-semibold text-slate-500">09:12 AM</td>
                  <td className="py-4.5">
                    <span className="bg-indigo-50 text-indigo-600 text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider">ALERT</span>
                  </td>
                  <td className="py-4.5 text-[13px] font-medium text-slate-700">New security policy update available for all technician roles.</td>
                  <td className="py-4.5 text-right pr-2">
                    <span className="text-[11px] font-bold text-emerald-500 flex items-center justify-end gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Delivered
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4.5 pl-2 text-xs font-semibold text-slate-500">Yesterday</td>
                  <td className="py-4.5">
                    <span className="bg-red-50 text-red-500 text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider">CRITICAL</span>
                  </td>
                  <td className="py-4.5 text-[13px] font-medium text-slate-700">Unusual login activity detected from region: Jakarta, ID.</td>
                  <td className="py-4.5 text-right pr-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center justify-end gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Archived
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>


      {/* FLOATING ACTION BUTTON */}
      <button
        className="absolute bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all z-50 text-2xl font-light group"
      >
        +
        {/* Tooltip */}
        <span className="absolute right-[120%] bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          New User
        </span>
      </button>

    </DashboardLayout >
  );
};

export default AdminDashboard;
