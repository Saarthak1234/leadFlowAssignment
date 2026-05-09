import Lead from '../models/Lead.js';
import Discussion from '../models/Discussion.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({}).populate('discussions').sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch leads', error: error.message });
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
// Status fields: New / Contacted / Qualified / Proposal Sent / Won / Lost
const createLead = async (req, res) => {
  const { name, company, phone, status } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const lead = new Lead({
      name,
      company,
      phone,
      status: status || 'New',
    });

    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not create lead', error: error.message });
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Private
const updateLeadStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.status = status;
      const updatedLead = await lead.save();
      
      // Need to populate discussions before returning so frontend gets full object
      await updatedLead.populate('discussions');
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not update lead status', error: error.message });
  }
};

// @desc    Add a discussion to a lead
// @route   POST /api/leads/:id/discussions
// @access  Private
const addDiscussion = async (req, res) => {
  const { content, followUpDate } = req.body;
  const leadId = req.params.id;

  if (!content) {
    return res.status(400).json({ message: 'Discussion content is required' });
  }

  try {
    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const discussion = new Discussion({
      leadId,
      content,
      followUpDate: followUpDate || null,
    });

    await discussion.save();

    // If there is a follow-up date, update the parent lead's nextFollowUp
    if (followUpDate) {
      lead.nextFollowUp = followUpDate;
      await lead.save();
    }

    // Return the new discussion
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not add discussion', error: error.message });
  }
};

// @desc    Mark a lead's follow-up as complete
// @route   PATCH /api/leads/:id/followup/complete
// @access  Private
const completeFollowUp = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.nextFollowUp = null;
      const updatedLead = await lead.save();
      
      await updatedLead.populate('discussions');
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not complete follow-up', error: error.message });
  }
};

export { getLeads, createLead, updateLeadStatus, addDiscussion, completeFollowUp };
