/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LeadStatus = 'new' | 'contacted' | 'follow-up' | 'booked' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: LeadStatus;
  lastContactedAt?: string;
  createdAt: string;
  notes?: string;
  conversations: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeConversations: number;
  bookedMeetings: number;
  conversionRate: number;
}
