import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow, parseISO, isToday, format, isBefore } from 'date-fns';
import { Bell, AlertCircle, CheckCircle, Check, ChevronDown } from 'lucide-react';

const statusColors = {
  'New': 'bg-slate-100 text-slate-800 border-slate-200',
  'Contacted': 'bg-slate-100 text-slate-800 border-slate-200',
  'Qualified': 'bg-[#d1fae5] text-[#065f46] border-[#065f46]/20',
  'Proposal Sent': 'bg-[#d1fae5] text-[#065f46] border-[#065f46]/20',
  'Won': 'bg-[#d1fae5] text-[#065f46] border-[#065f46]/20',
  'Lost': 'bg-[#ffe4e6] text-[#9f1239] border-[#9f1239]/20'
};


const LeadCard = ({ lead, onClick, onCompleteFollowUp, onUpdateStatus }) => {
  const hasFollowUp = !!lead.nextFollowUp;
  const followUpDate = hasFollowUp ? parseISO(lead.nextFollowUp) : null;
  const isPinned = hasFollowUp && isToday(followUpDate);
  const isOverdue = hasFollowUp && isBefore(followUpDate, new Date()) && !isPinned;
  
  let lastNoteSnippet = "No notes yet.";
  let timeAgoText = lead.createdAt ? formatDistanceToNow(parseISO(lead.createdAt), { addSuffix: true }) : '';

  if (lead.discussions && lead.discussions.length > 0) {
    const latestDiscussion = lead.discussions[lead.discussions.length - 1];
    lastNoteSnippet = latestDiscussion.content;
    timeAgoText = formatDistanceToNow(parseISO(latestDiscussion.createdAt), { addSuffix: true });
  }

  const handleComplete = (e) => {
    e.stopPropagation();
    onCompleteFollowUp(lead._id);
  };

  // Pass this down from parent component to handle the API call
  const handleStatusChange = (newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(lead._id, newStatus);
    }
  };

  return (
    <div 
      onClick={() => onClick(lead)}
      className={`
        relative p-4 rounded-xl border cursor-pointer transition-all duration-200 
        hover:bg-slate-50 active:scale-[0.98] bg-white mt-3
        ${isOverdue ? 'border-red-200' : 'border-slate-200'}
      `}
    >
      {(isPinned || isOverdue) && (
        <div className="absolute -top-3 left-4 flex items-center gap-1">
          <div className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 border ${
            isOverdue 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : 'bg-[#fef3c7] text-[#92400e] border-[#92400e]/20'
          }`}>
            {isOverdue ? <AlertCircle size={12} /> : <Bell size={12} />}
            {isOverdue 
              ? `Overdue since ${format(followUpDate, 'MMM d')}` 
              : `Follow-up today at ${format(followUpDate, 'h:mm a')}`}
          </div>
          <button 
            onClick={handleComplete}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 shadow-sm"
            title="Mark follow-up as complete"
          >
            <CheckCircle size={14} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-start mb-2 mt-1">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {lead.name}
            {lead.company && <span className="text-slate-500 font-normal text-sm ml-2">({lead.company})</span>}
          </h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[lead.status] || 'bg-slate-100 border-slate-200'}`}>
          {lead.status}
        </span>
      </div>

      <div className="mt-3">
        <p className="text-slate-600 text-sm line-clamp-2">
          {lastNoteSnippet}
        </p>
        <p className="text-slate-400 text-xs mt-2 font-medium">
          {timeAgoText}
        </p>
      </div>
    </div>
  );
};

export default LeadCard;