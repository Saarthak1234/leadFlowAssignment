import React, { useState } from 'react';
import { formatDistanceToNow, parseISO, format, isBefore, isToday } from 'date-fns';
import { X, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const TimelineDialog = ({ lead, onClose, onAddDiscussion, onStatusChange, isAddingDiscussion, onCompleteFollowUp }) => {
  const [newNote, setNewNote] = useState('');
  const [setFollowUp, setSetFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');

  if (!lead) return null;

  const isWon = lead.status === 'Won';
  const hasFollowUp = !!lead.nextFollowUp;
  const followUpParsedDate = hasFollowUp ? parseISO(lead.nextFollowUp) : null;
  const isOverdue = hasFollowUp && isBefore(followUpParsedDate, new Date()) && !isToday(followUpParsedDate);

  const handleSaveNote = () => {
    if (!newNote.trim() || isWon) return;

    let nextFollowUp = null;
    if (setFollowUp && followUpDate && followUpTime) {
      nextFollowUp = new Date(`${followUpDate}T${followUpTime}`).toISOString();
    }

    const newDiscussion = {
      content: newNote,
      followUpDate: nextFollowUp,
      createdAt: new Date().toISOString(),
      // In a real app, backend assigns ID. Mocking it here.
      _id: Date.now().toString()
    };

    onAddDiscussion(lead._id, newDiscussion);
    
    // Reset form
    setNewNote('');
    setSetFollowUp(false);
    setFollowUpDate('');
    setFollowUpTime('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-white">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{lead.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-500 text-sm">
                {lead.company} {lead.phone ? `• ${lead.phone}` : ''}
              </p>
              {hasFollowUp && (
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 font-medium ${
                    isOverdue ? 'bg-red-50 text-red-700 border-red-200' : 'bg-[#fef3c7] text-[#92400e] border-[#92400e]/20'
                  }`}>
                    {isOverdue ? <AlertCircle size={10} /> : <Calendar size={10} />}
                    {format(followUpParsedDate, 'MMM d')}
                  </span>
                  <button 
                    onClick={() => onCompleteFollowUp(lead._id)}
                    className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-emerald-600 border border-transparent hover:border-slate-200"
                    title="Mark follow-up as complete"
                  >
                    <CheckCircle size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={lead.status}
              onChange={(e) => onStatusChange(lead._id, e.target.value)}
              className="bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-slate-900 text-sm rounded-md focus:ring-1 focus:ring-black focus:border-black p-2 font-medium transition-all duration-200 hover:bg-white/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] outline-none"
            >
              {statusOptions.map(status => (
                <option key={status} value={status} className="bg-white/90 backdrop-blur-md">{status}</option>
              ))}
            </select>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Timeline Feed */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {(!lead.discussions || lead.discussions.length === 0) ? (
            <div className="text-center text-slate-500 py-10 text-sm">No discussions yet. Start by logging a note below.</div>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
              {lead.discussions.map((discussion, index) => {
                const isOverdueDisc = discussion.followUpDate && isBefore(parseISO(discussion.followUpDate), new Date()) && !isToday(parseISO(discussion.followUpDate));
                return (
                <div key={discussion._id || index} className="relative pl-6">
                  {/* Timeline Node */}
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-400 border border-white"></div>
                  
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {formatDistanceToNow(parseISO(discussion.createdAt), { addSuffix: true })}
                      </span>
                      <span className="text-xs text-slate-400">
                        {format(parseISO(discussion.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-slate-800 text-sm whitespace-pre-wrap">
                      {discussion.content}
                    </p>

                    {discussion.followUpDate && (
                      <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs font-semibold ${
                        isOverdueDisc 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-[#fef3c7] text-[#92400e] border-[#92400e]/20'
                      }`}>
                        {isOverdueDisc ? <AlertCircle size={14} /> : <Calendar size={14} />}
                        {isOverdueDisc ? 'Overdue Follow-up:' : 'Follow-up set for:'} {format(parseISO(discussion.followUpDate), 'MMM d, yyyy h:mm a')}
                      </div>
                    )}
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>

        {/* Footer / Input Area */}
        <div className="p-6 border-t border-slate-200 bg-white">
          {isWon ? (
            <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-md">
              <p className="text-slate-500 text-sm font-medium">This lead has been Won. No further discussions can be logged.</p>
            </div>
          ) : (
            <>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a new discussion..."
                className="w-full bg-white border border-slate-300 rounded-md p-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none resize-none min-h-[100px] transition-colors"
              />
              
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={setFollowUp}
                      onChange={(e) => setSetFollowUp(e.target.checked)}
                      className="w-4 h-4 text-black rounded border-slate-300 focus:ring-black accent-black"
                    />
                    <span className="text-sm font-medium text-slate-700">Set Follow-up</span>
                  </label>

                  {setFollowUp && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative">
                        <Calendar size={16} className="absolute left-2.5 top-2.5 text-slate-400" />
                        <input 
                          type="date" 
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                        />
                      </div>
                      <div className="relative">
                        <Clock size={16} className="absolute left-2.5 top-2.5 text-slate-400" />
                        <input 
                          type="time" 
                          value={followUpTime}
                          onChange={(e) => setFollowUpTime(e.target.value)}
                          className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleSaveNote}
                  disabled={!newNote.trim() || isAddingDiscussion}
                  className="bg-black text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingDiscussion ? "Saving..." : "Save Note"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineDialog;
