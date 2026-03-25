/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Lead } from '../types';
import { formatDate } from '../lib/utils';

interface DashboardProps {
  leads: Lead[];
}

const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  const totalLeads = leads.length;
  const bookedMeetings = leads.filter(l => l.status === 'booked').length;
  const activeConversations = leads.filter(l => (l.conversations?.length || 0) > 0).length;
  const conversionRate = totalLeads > 0 ? ((bookedMeetings / totalLeads) * 100).toFixed(1) : '0';

  const recentActivity = leads.slice(0, 5).map(l => ({
    name: l.name,
    action: l.status === 'booked' ? 'Meeting booked' : (l.conversations?.length || 0) > 0 ? 'AI response sent' : 'New lead captured',
    time: formatDate(l.createdAt),
    source: l.source
  }));

  const chartData = [
    { name: 'Total', leads: totalLeads, booked: bookedMeetings },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#E4E3E0] min-h-screen overflow-y-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif italic text-[#141414]">Revenue Overview</h2>
          <p className="text-sm text-[#141414]/60 font-mono">Real-time performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#141414] text-[#E4E3E0] text-xs font-bold uppercase tracking-widest rounded hover:bg-[#2A2A2A] transition-colors">
            Generate Report
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: totalLeads.toLocaleString(), change: '+0%', icon: Users, positive: true },
          { label: 'Active Conversations', value: activeConversations.toLocaleString(), change: '+0%', icon: MessageSquare, positive: true },
          { label: 'Booked Meetings', value: bookedMeetings.toLocaleString(), change: '+0%', icon: Calendar, positive: true },
          { label: 'Conversion Rate', value: `${conversionRate}%`, change: '+0%', icon: TrendingUp, positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 border border-[#141414]/10 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#141414]/5 rounded">
                <stat.icon size={20} className="text-[#141414]" />
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <p className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-[#141414]">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-[#141414]/10 rounded-lg shadow-sm">
          <h3 className="text-sm font-serif italic mb-6">Lead Acquisition vs Bookings</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: '4px', color: '#E4E3E0' }}
                  itemStyle={{ color: '#E4E3E0', fontSize: '12px' }}
                />
                <Bar dataKey="leads" fill="#141414" radius={[4, 4, 0, 0]} />
                <Bar dataKey="booked" fill="#F27D26" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 border border-[#141414]/10 rounded-lg shadow-sm">
          <h3 className="text-sm font-serif italic mb-6">Growth Trends</h3>
          <div className="h-64 flex items-center justify-center text-[#141414]/40 text-xs italic">
            Gathering more data to show trends...
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-[#141414]/10 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#141414]/10 flex justify-between items-center">
          <h3 className="text-sm font-serif italic">Recent Lead Activity</h3>
          <button className="text-xs font-bold text-[#F27D26] uppercase tracking-widest">View All</button>
        </div>
        <div className="divide-y divide-[#141414]/5">
          {recentActivity.length === 0 && (
            <div className="p-8 text-center text-[#141414]/40 text-xs italic">No activity yet. Add your first lead to begin.</div>
          )}
          {recentActivity.map((activity, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-[#141414]/5 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#141414]/5 flex items-center justify-center font-bold text-[#141414]">
                  {activity.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#141414] group-hover:text-[#F27D26] transition-colors">{activity.name}</p>
                  <p className="text-xs text-[#141414]/60">{activity.action} via <span className="font-mono">{activity.source}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#141414]/40 text-xs">
                <Clock size={12} />
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
