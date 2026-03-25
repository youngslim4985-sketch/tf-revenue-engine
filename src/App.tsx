/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import { db, auth } from './firebase';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadList from './components/LeadList';
import LeadDetail from './components/LeadDetail';
import AddLeadModal from './components/AddLeadModal';
import { Lead } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) {
      setLeads([]);
      return;
    }

    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      })) as Lead[];
      setLeads(leadsData);
    }, (error) => {
      console.error("Firestore Error (GET leads):", error);
    });

    return () => unsubscribe();
  }, [isAuthReady, user]);

  useEffect(() => {
    if (selectedLead) {
      const updated = leads.find(l => l.id === selectedLead.id);
      if (updated) setSelectedLead(updated);
    }
  }, [leads]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSelectedLead(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleAddLead = async (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'conversations'>) => {
    const existingLead = leads.find(l => l.email.toLowerCase() === newLeadData.email.toLowerCase());
    
    try {
      if (existingLead) {
        const leadRef = doc(db, 'leads', existingLead.id);
        await updateDoc(leadRef, {
          ...newLeadData,
          lastUpdated: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'leads'), {
          ...newLeadData,
          createdAt: serverTimestamp(),
          conversations: [],
        });
      }
    } catch (error) {
      console.error("Firestore Error (WRITE lead):", error);
    }
  };

  const handleUpdateLeadStatus = async (status: Lead['status']) => {
    if (!selectedLead) return;
    try {
      const leadRef = doc(db, 'leads', selectedLead.id);
      await updateDoc(leadRef, { status });
      setSelectedLead(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error("Firestore Error (UPDATE status):", error);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#F27D26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-[#141414] flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter text-[#E4E3E0]">T&F REVENUE</h1>
            <p className="text-xs font-mono uppercase tracking-widest text-[#F27D26]">Autonomous Sales Machine</p>
          </div>
          <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#2A2A2A] shadow-2xl">
            <h2 className="text-xl font-serif italic text-[#E4E3E0] mb-6">Admin Authentication Required</h2>
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-[#F27D26] text-black font-bold uppercase tracking-widest rounded hover:bg-[#D96A1D] transition-all flex items-center justify-center gap-3"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (selectedLead && activeTab === 'leads') {
      return (
        <LeadDetail 
          lead={selectedLead} 
          onBack={() => setSelectedLead(null)}
          onUpdateStatus={handleUpdateLeadStatus}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard leads={leads} />;
      case 'leads':
        return (
          <LeadList 
            leads={leads}
            onSelectLead={setSelectedLead} 
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        );
      case 'outbound':
        return (
          <div className="p-8 bg-[#E4E3E0] min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-3xl font-serif italic">Outbound Engine</h2>
              <p className="text-[#141414]/60">Automated lead discovery and initial outreach. This module scans social platforms and sends personalized DMs/Emails.</p>
              <button className="px-8 py-3 bg-[#141414] text-[#E4E3E0] font-bold uppercase tracking-widest rounded hover:bg-[#2A2A2A] transition-all">
                Launch Campaign
              </button>
            </div>
          </div>
        );
      case 'followup':
        return (
          <div className="p-8 bg-[#E4E3E0] min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <h2 className="text-3xl font-serif italic">Follow-Up Engine</h2>
              <p className="text-[#141414]/60">The "Money Maker". Automatically follows up with leads who haven't replied. 2-3x your conversion rate instantly.</p>
              <div className="bg-white p-6 rounded-lg border border-[#141414]/10 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F27D26]">
                  <div className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse" />
                  Active Sequence
                </div>
                <p className="text-sm font-bold">Standard 7-Day Follow-Up</p>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono uppercase opacity-50">
                  <div>Day 1: Bump</div>
                  <div>Day 3: Value</div>
                  <div>Day 7: Final</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard leads={leads} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#141414] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
      <AddLeadModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddLead}
        existingEmails={leads.map(l => l.email.toLowerCase())}
      />
      <button 
        onClick={handleLogout}
        className="fixed bottom-6 right-6 p-3 bg-[#141414] text-[#E4E3E0] rounded-full border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-all shadow-xl group"
        title="Logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>
  );
}
