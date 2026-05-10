import React, { useState, useEffect } from 'react';
import { Plus, Pin } from 'lucide-react';
import { isToday, parseISO, isBefore, differenceInDays } from 'date-fns';
import { Search } from 'lucide-react';
import LeadCard from './LeadCard';
import TimelineDialog from './TimelineDialog';
import AddLeadModal from './AddLeadModal';
import { sortLeads } from '../utils/leadHelpers';
import { toast } from 'sonner';

const filters = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const timeFilters = ['All Time', 'Today', 'Overdue', 'Recently Added'];

// Mock initial data for demonstration since backend is not connected
const initialMockLeads = [
  {
    _id: '1',
    name: 'Sarah Connor',
    company: 'TechCorp',
    phone: '+1 555-0101',
    status: 'New',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    nextFollowUp: new Date().toISOString(), // Today
    discussions: [
      {
        _id: 'd1',
        content: 'Initial inquiry received via website.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        followUpDate: new Date().toISOString(),
      }
    ]
  },
  {
    _id: '2',
    name: 'John Smith',
    company: 'Acme Inc',
    phone: '+1 555-0202',
    status: 'CONTACTED',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    nextFollowUp: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    discussions: [
      {
        _id: 'd2',
        content: 'Called and left a voicemail.',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      }
    ]
  }
];

import { Link, useNavigate } from 'react-router-dom';

const LeadDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isTestUser = user?.email === 'test@example.com';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const [isSeeding, setIsSeeding] = useState(false);
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('http://localhost:5000/api/leads/seed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        toast.success("Seed data generated successfully!");
        // Refresh leads
        const leadsResponse = await fetch('http://localhost:5000/api/leads', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await leadsResponse.json();
        setLeads(data);
      } else {
        toast.error("Failed to generate seed data");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    const fetchLeads = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:5000/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLeads(data);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, [token]);

  const [isAddingLead, setIsAddingLead] = useState(false);

  const handleAddLead = async (newLead) => {
    setIsAddingLead(true);
    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newLead)
      });
      if (response.ok) {
        const createdLead = await response.json();
        setLeads(prev => [createdLead, ...prev]);
        setIsAddModalOpen(false); // Close modal on success
        toast.success("Lead added successfully");
      } else {
        toast.error("Failed to add lead");
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error("An error occurred");
    } finally {
      setIsAddingLead(false);
    }
  };

  const [isAddingDiscussion, setIsAddingDiscussion] = useState(false);

  const handleAddDiscussion = async (leadId, newDiscussion) => {
    setIsAddingDiscussion(true);
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${leadId}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDiscussion)
      });
      if (response.ok) {
        const createdDiscussion = await response.json();
        
        // Update UI
        setLeads(prevLeads => prevLeads.map(lead => {
          if (lead._id === leadId) {
            const updatedLead = {
              ...lead,
              discussions: [...(lead.discussions || []), createdDiscussion]
            };
            if (createdDiscussion.followUpDate) {
              updatedLead.nextFollowUp = createdDiscussion.followUpDate;
            }
            if (selectedLead && selectedLead._id === leadId) {
              setSelectedLead(updatedLead);
            }
            return updatedLead;
          }
          return lead;
        }));
        toast.success("Discussion logged successfully");
      } else {
        toast.error("Failed to log discussion");
      }
    } catch (error) {
      console.error('Error adding discussion:', error);
      toast.error("An error occurred");
    } finally {
      setIsAddingDiscussion(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updatedLeadFromDB = await response.json();
        setLeads(prevLeads => prevLeads.map(lead => {
          if (lead._id === leadId) {
            if (selectedLead && selectedLead._id === leadId) {
              setSelectedLead(updatedLeadFromDB);
            }
            return updatedLeadFromDB;
          }
          return lead;
        }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCompleteFollowUp = async (leadId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${leadId}/followup/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const updatedLeadFromDB = await response.json();
        setLeads(prevLeads => prevLeads.map(lead => {
          if (lead._id === leadId) {
            if (selectedLead && selectedLead._id === leadId) {
              setSelectedLead(updatedLeadFromDB);
            }
            return updatedLeadFromDB;
          }
          return lead;
        }));
        toast.success("Follow-up marked as complete");
      } else {
        toast.error("Failed to complete follow-up");
      }
    } catch (error) {
      console.error('Error completing follow-up:', error);
      toast.error("An error occurred");
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('All Time');

  // Filter and Sort Logic
  const filteredLeads = leads.filter(lead => {
    // 1. Status Filter
    if (activeFilter !== 'All' && lead.status !== activeFilter) return false;
    
    // 2. Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(query);
      const matchCompany = lead.company && lead.company.toLowerCase().includes(query);
      if (!matchName && !matchCompany) return false;
    }

    // 3. Time Filter
    if (timeFilter !== 'All Time') {
      const isPast = lead.nextFollowUp && isBefore(parseISO(lead.nextFollowUp), new Date()) && !isToday(parseISO(lead.nextFollowUp));
      const isTodayFollowUp = lead.nextFollowUp && isToday(parseISO(lead.nextFollowUp));
      const isRecent = differenceInDays(new Date(), parseISO(lead.createdAt)) <= 7;

      if (timeFilter === 'Overdue' && !isPast) return false;
      if (timeFilter === 'Today' && !isTodayFollowUp) return false;
      if (timeFilter === 'Recently Added' && !isRecent) return false;
    }

    return true;
  });

  const sortedLeads = sortLeads(filteredLeads);
  
  // Separate into pinned and others for the UI
  const todayFollowUps = sortedLeads.filter(lead => lead.nextFollowUp && isToday(parseISO(lead.nextFollowUp)));
  const otherLeads = sortedLeads.filter(lead => !(lead.nextFollowUp && isToday(parseISO(lead.nextFollowUp))));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-900 rounded flex items-center justify-center">
            <span className="text-slate-900 font-bold text-xl leading-none">L</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">LeadFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4 mr-2">
            {!token ? (
              <>
                <Link 
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup"
                  className="bg-slate-100 text-slate-900 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
              >
                Log out
              </button>
            )}
          </div>
          {isTestUser && (
            <button 
              onClick={handleSeedData}
              disabled={isSeeding}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
            >
              {isSeeding ? "Generating..." : "Generate Seed Data"}
            </button>
          )}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:bg-gray-800 active:scale-[0.98]"
          >
            <Plus size={16} />
            Add New Lead
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* Search and Time Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors bg-white shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {timeFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border shadow-sm ${
                  timeFilter === filter 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Leads Grid */}
        <div className="space-y-8">
          
          {/* Pinned Section */}
          {todayFollowUps.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Pin size={18} className="text-[#92400e] fill-[#92400e]" />
                <h2 className="text-lg font-semibold text-slate-900">Today's Follow-ups</h2>
                <span className="bg-[#fef3c7] text-[#92400e] text-xs py-0.5 px-2 rounded-full font-semibold">
                  {todayFollowUps.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayFollowUps.map(lead => (
                  <LeadCard 
                    key={lead._id} 
                    lead={lead} 
                    onClick={(lead) => setSelectedLead(lead)} 
                    onCompleteFollowUp={handleCompleteFollowUp}
                    onUpdateStatus={handleStatusChange}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Other Leads Section */}
          <section>
            {todayFollowUps.length > 0 && (
              <h2 className="text-lg font-semibold text-slate-900 mb-4 mt-8">All Leads</h2>
            )}
            {otherLeads.length === 0 && todayFollowUps.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">No leads found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherLeads.map(lead => (
                  <LeadCard 
                    key={lead._id} 
                    lead={lead} 
                    onClick={(lead) => setSelectedLead(lead)} 
                    onCompleteFollowUp={handleCompleteFollowUp}
                    onUpdateStatus={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Modals */}
      <AddLeadModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddLead={handleAddLead}
        isAddingLead={isAddingLead}
      />

      <TimelineDialog 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)}
        onAddDiscussion={handleAddDiscussion}
        onStatusChange={handleStatusChange}
        isAddingDiscussion={isAddingDiscussion}
        onCompleteFollowUp={handleCompleteFollowUp}
      />
    </div>
  );
};

export default LeadDashboard;
