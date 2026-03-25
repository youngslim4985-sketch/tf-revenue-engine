/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Lead } from '../types';
import { cn } from '../lib/utils';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (lead: Omit<Lead, 'id' | 'createdAt' | 'conversations'>) => void;
  existingEmails: string[];
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onAdd, existingEmails }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Manual',
    status: 'new' as Lead['status'],
  });
  const [error, setError] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  if (!isOpen) return null;

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    if (existingEmails.includes(email.toLowerCase())) {
      setIsDuplicate(true);
      setError('A lead with this email already exists. Adding will update the existing record.');
    } else {
      setIsDuplicate(false);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Name and Email are required.');
      return;
    }
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-[#141414]/10">
        <div className="p-6 border-b border-[#141414]/10 flex justify-between items-center">
          <h3 className="text-xl font-serif italic">Add New Lead</h3>
          <button onClick={onClose} className="text-[#141414]/40 hover:text-[#141414]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className={cn(
              "p-3 rounded flex items-center gap-2 text-xs font-bold",
              isDuplicate ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : "bg-red-50 text-red-700 border border-red-200"
            )}>
              {isDuplicate ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 bg-[#141414]/5 border-none rounded text-sm focus:ring-2 focus:ring-[#F27D26] outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 bg-[#141414]/5 border-none rounded text-sm focus:ring-2 focus:ring-[#F27D26] outline-none"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Phone Number</label>
            <input 
              type="tel" 
              className="w-full px-4 py-2 bg-[#141414]/5 border-none rounded text-sm focus:ring-2 focus:ring-[#F27D26] outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Source</label>
              <select 
                className="w-full px-4 py-2 bg-[#141414]/5 border-none rounded text-sm focus:ring-2 focus:ring-[#F27D26] outline-none appearance-none"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <option>Manual</option>
                <option>IG Ad</option>
                <option>FB Form</option>
                <option>LinkedIn</option>
                <option>Direct</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Initial Status</label>
              <select 
                className="w-full px-4 py-2 bg-[#141414]/5 border-none rounded text-sm focus:ring-2 focus:ring-[#F27D26] outline-none appearance-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Lead['status'] })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="follow-up">Follow-up</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-3 bg-[#141414] text-[#E4E3E0] font-bold uppercase tracking-widest rounded hover:bg-[#2A2A2A] transition-all"
            >
              {isDuplicate ? 'Update Existing Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
