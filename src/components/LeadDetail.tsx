/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Calendar, Phone, Mail, ArrowLeft, Zap } from 'lucide-react';
import { Lead, ConversationMessage } from '../types';
import { cn, formatDate } from '../lib/utils';
import { getGeminiResponse } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
  onUpdateStatus: (status: Lead['status']) => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onBack, onUpdateStatus }) => {
  const [messages, setMessages] = useState<ConversationMessage[]>(lead.conversations || []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(lead.conversations || []);
  }, [lead.conversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    const leadRef = doc(db, 'leads', lead.id);
    
    try {
      await updateDoc(leadRef, {
        conversations: arrayUnion(userMessage)
      });
      
      setInput('');
      setIsTyping(true);

      const systemPrompt = `You are an autonomous sales agent for T&F Revenue Engine. 
      You are talking to ${lead.name} (${lead.email}). 
      The current status of this lead is ${lead.status}.
      Your goal is to move them towards booking a meeting. 
      Be professional, persuasive, and concise. 
      If they ask about price, say it depends on the service level but typically ranges from $500 to $2000.
      Always try to find a time for a quick 15-min discovery call.`;

      const aiResponse = await getGeminiResponse(input, systemPrompt);
      
      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || "I'm sorry, I couldn't process that. Let me get a human to help.",
        timestamp: new Date().toISOString(),
      };

      await updateDoc(leadRef, {
        conversations: arrayUnion(assistantMessage)
      });
    } catch (error) {
      console.error("Firestore/AI Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left Panel: Info */}
      <div className="w-1/3 border-r border-[#141414]/10 p-8 space-y-8 overflow-y-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#141414]/40 hover:text-[#141414] transition-colors">
          <ArrowLeft size={14} />
          Back to CRM
        </button>

        <div className="space-y-4">
          <div className="w-20 h-20 rounded-lg bg-[#141414] text-[#E4E3E0] flex items-center justify-center text-3xl font-bold">
            {lead.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-serif italic">{lead.name}</h2>
            <p className="text-xs font-mono text-[#141414]/60 uppercase tracking-widest">Lead from {lead.source}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-[#141414]/40" />
            <span>{lead.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-[#141414]/40" />
            <span>{lead.phone || 'No phone provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-[#141414]/40" />
            <span>Created {formatDate(lead.createdAt)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-50">Current Status</p>
          <div className="flex flex-wrap gap-2">
            {(['new', 'contacted', 'follow-up', 'booked', 'lost'] as const).map((status) => (
              <button
                key={status}
                onClick={() => onUpdateStatus(status)}
                className={cn(
                  "px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-all",
                  lead.status === status 
                    ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" 
                    : "bg-white text-[#141414]/40 border-[#141414]/10 hover:border-[#141414]/40"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-[#141414]/10">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 p-3 bg-[#141414]/5 rounded text-xs font-bold hover:bg-[#141414]/10 transition-colors">
              <Zap size={14} />
              Follow Up
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-[#F27D26] text-black rounded text-xs font-bold hover:bg-[#D96A1D] transition-colors">
              <Calendar size={14} />
              Book Call
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Chat */}
      <div className="flex-1 flex flex-col bg-[#F8F8F8]">
        <div className="p-4 border-b border-[#141414]/10 bg-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">AI Agent Active</span>
          </div>
          <span className="text-[10px] font-mono opacity-40">Conversation ID: {lead.id}</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <Bot size={48} />
              <p className="text-sm italic font-serif">No messages yet. Start the conversation or launch the outbound engine.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex gap-4 max-w-[80%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-8 h-8 rounded flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-[#F27D26] text-black" : "bg-[#141414] text-[#E4E3E0]"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-lg text-sm shadow-sm",
                msg.role === 'user' ? "bg-[#F27D26] text-black" : "bg-white text-[#141414]"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <p className="text-[10px] opacity-40 mt-2 font-mono">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded bg-[#141414] text-[#E4E3E0] flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-lg bg-white text-[#141414] shadow-sm flex gap-1">
                <div className="w-1 h-1 bg-[#141414]/40 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-[#141414]/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-[#141414]/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-[#141414]/10">
          <div className="relative">
            <input
              type="text"
              placeholder="Type a message to the lead..."
              className="w-full pl-4 pr-12 py-4 bg-[#141414]/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#F27D26] outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#141414] text-[#E4E3E0] rounded hover:bg-[#2A2A2A] transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-center mt-3 opacity-40 font-mono uppercase tracking-widest">
            AI Agent will respond based on your sales strategy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
