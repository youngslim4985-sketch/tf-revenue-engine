/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, Calendar, Zap } from 'lucide-react';
import { Lead } from '../types';
import { cn, formatDate } from '../lib/utils';

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    phone: '+1 555 0123',
    source: 'IG Ad',
    status: 'new',
    createdAt: new Date().toISOString(),
    conversations: [],
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@techcorp.io',
    phone: '+1 555 0456',
    source: 'LinkedIn',
    status: 'booked',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    conversations: [],
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    email: 'marcus.j@gmail.com',
    phone: '+1 555 0789',
    source: 'Direct',
    status: 'contacted',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    conversations: [],
  },
  {
    id: '4',
    name: 'Elena Gilbert',
    email: 'elena@mystic.com',
    phone: '+1 555 0999',
    source: 'FB Form',
    status: 'follow-up',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    conversations: [],
  },
];

interface LeadListProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onOpenAddModal: () => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, onSelectLead, onOpenAddModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'follow-up': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'booked': return 'bg-green-100 text-green-700 border-green-200';
      case 'lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-8 bg-[#E4E3E0] min-h-screen">
      <div className="bg-white rounded-lg border border-[#141414]/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#141414]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif italic text-[#141414]">CRM / Lead Management</h2>
            <p className="text-xs font-mono text-[#141414]/60 uppercase tracking-widest mt-1">Manage your autonomous sales pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#141414]/40" size={16} />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="pl-10 pr-4 py-2 bg-[#141414]/5 border-none rounded text-sm focus:ring-2 focus:ring-[#F27D26] outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-[#141414]/5 rounded hover:bg-[#141414]/10 transition-colors">
              <Filter size={18} className="text-[#141414]" />
            </button>
            <button 
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-[#F27D26] text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-[#D96A1D] transition-colors"
            >
              Add Lead
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#141414]/5">
                <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#141414]/60">Lead Name</th>
                <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#141414]/60">Status</th>
                <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#141414]/60">Contact Info</th>
                <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#141414]/60">Source</th>
                <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#141414]/60">Created</th>
                <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#141414]/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]/5">
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-[#141414]/5 transition-colors group cursor-pointer"
                  onClick={() => onSelectLead(lead)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-bold text-xs">
                        {lead.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-[#141414] group-hover:text-[#F27D26] transition-colors">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
                      getStatusColor(lead.status)
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-[#141414]/60">
                        <Mail size={12} />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-xs text-[#141414]/60">
                          <Phone size={12} />
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-[#141414]/60">{lead.source}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#141414]/60">{formatDate(lead.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-[#141414]/5 rounded hover:bg-[#141414]/10 text-[#141414]" title="Send Message">
                        <Zap size={14} />
                      </button>
                      <button className="p-1.5 bg-[#141414]/5 rounded hover:bg-[#141414]/10 text-[#141414]" title="Book Meeting">
                        <Calendar size={14} />
                      </button>
                      <button className="p-1.5 bg-[#141414]/5 rounded hover:bg-[#141414]/10 text-[#141414]">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadList;
