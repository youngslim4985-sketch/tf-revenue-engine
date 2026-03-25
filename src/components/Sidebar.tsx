/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, Users, Send, Calendar, Settings, BarChart3, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'CRM / Leads', icon: Users },
    { id: 'outbound', label: 'Outbound Engine', icon: Send },
    { id: 'followup', label: 'Follow-Up Engine', icon: Zap },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#141414] text-[#E4E3E0] h-screen flex flex-col border-r border-[#2A2A2A]">
      <div className="p-6 border-b border-[#2A2A2A]">
        <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F27D26] rounded flex items-center justify-center text-black">
            <Zap size={20} fill="currentColor" />
          </div>
          T&F REVENUE
        </h1>
        <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1 font-mono">Autonomous Sales Machine</p>
      </div>
      
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200",
              activeTab === item.id 
                ? "bg-[#2A2A2A] text-[#F27D26] border-r-2 border-[#F27D26]" 
                : "text-[#8E9299] hover:text-[#E4E3E0] hover:bg-[#1A1A1A]"
            )}
          >
            <item.icon size={18} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-6 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-xs font-bold">
            YS
          </div>
          <div>
            <p className="text-xs font-bold">Young Slim</p>
            <p className="text-[10px] opacity-50">Admin Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
