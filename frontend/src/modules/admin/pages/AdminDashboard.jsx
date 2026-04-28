import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AdminSidebar from '../../../components/layout/AdminSidebar';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getAllUsers } from '../../../services/api';
import { getAllTickets } from '../../ticket/services/ticketService';
import { Activity, Users, Ticket, CheckCircle, Calendar, AlertTriangle, ArrowUpRight } from 'lucide-react';

const ChartSkeleton = () => (
  <div className="flex items-end justify-between h-48 gap-2 pt-6 border-b border-slate-100 pb-2">
      {[...Array(7)].map((_, i) => (
          <div key={i} className="flex-1 max-w-[40px] bg-slate-100 rounded-t-lg h-full animate-pulse opacity-50" style={{ height: `${Math.random() * 60 + 20}%`}}></div>
      ))}
  </div>
);

const ActivitiesSkeleton = () => (
  <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4">
             <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-200 shrink-0"></div>
             <div className="w-full">
                 <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4 mb-2"></div>
                 <div className="h-3 bg-slate-100 rounded animate-pulse w-full mb-2"></div>
                 <div className="h-2 bg-slate-100 rounded animate-pulse w-1/4"></div>
             </div>
          </div>
      ))}
  </div>
);

const GrowthChart = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end justify-between h-56 gap-3 pt-6 pb-4">
      {data.map((item, index) => {
        const heightPercentage = item.count === 0 ? 0 : Math.max((item.count / maxCount) * 100, 8);
        return (
          <div key={index} className="flex flex-col items-center flex-1 group">
             <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 whitespace-nowrap">
                {item.count} Users
             </div>
             <div className="w-full max-w-[40px] h-full bg-[#f0f3ff] rounded-2xl relative overflow-hidden flex items-end">
                <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${heightPercentage}%` }}
                   transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                   className="w-full bg-gradient-to-t from-[#5b3cdd] to-[#7459f7] rounded-2xl"
                />
             </div>
             <span className="text-[11px] font-semibold text-slate-400 mt-3">{item.day}</span>
          </div>
        )
      })}
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, dynamic, loading }) => {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(91,60,221,0.08)] transition-all flex flex-col justify-between h-[160px]">
       <div className="flex justify-between items-start mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#f0f3ff] text-[#5b3cdd] flex items-center justify-center">
             {React.cloneElement(icon, { className: 'w-6 h-6' })}
          </div>
          <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
             {trend}
          </span>
       </div>
       <div>
         {loading ? (
            <div className="h-10 bg-slate-100 rounded animate-pulse w-1/2 mb-2"></div>
         ) : (
            <h3 className="font-editorial text-[2.5rem] text-[#121c2c] leading-none mb-1">{value}</h3>
         )}
         <p className="font-['Manrope'] text-[13px] font-bold text-slate-400">{title}</p>
       </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeTickets, setActiveTickets] = useState(0);
  const [userGrowth, setUserGrowth] = useState([]);
  const [mostActiveUser, setMostActiveUser] = useState({ name: 'N/A', count: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const usersResponse = await getAllUsers();
        const users = usersResponse.data || [];
        setTotalUsers(users.length);

        const growthData = Array(7).fill(0);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        users.forEach((u) => {
          if (!u.id) return;
          try {
             const timestamp = parseInt(u.id.substring(0, 8), 16) * 1000;
             const userDate = new Date(timestamp);
             if (userDate >= sevenDaysAgo && userDate <= today) {
               const diffTime = Math.abs(today.getTime() - userDate.getTime());
               const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
               if (diffDays >= 0 && diffDays < 7) {
                 growthData[6 - diffDays]++;
               }
             }
          } catch (e) {}
        });
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const formattedGrowth = growthData.map((count, index) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6 - index));
          return { day: days[d.getDay()], count };
        });
        setUserGrowth(formattedGrowth);

        const ticketsResponse = await getAllTickets();
        const tickets = ticketsResponse || [];
        const activeCount = tickets.filter(
          (t) => t.status === 'OPEN' || t.status === 'ACTIVE' || t.status === 'IN_PROGRESS'
        ).length;
        setActiveTickets(activeCount);

        const auditResponse = await axios.get('http://localhost:8080/admin/audit?size=50');
        const logs = auditResponse.data || [];
        
        setRecentActivities(logs.slice(0, 5));

        const userActivityMap = {};
        logs.forEach(log => {
          const adminName = log.adminName || log.adminEmail || 'Unknown';
          userActivityMap[adminName] = (userActivityMap[adminName] || 0) + 1;
        });

        let maxCount = 0;
        let mostActiveName = 'N/A';
        for (const [name, count] of Object.entries(userActivityMap)) {
          if (count > maxCount && name !== 'SYSTEM' && name !== 'UNKNOWN_ADMIN') {
            maxCount = count;
            mostActiveName = name;
          }
        }
        setMostActiveUser({ name: mostActiveName, count: maxCount });

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="relative font-['Inter']">
        <div className="mb-8">
           <h2 className="font-['Manrope'] text-[2.25rem] font-extrabold text-[#121c2c] tracking-tight mb-2">System Overview</h2>
           <p className="font-editorial italic text-slate-500 text-[1.2rem]">Monitor real-time system metrics, user growth, and operational activity.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={totalUsers} icon={<Users />} trend="+12%" dynamic loading={loading} />
            <StatCard title="Active Tickets" value={activeTickets} icon={<Ticket />} trend="-3%" dynamic loading={loading} />
            <StatCard title="Total Bookings" value="1,248" icon={<Calendar />} trend="+8%" dynamic={false} loading={false} />
            <StatCard title="Pending Approvals" value="34" icon={<CheckCircle />} trend="+2%" dynamic={false} loading={false} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2 flex flex-col gap-6">
                <div className="bg-[#ffffff] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#f0f3ff] flex-1">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-['Manrope'] font-bold text-slate-800 text-[1.1rem]">User Registration Growth</h3>
                      <span className="text-[10px] font-bold bg-[#f0f3ff] text-[#5b3cdd] px-3 py-1.5 rounded-full uppercase tracking-widest">Last 7 Days</span>
                   </div>
                   {loading ? <ChartSkeleton /> : <GrowthChart data={userGrowth} />}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-[#5b3cdd] to-[#7459f7] text-white rounded-[2rem] p-8 shadow-lg relative overflow-hidden h-[180px] flex flex-col justify-center">
                        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none"><Activity size={140} /></div>
                        <h3 className="font-['Manrope'] font-bold text-white/70 text-xs mb-3 uppercase tracking-widest">Most Active User</h3>
                        {loading ? (
                            <div className="h-10 bg-white/20 rounded animate-pulse w-3/4 mb-2"></div>
                        ) : (
                            <>
                              <p className="font-editorial italic text-4xl mb-2 text-white">{mostActiveUser.name}</p>
                              <p className="font-semibold text-[13px] text-white/90 font-['Inter']">{mostActiveUser.count} Interactions this week</p>
                            </>
                        )}
                    </div>

                    <div className="bg-[#fff0f3] rounded-[2rem] p-8 border border-[#ffe0e6] relative h-[180px] flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#ffccd5] text-[#e63946] flex items-center justify-center"><AlertTriangle size={20} /></div>
                            <span className="text-[9px] font-black uppercase text-white bg-[#e63946] px-2.5 py-1.5 rounded-full tracking-widest shadow-sm shadow-red-200">Critical</span>
                        </div>
                        <h3 className="font-['Manrope'] font-bold text-[#800f2f] text-[15px] mb-1">Server DB Timeout</h3>
                        <p className="text-[12px] font-medium text-[#c1121f]/80 mb-auto leading-relaxed">Main database is experiencing high latency during peak hours.</p>
                        <button className="text-[#e63946] font-bold text-xs flex items-center gap-1 hover:text-[#800f2f] transition-colors mt-2">Review Issue <ArrowUpRight size={14}/></button>
                    </div>
                </div>
            </div>

            <div className="bg-[#ffffff] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-[#f0f3ff] flex flex-col h-full xl:col-span-1">
               <h3 className="font-['Manrope'] font-bold text-slate-800 text-[1.1rem] mb-8">Recent System Activity</h3>
               <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                  {loading ? <ActivitiesSkeleton /> : (
                      recentActivities.length > 0 ? (
                          recentActivities.map((activity, idx) => (
                              <div key={activity.id || idx} className="flex gap-4">
                                  <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-[#7459f7] ring-4 ring-[#f0f3ff] shrink-0"></div>
                                  <div>
                                      <p className="font-bold text-[13px] text-slate-800 mb-0.5 font-['Inter'] leading-snug">
                                          {activity.adminName} <span className="font-medium text-slate-500">performed</span> {activity.actionType.replace(/_/g, ' ')}
                                      </p>
                                      <p className="text-[11.5px] font-medium text-slate-400 mb-1.5 leading-snug">{activity.description}</p>
                                      <p className="text-[9px] font-extrabold text-[#7459f7] uppercase tracking-widest">{new Date(activity.timestamp).toLocaleString()}</p>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <p className="text-sm font-medium text-slate-400 text-center py-10">No recent activities available.</p>
                      )
                  )}
               </div>
               <button className="w-full mt-8 bg-[#f0f3ff] text-[#5b3cdd] font-bold text-[13px] py-3.5 rounded-2xl hover:bg-[#e8e0fd] transition-colors">
                  View All Logs
               </button>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
