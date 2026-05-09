import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddLeadModal = ({ isOpen, onClose, onAddLead, isAddingLead }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddLead({
      name,
      company,
      phone,
      status: 'New',
      createdAt: new Date().toISOString(),
      discussions: []
    });

    // Reset and close
    setName('');
    setCompany('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 className="text-xl font-semibold text-slate-900">Add New Lead</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-slate-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
              placeholder="e.g. +1 (555) 000-0000"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-slate-700 text-sm font-medium hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isAddingLead}
              className="bg-black text-white px-5 py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingLead ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
