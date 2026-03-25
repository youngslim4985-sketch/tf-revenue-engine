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
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Mon', leads: 12, booked: 2 },
  { name: 'Tue', leads: 19, booked: 4 },
  { name: 'Wed', leads: 15, booked: 3 },
  { name: 'Thu', leads: 22, booked: 6 },
  { name: 'Fri', leads: 30, booked: 8 },
  { name: 'Sat', leads: 10, booked: 1 },
  { name: 'Sun', leads: 8, booked: 1 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 bg-[#E4E3E0] min-h-screen overflow-y-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif italic text-[#141414]">Revenue Overview</h2>
          <p className="text-sm text-[#141414]/60 font-mono">Performance metrics for the last 7 days</p>
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
          { label: 'Total Leads', value: '1,284', change: '+12.5%', icon: Users, positive: true },
          { label: 'Active Conversations', value: '42', change: '+5.2%', icon: MessageSquare, positive: true },
          { label: 'Booked Meetings', value: '18', change: '-2.1%', icon: Calendar, positive: false },
          { label: 'Conversion Rate', value: '14.2%', change: '+1.4%', icon: TrendingUp, positive: true },
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
              <BarChart data={data}>
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
          <h3 className="text-sm font-serif italic mb-6">Revenue Growth (Projected)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stroke="#F27D26" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
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
          {[
            { name: 'Alex Rivera', action: 'New lead captured', time: '2 mins ago', source: 'IG Ad' },
            { name: 'Sarah Chen', action: 'Meeting booked', time: '15 mins ago', source: 'Follow-up' },
            { name: 'Marcus Johnson', action: 'AI response sent', time: '1 hour ago', source: 'Direct' },
            { name: 'Elena Gilbert', action: 'Follow-up #2 sent', time: '3 hours ago', source: 'FB Form' },
          ].map((activity, i) => (
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
